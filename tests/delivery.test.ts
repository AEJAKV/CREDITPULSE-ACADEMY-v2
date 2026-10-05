import { creditScoreContent } from '../lib/content';
import { validateRichContent } from '../lib/content-validation';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  creditLessons,
  courses,
  getCourse,
  canAccess,
  segmentComplete,
  courseComplete,
  segmentLessons,
} from '../lib/catalog';
import { hashPassword, verifyPassword } from '../lib/store';
const course = getCourse('credit-mastery')!;
test('20 Credit Mastery lessons follow the supplied tier boundaries', () => {
  assert.equal(creditLessons.length, 20);
  assert.equal(new Set(creditLessons.map((l) => l.id)).size, 20);
  assert.deepEqual(
    [0, 1, 2, 3, 4, 5].map((i) => segmentLessons(course, i).length),
    [4, 4, 3, 3, 3, 3],
  );
});
test('tier access is cumulative for every tier', () => {
  for (let approved = 0; approved < 6; approved++)
    for (let lesson = 0; lesson < 6; lesson++)
      assert.equal(canAccess(approved, lesson), lesson <= approved);
});
test('completion depends on every lesson in the segment', () => {
  assert.equal(segmentComplete(course, 1, ['credit-05']), false);
  assert.equal(
    segmentComplete(course, 1, ['credit-05', 'credit-06', 'credit-07', 'credit-08']),
    true,
  );
  assert.equal(segmentComplete(course, 5, []), false);
});
test('Elite course completion requires all lessons', () => {
  assert.equal(
    courseComplete(
      course,
      creditLessons.slice(0, 19).map((l) => l.id),
    ),
    false,
  );
  assert.equal(
    courseComplete(
      course,
      creditLessons.map((l) => l.id),
    ),
    true,
  );
});
test('password verification uses a salted hash', () => {
  const one = hashPassword('an-example-password'),
    two = hashPassword('an-example-password');
  assert.notEqual(one, two);
  assert.equal(verifyPassword('an-example-password', one), true);
  assert.equal(verifyPassword('wrong-password', one), false);
});

test('all 140 PDF lessons are present with exact per-tier counts', () => {
  assert.equal(
    courses.reduce((sum, c) => sum + c.lessons.length, 0),
    140,
  );
  assert.equal(new Set(courses.flatMap((c) => c.lessons.map((l) => l.id))).size, 140);
  for (const course of courses) {
    assert.equal(course.lessons.length, course.total);
    assert.deepEqual(
      [0, 1, 2, 3, 4, 5].map((t) => segmentLessons(course, t).length),
      course.total === 30 ? [5, 5, 5, 5, 5, 5] : [4, 4, 3, 3, 3, 3],
    );
  }
  assert.equal(courses[4].total, 20);
  assert.equal(creditLessons[3].title, 'Correcting Errors on a Credit Report');
  assert.equal(creditLessons[19].title, 'Credit Building After Divorce');
});
test('source lesson preserves the original written check-in and interactive sections', () => {
  assert.equal(creditScoreContent.sections.length, 8);
  assert.equal(creditScoreContent.checkIn?.questions.length, 5);
  assert.equal(
    creditScoreContent.subtitle,
    'Your credit score is a number. It is not your personality.',
  );
  assert.equal(
    creditScoreContent.sections.find((s) => s.id === 'glossary')?.blocks?.[0].items?.length,
    10,
  );
  assert.equal(validateRichContent(creditScoreContent), true);
  const unsafe = structuredClone(creditScoreContent);
  unsafe.sections[0].blocks = [{ type: 'source', url: 'javascript:alert(1)', text: 'Unsafe' }];
  assert.equal(validateRichContent(unsafe), false);
});
