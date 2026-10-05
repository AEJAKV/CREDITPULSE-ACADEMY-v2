import { requireAccount } from '@/lib/auth';
import Link from 'next/link';
import { courses, tiers, segmentLessons } from '@/lib/catalog';
import { getContents } from '@/lib/store';
import { CourseIcon, TierGlyph } from '@/components/visuals';
export const metadata = { title: 'Curriculum' };
export default async function Curriculum({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  await requireAccount(true);
  const query = await searchParams;
  const course = courses.find((c) => c.id === query.course) || courses[0];
  const content = await getContents(course.lessons.map((l) => l.id));
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">APPROVED COURSE STRUCTURE</div>
          <h1>The curriculum studio.</h1>
          <p>Six courses. 140 lessons. Exact tier assignments from your structured-courses PDF.</p>
        </div>
      </div>
      <nav className="curriculum-tabs" aria-label="Select curriculum">
        {courses.map((c, i) => (
          <Link
            key={c.id}
            href={`/admin/curriculum?course=${c.id}`}
            aria-current={c.id === course.id ? 'page' : undefined}
          >
            <CourseIcon index={i} size={18} />
            {c.title}
            <small>{c.total}</small>
          </Link>
        ))}
      </nav>
      <div className="quiet-note">
        <p>
          Only the original credit-score lesson contains complete learning material. Other lessons
          are editable templates; they are previewable in demo mode and stay drafts for real
          accounts until published.
        </p>
      </div>
      <div className="section-heading">
        <h2>{course.title}</h2>
        <span>{course.total} lessons · 6 segments</span>
      </div>
      {tiers.map((tier, i) => (
        <section className="admin-form" key={tier} data-reveal>
          <div className="section-heading">
            <h2>
              <TierGlyph tier={i} size={25} /> {tier} <small>Segment {i + 1}</small>
            </h2>
            <span>{segmentLessons(course, i).length} lessons</span>
          </div>
          <p>{course.segmentNames[i]}</p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Lesson</th>
                  <th>Duration</th>
                  <th>Publication</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {segmentLessons(course, i).map((l) => (
                  <tr key={l.id}>
                    <td>
                      <strong>
                        {l.number}. {content[l.id].title}
                      </strong>
                    </td>
                    <td>{content[l.id].minutes} min</td>
                    <td>
                      <span className="chip">
                        {content[l.id].published ? 'Published / preview' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <Link className="text-link" href={`/admin/curriculum/${l.id}`}>
                        Edit lesson
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </>
  );
}
