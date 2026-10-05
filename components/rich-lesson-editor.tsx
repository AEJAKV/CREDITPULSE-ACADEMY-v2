'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Code2, FileCheck } from 'lucide-react';
import { post } from '@/lib/client';
import type { LessonContent } from '@/lib/types';
export function RichLessonEditor({
  lessonId,
  initial,
}: {
  lessonId: string;
  initial: LessonContent;
}) {
  const [text, setText] = useState(JSON.stringify(initial, null, 2)),
    [error, setError] = useState(''),
    [saved, setSaved] = useState(false),
    [pending, start] = useTransition();
  const router = useRouter();
  return (
    <form
      className="admin-form form-stack"
      onSubmit={(e) => {
        e.preventDefault();
        setError('');
        setSaved(false);
        start(async () => {
          try {
            const content = JSON.parse(text);
            await post('/api/admin', { action: 'content', lessonId, content });
            setSaved(true);
            router.refresh();
          } catch (err) {
            setError((err as Error).message);
          }
        });
      }}
    >
      <div className="section-heading">
        <h2>
          <Code2 size={23} /> Structured lesson editor
        </h2>
        <span>Original lesson / interactive blocks</span>
      </div>
      <p>
        This lesson uses ordered reading blocks to preserve its exact wording, calculators, story,
        written check-in, and glossary. Edit the complete JSON below. Set “published” to false to
        keep it in draft. All text is rendered safely; HTML is not accepted.
      </p>
      <label htmlFor="rich-content">Complete lesson content (JSON)</label>
      <textarea
        className="code-input"
        id="rich-content"
        rows={28}
        value={text}
        spellCheck={false}
        onChange={(e) => {
          setText(e.target.value);
          setSaved(false);
        }}
        required
      />
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="success">
          <FileCheck size={18} /> Lesson saved, including all interactive blocks.
        </p>
      )}
      <button className="button primary" disabled={pending}>
        <Save size={17} />
        {pending ? 'Saving…' : 'Save structured lesson'}
      </button>
      <small>
        To restore the supplied original, paste the contents of content/credit-score-lesson.json
        here and save.
      </small>
    </form>
  );
}
