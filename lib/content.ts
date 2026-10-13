import sourceLesson from '@/content/credit-score-lesson.json';
import credit02Lesson from '@/content/credit-02-lesson.json';
import credit03Lesson from '@/content/credit-03-lesson.json';
import credit04Lesson from '@/content/credit-04-lesson.json';
import credit05Lesson from '@/content/credit-05-lesson.json';
import credit06Lesson from '@/content/credit-06-lesson.json';
import credit07Lesson from '@/content/credit-07-lesson.json';
import credit08Lesson from '@/content/credit-08-lesson.json';
import credit09Lesson from '@/content/credit-09-lesson.json';
import credit10Lesson from '@/content/credit-10-lesson.json';
import credit11Lesson from '@/content/credit-11-lesson.json';
import credit12Lesson from '@/content/credit-12-lesson.json';
import credit13Lesson from '@/content/credit-13-lesson.json';
import credit14Lesson from '@/content/credit-14-lesson.json';
import credit15Lesson from '@/content/credit-15-lesson.json';
import credit16Lesson from '@/content/credit-16-lesson.json';
import credit17Lesson from '@/content/credit-17-lesson.json';
import credit18Lesson from '@/content/credit-18-lesson.json';
import credit19Lesson from '@/content/credit-19-lesson.json';
import credit20Lesson from '@/content/credit-20-lesson.json';
import money01Lesson from '@/content/money-01-lesson.json';
import money02Lesson from '@/content/money-02-lesson.json';
import money03Lesson from '@/content/money-03-lesson.json';
import money04Lesson from '@/content/money-04-lesson.json';
import money05Lesson from '@/content/money-05-lesson.json';
import money06Lesson from '@/content/money-06-lesson.json';
import money07Lesson from '@/content/money-07-lesson.json';
import type { Lesson, LessonContent } from './types';
// Source lesson wording transcribed from the authenticated live course on 2026-10-02.
export const creditScoreContent = sourceLesson as LessonContent;
// Finished lessons by id; anything not listed falls back to placeholderContent().
export const seededContent: Record<string, LessonContent> = {
  'credit-01': creditScoreContent,
  'credit-02': credit02Lesson as LessonContent,
  'credit-03': credit03Lesson as LessonContent,
  'credit-04': credit04Lesson as LessonContent,
  'credit-05': credit05Lesson as LessonContent,
  'credit-06': credit06Lesson as LessonContent,
  'credit-07': credit07Lesson as LessonContent,
  'credit-08': credit08Lesson as LessonContent,
  'credit-09': credit09Lesson as LessonContent,
  'credit-10': credit10Lesson as LessonContent,
  'credit-11': credit11Lesson as LessonContent,
  'credit-12': credit12Lesson as LessonContent,
  'credit-13': credit13Lesson as LessonContent,
  'credit-14': credit14Lesson as LessonContent,
  'credit-15': credit15Lesson as LessonContent,
  'credit-16': credit16Lesson as LessonContent,
  'credit-17': credit17Lesson as LessonContent,
  'credit-18': credit18Lesson as LessonContent,
  'credit-19': credit19Lesson as LessonContent,
  'credit-20': credit20Lesson as LessonContent,
  'money-01': money01Lesson as LessonContent,
  'money-02': money02Lesson as LessonContent,
  'money-03': money03Lesson as LessonContent,
  'money-04': money04Lesson as LessonContent,
  'money-05': money05Lesson as LessonContent,
  'money-06': money06Lesson as LessonContent,
  'money-07': money07Lesson as LessonContent,
};
export function placeholderContent(lesson: Lesson, demo = false): LessonContent {
  return {
    title: lesson.title,
    summary: `A practical introduction to ${lesson.title.toLowerCase()}.`,
    minutes: 10,
    published: demo,
    sections: [
      {
        id: 'overview',
        title: 'What this lesson will cover',
        paragraphs: [
          `This is a sample lesson for the ${lesson.title} topic. The final course material will explain the topic in plain Canadian English, with a practical example, a myth check, and a small action.`,
          'The complete first lesson demonstrates the intended reading experience. This shorter template lets the team review navigation and progression while the remaining material is prepared.',
        ],
      },
      {
        id: 'action',
        title: 'Your action',
        kind: 'action',
        paragraphs: [
          'Write down one question you want the finished lesson to answer. In this preview, you can save a reflection and complete the sample check-in to test your course journey.',
        ],
      },
    ],
    quiz: {
      question: 'What is the purpose of this sample lesson?',
      choices: [
        'To promise a financial outcome.',
        'To demonstrate the course structure and learning flow.',
      ],
      answer: 1,
    },
    sources: [],
  };
}
