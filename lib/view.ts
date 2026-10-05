import { cache } from 'react';
import { getCourse } from './catalog';
import { getContents } from './store';
/** Resolve editable lesson titles once for server-rendered curriculum views. */
export const courseView = cache(async function courseView(id: string) {
  const course = getCourse(id);
  if (!course) return undefined;
  const content = await getContents(course.lessons.map((lesson) => lesson.id));
  return {
    ...course,
    lessons: course.lessons.map((lesson, i) => ({ ...lesson, title: content[lesson.id].title })),
  };
});
