import { getCourse } from '@/lib/catalog';
import { cookies } from 'next/headers';
import {
  accountByEmail,
  addSession,
  deadline,
  getSettings,
  mutateAccount,
  demoMode,
  rateLimit,
  removeSession,
  verifyPassword,
} from '@/lib/store';
import { sessionCookie } from '@/lib/auth';
import { body, checkOrigin, emailField, errorResponse, InputError } from '@/lib/http';
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const data = await body(request);
    const jar = await cookies();
    if (data.action === 'logout') {
      const token = jar.get(sessionCookie)?.value;
      if (token) await removeSession(token);
      jar.delete(sessionCookie);
      return Response.json({ ok: true });
    }
    const email = emailField(data.email);
    const password = typeof data.password === 'string' ? data.password : '';
    if (password.length > 200 || password.length < 1)
      throw new InputError('Please enter your password.');
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    if (!(await rateLimit(`login:${email}:${ip}`)))
      throw new InputError('Too many attempts. Wait 15 minutes before trying again.', 429);
    let account = await accountByEmail(email);
    if (!account || !verifyPassword(password, account.passwordHash))
      throw new InputError(
        demoMode()
          ? 'Email or password is incorrect. Use the exact demo credentials shown below.'
          : 'Email or password is incorrect.',
        401,
      );
    const chosenCourse = typeof data.courseId === 'string' ? getCourse(data.courseId) : undefined;
    if (account.role === 'member' && !account.state.activeCourse && chosenCourse?.ready) {
      const settings = await getSettings();
      account = await mutateAccount(account.id, (a) => {
        if (a.state.activeCourse) return;
        a.state.enrollments[chosenCourse.id] = {
          courseId: chosenCourse.id,
          tier: a.state.approvedTier,
          completed: [],
          reflections: {},
          startedAt: new Date().toISOString(),
          deadline: deadline(settings.segmentDays),
          saved: [],
        };
        a.state.activeCourse = chosenCourse.id;
        a.state.onboardingComplete = true;
      });
    }
    const previous = jar.get(sessionCookie)?.value;
    if (previous) await removeSession(previous);
    const token = await addSession(account.id);
    jar.set(sessionCookie, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 86400,
    });
    return Response.json({
      ok: true,
      redirect:
        account.role === 'admin'
          ? '/admin'
          : account.state.activeCourse
            ? '/dashboard'
            : '/courses',
    });
  } catch (error) {
    return errorResponse(error);
  }
}
