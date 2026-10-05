import { randomUUID } from 'node:crypto';
import { currentAccount } from '@/lib/auth';
import { body, checkOrigin, errorResponse, InputError, stringField } from '@/lib/http';
import { getCourse, canAccess, courseComplete, segmentComplete } from '@/lib/catalog';
import { addAudit, deadline, getContent, getSettings, mutateAccount } from '@/lib/store';
import type { Tier } from '@/lib/types';
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const user = await currentAccount();
    if (!user) throw new InputError('Please sign in again.', 401);
    const data = await body(request);
    const course = getCourse(stringField(data.courseId, 'course'));
    if (!course || !course.ready) throw new InputError('This course is still in preparation.', 409);
    const settings = await getSettings();
    await mutateAccount(user.id, async (account) => {
      const state = account.state;
      let enrollment = state.enrollments[course.id];
      if (data.action === 'enroll') {
        if (enrollment) {
          state.activeCourse = course.id;
          return;
        }
        if (state.activeCourse) {
          const oldCourse = getCourse(state.activeCourse)!;
          const oldEnrollment = state.enrollments[oldCourse.id];
          if (!oldEnrollment || !courseComplete(oldCourse, oldEnrollment.completed))
            throw new InputError('Finish your current course before starting a new one.', 409);
        }
        const tier: Tier = state.onboardingComplete ? 0 : state.approvedTier;
        enrollment = {
          courseId: course.id,
          tier,
          completed: [],
          reflections: {},
          startedAt: new Date().toISOString(),
          deadline: deadline(settings.segmentDays),
          saved: [],
        };
        state.enrollments[course.id] = enrollment;
        state.activeCourse = course.id;
        state.onboardingComplete = true;
        return;
      }
      if (!enrollment) throw new InputError('Choose this course before starting.', 403);
      if (data.action === 'complete' || data.action === 'save') {
        const lesson = course.lessons.find((l) => l.id === data.lessonId);
        if (!lesson || !canAccess(enrollment.tier, lesson.tier))
          throw new InputError('This lesson has not been unlocked for your account.', 403);
        const content = await getContent(lesson.id);
        if (!content.published) throw new InputError('This lesson is still being prepared.', 409);
        if (data.action === 'save') {
          enrollment.saved = enrollment.saved.includes(lesson.id)
            ? enrollment.saved.filter((id) => id !== lesson.id)
            : [...enrollment.saved, lesson.id];
          return;
        }
        if (content.checkIn) {
          if (
            !Array.isArray(data.answers) ||
            data.answers.length !== content.checkIn.questions.length ||
            data.acknowledged !== true
          )
            throw new InputError(
              'Answer every question and confirm you have checked your answers.',
            );
          const answers = data.answers.map((value) => stringField(value, 'written answer', 1200));
          enrollment.checkIns ??= {};
          enrollment.checkIns[lesson.id] = { answers, submittedAt: new Date().toISOString() };
          enrollment.reflections[lesson.id] = answers[0];
        } else {
          if (data.answer !== content.quiz.answer)
            throw new InputError('Review the quick check and try once more.');
          enrollment.reflections[lesson.id] = stringField(
            data.reflection,
            'one small action',
            1200,
          );
        }
        if (!enrollment.completed.includes(lesson.id)) enrollment.completed.push(lesson.id);
        if (segmentComplete(course, lesson.tier, enrollment.completed)) {
          enrollment.segmentResults ??= {};
          enrollment.segmentResults[String(lesson.tier)] ??= {
            completedAt: new Date().toISOString(),
            deadline: enrollment.deadline,
          };
        }
        return;
      }
      const segment = Number(data.segment);
      if (!Number.isInteger(segment) || segment < 0 || segment > 5 || segment > enrollment.tier)
        throw new InputError('Invalid segment.');
      if (!segmentComplete(course, segment, enrollment.completed))
        throw new InputError('Complete the lessons in this segment first.', 409);
      if (data.action === 'reapply' || data.action === 'not-now') {
        if (segment === 5 || segment < enrollment.tier)
          throw new InputError('Your next available step is shown on the dashboard.', 409);
        if (
          state.offers.some(
            (o) => o.courseId === course.id && o.segment === segment && o.status === 'pending',
          )
        )
          throw new InputError('Your reapplication request is already pending.', 409);
        state.offers.push({
          id: randomUUID(),
          courseId: course.id,
          segment: segment as Tier,
          status: data.action === 'reapply' ? 'pending' : 'not-yet',
          createdAt: new Date().toISOString(),
        });
        return;
      }
      throw new InputError('Unknown action.');
    });
    await addAudit(user.id, String(data.action), course.id);
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
