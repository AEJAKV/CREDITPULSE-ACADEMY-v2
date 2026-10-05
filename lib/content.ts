import sourceLesson from '@/content/credit-score-lesson.json';
import type { Lesson, LessonContent } from './types';
// Source lesson wording transcribed from the authenticated live course on 2026-10-02.
export const creditScoreContent = sourceLesson as LessonContent;
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
