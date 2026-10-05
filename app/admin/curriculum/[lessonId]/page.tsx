import { requireAccount } from '@/lib/auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allLessons, tiers } from '@/lib/catalog';
import { getContent } from '@/lib/store';
import { LessonEditor } from '@/components/admin-forms';
export default async function Editor({ params }: { params: Promise<{ lessonId: string }> }) {
  await requireAccount(true);
  const p = await params,
    lesson = allLessons.find((l) => l.id === p.lessonId);
  if (!lesson) notFound();
  return (
    <>
      <div className="breadcrumb">
        <Link href="/admin/curriculum">Curriculum</Link>
        <span>/</span>
        <span>
          {tiers[lesson.tier]} · Lesson {lesson.number}
        </span>
      </div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">LESSON EDITOR</div>
          <h1>{lesson.title}</h1>
          <p>
            Plain-text paragraphs are rendered safely. Save and publish when the material is ready.
          </p>
        </div>
      </div>
      <LessonEditor key={lesson.id} lessonId={lesson.id} initial={await getContent(lesson.id)} />
    </>
  );
}
