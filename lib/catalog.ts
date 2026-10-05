import type { Course } from './types';
import curriculum from '@/content/curriculum.json';
export const tiers = ['Starter', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Elite'] as const;
// Exact course titles, order, and tier assignments from the supplied structured-courses PDF.
export const courses = curriculum as Course[];
export const allLessons = courses.flatMap((course) => course.lessons);
export const creditLessons = courses[0].lessons;
export const segmentNames = courses[0].segmentNames;
export const segmentDescriptions = courses[0].segmentDescriptions;
export function getCourse(id: string) {
  return courses.find((course) => course.id === id);
}
export function segmentLessons(course: Course, tier: number) {
  return course.lessons.filter((lesson) => lesson.tier === tier);
}
export function canAccess(approvedTier: number, lessonTier: number) {
  return lessonTier <= approvedTier;
}
export function segmentComplete(course: Course, tier: number, completed: string[]) {
  const lessons = segmentLessons(course, tier);
  return lessons.length > 0 && lessons.every((lesson) => completed.includes(lesson.id));
}
export function courseComplete(course: Course, completed: string[]) {
  return (
    course.lessons.length > 0 && course.lessons.every((lesson) => completed.includes(lesson.id))
  );
}
