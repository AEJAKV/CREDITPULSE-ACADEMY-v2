import { validateRichContent } from '@/lib/content-validation';
import { currentAccount } from '@/lib/auth';
import { body, checkOrigin, emailField, errorResponse, InputError, stringField } from '@/lib/http';
import {
  addAudit,
  createAccount,
  deadline,
  getSettings,
  hashPassword,
  invalidateSessions,
  mutateAccount,
  setContent,
  setSettings,
} from '@/lib/store';
import { allLessons } from '@/lib/catalog';
import type { LessonContent, Tier } from '@/lib/types';
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const actor = await currentAccount();
    if (!actor) throw new InputError('Please sign in.', 401);
    if (actor.role !== 'admin') throw new InputError('Administrator access is required.', 403);
    const data = await body(request);
    let target = '';
    if (data.action === 'create-member') {
      const email = emailField(data.email),
        name = stringField(data.name, 'name', 100),
        password = stringField(data.password, 'password', 200);
      const tier = Number(data.tier);
      if (password.length < 12) throw new InputError('Use a password of at least 12 characters.');
      if (!Number.isInteger(tier) || tier < 0 || tier > 5)
        throw new InputError('Choose a valid tier.');
      const created = await createAccount(name, email, password, tier as Tier);
      target = created.id;
    } else if (data.action === 'review') {
      target = stringField(data.memberId, 'member');
      const reference = stringField(data.reference, 'approval or review reference', 200);
      const settings = await getSettings();
      if (data.decision !== 'approved' && data.decision !== 'declined')
        throw new InputError('Choose a review decision.');
      await mutateAccount(target, (account) => {
        const offer = account.state.offers.find(
          (o) => o.id === data.offerId && o.status === 'pending',
        );
        if (!offer) throw new InputError('This request has already been reviewed.', 409);
        const enrollment = account.state.enrollments[offer.courseId];
        if (!enrollment || enrollment.tier !== offer.segment || enrollment.tier === 5)
          throw new InputError('The enrollment changed. Review the member record.', 409);
        offer.status = data.decision as 'approved' | 'declined';
        offer.approvalReference = reference;
        offer.reviewer = actor.id;
        offer.reviewedAt = new Date().toISOString();
        if (offer.status === 'approved') {
          enrollment.tier = (enrollment.tier + 1) as Tier;
          enrollment.deadline = deadline(settings.segmentDays);
        }
      });
    } else if (data.action === 'reset-password') {
      target = stringField(data.memberId, 'member');
      const password = stringField(data.password, 'password', 200);
      if (password.length < 12) throw new InputError('Use at least 12 characters.');
      await mutateAccount(target, (account) => {
        account.passwordHash = hashPassword(password);
      });
      await invalidateSessions(target);
    } else if (data.action === 'content') {
      target = stringField(data.lessonId, 'lesson');
      if (!allLessons.some((l) => l.id === target)) throw new InputError('Unknown lesson.');
      const content = data.content as LessonContent;
      if (
        !content ||
        typeof content.title !== 'string' ||
        !content.title.trim() ||
        typeof content.summary !== 'string' ||
        typeof content.published !== 'boolean' ||
        !Number.isFinite(content.minutes) ||
        content.minutes < 1 ||
        content.minutes > 240 ||
        !Array.isArray(content.sections) ||
        content.sections.length < 1 ||
        content.sections.length > 40
      )
        throw new InputError('Check the lesson title, summary, duration, and sections.');
      if (!validateRichContent(content))
        throw new InputError('Check the structured reading blocks and written check-in.');
      const ids = new Set<string>();
      for (const section of content.sections) {
        if (
          !section ||
          !/^[a-z0-9-]+$/.test(section.id) ||
          ids.has(section.id) ||
          typeof section.title !== 'string' ||
          !Array.isArray(section.paragraphs) ||
          !section.paragraphs.every((p) => typeof p === 'string')
        )
          throw new InputError('Each section needs a unique lowercase ID, title, and paragraphs.');
        ids.add(section.id);
      }
      if (
        !content.quiz ||
        typeof content.quiz.question !== 'string' ||
        !Array.isArray(content.quiz.choices) ||
        content.quiz.choices.length < 2 ||
        content.quiz.choices.length > 6 ||
        !content.quiz.choices.every((c) => typeof c === 'string') ||
        !Number.isInteger(content.quiz.answer) ||
        content.quiz.answer < 0 ||
        content.quiz.answer >= content.quiz.choices.length
      )
        throw new InputError('Check the quiz question, choices, and correct answer.');
      if (
        !Array.isArray(content.sources) ||
        !content.sources.every(
          (s) =>
            s &&
            typeof s.label === 'string' &&
            typeof s.url === 'string' &&
            /^https:\/\//.test(s.url),
        )
      )
        throw new InputError('Sources must use HTTPS links.');
      await setContent(target, content);
    } else if (data.action === 'settings') {
      const days =
        data.segmentDays === '' || data.segmentDays === null ? null : Number(data.segmentDays);
      if (days !== null && (!Number.isInteger(days) || days < 1 || days > 365))
        throw new InputError('The segment window must be 1–365 days, or empty.');
      const bonusCopy = typeof data.bonusCopy === 'string' ? data.bonusCopy.slice(0, 1000) : '';
      const savingsCopy = stringField(data.savingsCopy, 'Savings Book description', 1000);
      const helpEmail = data.helpEmail ? emailField(data.helpEmail) : '';
      await setSettings({ segmentDays: days, bonusCopy, savingsCopy, helpEmail });
      target = 'settings';
    } else throw new InputError('Unknown admin action.');
    await addAudit(actor.id, String(data.action), target);
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
