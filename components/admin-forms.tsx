'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Check, Save } from 'lucide-react';
import { post } from '@/lib/client';
import { tiers } from '@/lib/catalog';
import type { LessonContent, Section, Settings } from '@/lib/types';
export function CreateMember() {
  const router = useRouter(),
    [pending, start] = useTransition(),
    [error, setError] = useState(''),
    [success, setSuccess] = useState('');
  return (
    <form
      className="admin-form"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget,
          data = new FormData(form);
        setError('');
        setSuccess('');
        start(async () => {
          try {
            await post('/api/admin', {
              action: 'create-member',
              name: data.get('name'),
              email: data.get('email'),
              password: data.get('password'),
              tier: Number(data.get('tier')),
            });
            setSuccess(
              `Member created: ${data.get('email')}. Share the password through your approved account-access process.`,
            );
            form.reset();
            router.refresh();
          } catch (e) {
            setError((e as Error).message);
          }
        });
      }}
    >
      <div className="section-heading">
        <h2>Create a member</h2>
        <Plus size={20} />
      </div>
      <div className="form-grid">
        <div>
          <label htmlFor="member-name">Full name</label>
          <input id="member-name" name="name" maxLength={100} required />
        </div>
        <div>
          <label htmlFor="member-email">Email address</label>
          <input id="member-email" name="email" type="email" required />
        </div>
        <div>
          <label htmlFor="member-password">Temporary password</label>
          <input
            id="member-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={200}
            required
          />
          <small>Use at least 12 characters.</small>
        </div>
        <div>
          <label htmlFor="member-tier">Verified initial tier</label>
          <select id="member-tier" name="tier">
            {tiers.map((t, i) => (
              <option key={t} value={i}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="success-text" role="status">
          {success}
        </p>
      )}
      <button className="button primary" disabled={pending}>
        {pending ? 'Creating…' : 'Create member account'}
      </button>
    </form>
  );
}
export function ReviewRequest({ memberId, offerId }: { memberId: string; offerId: string }) {
  const router = useRouter(),
    [pending, start] = useTransition(),
    [error, setError] = useState('');
  return (
    <form
      className="review-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setError('');
        start(async () => {
          try {
            await post('/api/admin', {
              action: 'review',
              memberId,
              offerId,
              reference: data.get('reference'),
              decision: data.get('decision'),
            });
            router.refresh();
          } catch (e) {
            setError((e as Error).message);
          }
        });
      }}
    >
      <label htmlFor={`reference-${offerId}`}>Verified approval / review reference</label>
      <input
        id={`reference-${offerId}`}
        name="reference"
        required
        maxLength={200}
        placeholder="Reference from your cash-back approval process"
      />
      <label htmlFor={`decision-${offerId}`}>Review decision</label>
      <select id={`decision-${offerId}`} name="decision">
        <option value="approved">Approved — unlock next tier</option>
        <option value="declined">Not approved — keep current access</option>
      </select>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button className="button primary" disabled={pending}>
        {pending ? 'Recording…' : 'Record verified decision'}
      </button>
      <small>Only record approval after checking the external cash-back decision.</small>
    </form>
  );
}
export function ResetPassword({ memberId }: { memberId: string }) {
  const router = useRouter(),
    [pending, start] = useTransition(),
    [error, setError] = useState(''),
    [success, setSuccess] = useState(false);
  return (
    <form
      className="form-stack"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget,
          data = new FormData(form);
        setError('');
        start(async () => {
          try {
            await post('/api/admin', {
              action: 'reset-password',
              memberId,
              password: data.get('password'),
            });
            setSuccess(true);
            form.reset();
            router.refresh();
          } catch (e) {
            setError((e as Error).message);
          }
        });
      }}
    >
      <label htmlFor="reset-password">New temporary password</label>
      <input
        id="reset-password"
        type="password"
        name="password"
        minLength={12}
        maxLength={200}
        required
        autoComplete="new-password"
      />
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="success-text" role="status">
          Password updated. Previous sessions have been signed out.
        </p>
      )}
      <button className="button secondary" disabled={pending}>
        Reset password & revoke sessions
      </button>
    </form>
  );
}
export function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter(),
    [pending, start] = useTransition(),
    [error, setError] = useState(''),
    [saved, setSaved] = useState(false);
  return (
    <form
      className="admin-form form-stack"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setError('');
        setSaved(false);
        start(async () => {
          try {
            await post('/api/admin', {
              action: 'settings',
              segmentDays: data.get('segmentDays'),
              bonusCopy: data.get('bonusCopy'),
              savingsCopy: data.get('savingsCopy'),
              helpEmail: data.get('helpEmail'),
            });
            setSaved(true);
            router.refresh();
          } catch (e) {
            setError((e as Error).message);
          }
        });
      }}
    >
      <div>
        <label htmlFor="segment-days">Segment target window, in days</label>
        <input
          id="segment-days"
          name="segmentDays"
          type="number"
          min={1}
          max={365}
          defaultValue={settings.segmentDays ?? ''}
        />
        <small>
          Leave blank until approved. Applies to new enrollments and newly approved tiers; existing
          deadlines stay unchanged.
        </small>
      </div>
      <div>
        <label htmlFor="bonus-copy">Confirmed bonus message</label>
        <textarea
          id="bonus-copy"
          name="bonusCopy"
          rows={3}
          defaultValue={settings.bonusCopy}
          maxLength={1000}
        />
        <small>Leave blank until the amount, eligibility, and deadline rules are confirmed.</small>
      </div>
      <div>
        <label htmlFor="savings-copy">Master Savings Book description</label>
        <textarea
          id="savings-copy"
          name="savingsCopy"
          rows={3}
          defaultValue={settings.savingsCopy}
          required
          maxLength={1000}
        />
      </div>
      <div>
        <label htmlFor="help-email">Member support email</label>
        <input id="help-email" name="helpEmail" type="email" defaultValue={settings.helpEmail} />
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {saved && (
        <p className="success-text" role="status">
          <Check size={16} />
          Settings saved.
        </p>
      )}
      <button className="button primary" disabled={pending}>
        <Save size={17} />
        {pending ? 'Saving…' : 'Save settings'}
      </button>
    </form>
  );
}
import { RichLessonEditor } from './rich-lesson-editor';
export function LessonEditor({ lessonId, initial }: { lessonId: string; initial: LessonContent }) {
  if (initial.sections.some((s) => s.blocks?.length))
    return <RichLessonEditor lessonId={lessonId} initial={initial} />;
  return <ParagraphLessonEditor lessonId={lessonId} initial={initial} />;
}
function ParagraphLessonEditor({
  lessonId,
  initial,
}: {
  lessonId: string;
  initial: LessonContent;
}) {
  const router = useRouter(),
    [content, setContent] = useState(initial),
    [sourceText, setSourceText] = useState(JSON.stringify(initial.sources, null, 2)),
    [pending, start] = useTransition(),
    [error, setError] = useState(''),
    [saved, setSaved] = useState(false);
  function sectionChange(index: number, field: 'title' | 'id' | 'paragraphs', value: string) {
    setContent({
      ...content,
      sections: content.sections.map((s, i) =>
        i === index ? { ...s, [field]: field === 'paragraphs' ? value.split('\n\n') : value } : s,
      ),
    });
  }
  return (
    <form
      className="lesson-editor"
      onSubmit={(e) => {
        e.preventDefault();
        setError('');
        setSaved(false);
        start(async () => {
          try {
            const sources = JSON.parse(sourceText);
            await post('/api/admin', {
              action: 'content',
              lessonId,
              content: { ...content, sources },
            });
            setSaved(true);
            router.refresh();
          } catch (e) {
            setError((e as Error).message);
          }
        });
      }}
    >
      <div className="editor-toolbar">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={content.published}
            onChange={(e) => setContent({ ...content, published: e.target.checked })}
          />
          Published to entitled members
        </label>
        <button className="button primary" disabled={pending}>
          <Save size={17} />
          {pending ? 'Saving…' : 'Save lesson'}
        </button>
      </div>
      <div className="admin-form form-stack">
        <div>
          <label htmlFor="lesson-title">Lesson title</label>
          <input
            id="lesson-title"
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="lesson-summary">Short introduction</label>
          <textarea
            id="lesson-summary"
            rows={3}
            value={content.summary}
            onChange={(e) => setContent({ ...content, summary: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="lesson-minutes">Estimated reading minutes</label>
          <input
            id="lesson-minutes"
            type="number"
            min={1}
            max={240}
            value={content.minutes}
            onChange={(e) => setContent({ ...content, minutes: Number(e.target.value) })}
          />
        </div>
      </div>
      <h2>Reading sections</h2>
      {content.sections.map((s, i) => (
        <section className="admin-form editor-section" key={i}>
          <div className="section-heading">
            <h3>Section {i + 1}</h3>
            <button
              className="button quiet"
              type="button"
              disabled={content.sections.length === 1}
              onClick={() =>
                setContent({
                  ...content,
                  sections: content.sections.filter((_, index) => index !== i),
                })
              }
            >
              Remove
            </button>
          </div>
          <div className="form-grid">
            <div>
              <label htmlFor={`section-title-${i}`}>Heading</label>
              <input
                id={`section-title-${i}`}
                value={s.title}
                onChange={(e) => sectionChange(i, 'title', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor={`section-id-${i}`}>Anchor ID</label>
              <input
                id={`section-id-${i}`}
                value={s.id}
                onChange={(e) => sectionChange(i, 'id', e.target.value)}
                pattern="[a-z0-9-]+"
                required
              />
            </div>
          </div>
          <label htmlFor={`section-kind-${i}`}>Section style</label>
          <select
            id={`section-kind-${i}`}
            value={s.kind || ''}
            onChange={(e) =>
              setContent({
                ...content,
                sections: content.sections.map((v, index) =>
                  index === i
                    ? {
                        ...v,
                        kind: e.target.value ? (e.target.value as Section['kind']) : undefined,
                      }
                    : v,
                ),
              })
            }
          >
            <option value="">Standard reading</option>
            <option value="spotlight">Credit Pulse Spotlight</option>
            <option value="myth">Myth check</option>
            <option value="action">Your action</option>
          </select>
          <label htmlFor={`paragraphs-${i}`}>
            Paragraphs — separate each paragraph with a blank line
          </label>
          <textarea
            id={`paragraphs-${i}`}
            rows={7}
            value={s.paragraphs.join('\n\n')}
            onChange={(e) => sectionChange(i, 'paragraphs', e.target.value)}
          />
        </section>
      ))}
      <button
        className="button secondary"
        type="button"
        onClick={() =>
          setContent({
            ...content,
            sections: [
              ...content.sections,
              { id: `section-${Date.now()}`, title: 'New section', paragraphs: [''] },
            ],
          })
        }
      >
        <Plus size={17} />
        Add section
      </button>
      <section className="admin-form form-stack">
        <h2>Quick check</h2>
        <label htmlFor="quiz-question">Question</label>
        <input
          id="quiz-question"
          value={content.quiz.question}
          onChange={(e) =>
            setContent({ ...content, quiz: { ...content.quiz, question: e.target.value } })
          }
        />
        {content.quiz.choices.map((choice, i) => (
          <div key={i}>
            <label htmlFor={`quiz-choice-${i}`}>Choice {i + 1}</label>
            <input
              id={`quiz-choice-${i}`}
              value={choice}
              onChange={(e) =>
                setContent({
                  ...content,
                  quiz: {
                    ...content.quiz,
                    choices: content.quiz.choices.map((c, index) =>
                      index === i ? e.target.value : c,
                    ),
                  },
                })
              }
            />
          </div>
        ))}
        <label htmlFor="quiz-answer">Correct choice</label>
        <select
          id="quiz-answer"
          value={content.quiz.answer}
          onChange={(e) =>
            setContent({ ...content, quiz: { ...content.quiz, answer: Number(e.target.value) } })
          }
        >
          {content.quiz.choices.map((_, i) => (
            <option value={i} key={i}>
              Choice {i + 1}
            </option>
          ))}
        </select>
      </section>
      <details className="admin-form">
        <summary>Source links (JSON)</summary>
        <p className="caption">Use an array of objects with “label” and HTTPS “url” fields.</p>
        <label htmlFor="lesson-sources">Source links</label>
        <textarea
          id="lesson-sources"
          className="code-input"
          rows={8}
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
        />
      </details>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {saved && (
        <p className="success-text" role="status">
          Lesson saved.
        </p>
      )}
      <button className="button primary" disabled={pending}>
        Save lesson
      </button>
    </form>
  );
}
