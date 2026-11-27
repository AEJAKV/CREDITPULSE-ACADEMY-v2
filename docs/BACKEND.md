# Backend: Logins, Progress and Going Live

One place for how Credit Pulse Academy stores students, signs them in, and saves their progress, plus the checklist for moving from demo mode to a live PostgreSQL database.

Related docs: `docs/ARCHITECTURE.md` (routes, tier rules, API contracts), `docs/SETUP.md` (step-by-step deploy and troubleshooting), `docs/VALIDATION.md` (what has and has not been tested).

## Two modes

| Mode                       | Where data lives                    | Use for                                                     |
| -------------------------- | ----------------------------------- | ----------------------------------------------------------- |
| Demo (`DEMO_MODE=true`)    | Server memory, seeded with fixtures | Local work and design previews. Resets on restart or a new server instance. Never real students. |
| Live (`DEMO_MODE=false`)   | PostgreSQL via `DATABASE_URL`       | Real members. Required for production.                      |

Both modes go through the same functions in `lib/store.ts`, so pages and API routes do not change between them.

## Key files

| File                       | Role                                                                     |
| -------------------------- | ------------------------------------------------------------------------ |
| `lib/store.ts`             | Demo adapter and PostgreSQL adapter: accounts, passwords, sessions, rate limits, content overrides, settings, audit |
| `lib/auth.ts`              | Reads the session cookie and checks role and course access for pages and API routes |
| `lib/types.ts`             | Shapes of `MemberState`, `Enrollment`, `Offer` and `VideoState`          |
| `scripts/schema.sql`       | Database tables                                                          |
| `scripts/setup.ts`         | `npm run db:setup`: creates tables and the first administrator           |
| `app/api/auth/route.ts`    | Sign in and log out                                                      |
| `app/api/member/route.ts`  | Student actions: enroll, complete, save, reapply, not-now               |
| `app/api/admin/route.ts`   | Admin actions: create-member, review, reset-password, content, settings |

## Database tables

| Table            | Holds                                                                  |
| ---------------- | ---------------------------------------------------------------------- |
| `cp_accounts`    | One row per person: id, name, email (unique), password hash, role (`member` or `admin`), `state` JSONB, created_at |
| `cp_sessions`    | SHA-256 hash of each login token, the account it belongs to, expiry. Deleted with the account. |
| `cp_content`     | Admin edits to lesson content, keyed by lesson id. These override the bundled JSON. |
| `cp_config`      | Settings managed in the admin page (deadlines, bonus values)           |
| `cp_audit`       | Who did what to whom, with a timestamp                                 |
| `cp_rate_limits` | Login attempt counters with a 15-minute expiry                         |

## Logins

- Students and admins sign in with email and password at `/login`, which posts to `/api/auth`. The same endpoint handles `action=logout`.
- Passwords are hashed with Node scrypt and a random salt. Checks use a timing-safe compare. Plain passwords are never stored or logged.
- On success the server creates a random token, sets it in a cookie, and stores only its SHA-256 hash in `cp_sessions`. A leaked database does not expose usable session tokens.
- Sessions last 7 days.
- Cookies are HttpOnly and SameSite=Lax, and Secure in production.
- Login attempts are limited to 12 per email and IP address in a 15-minute window.
- An admin password reset logs the student out of every existing session.
- Accounts are created by an admin (`/api/admin`, `action=create-member`) or by the setup script for the first admin. There is no public self-signup.
- Admin checks run on every admin page and every admin API call, not only in the layout.

## Saved progress and history

Everything about a student's progress is stored on their own account row, in the `state` JSONB column:

```
MemberState
  activeCourse        course the student is currently in
  approvedTier        highest verified tier
  onboardingComplete
  enrollments         one Enrollment per course
    tier              tier the student can access in this course
    completed         lesson ids finished
    reflections       written reflections per lesson
    checkIns          five-answer check-ins per lesson, with submittedAt
    saved             bookmarked lessons
    segmentResults    when each tier segment was completed, and its deadline
    startedAt, deadline
  offers              tier-upgrade requests: pending, approved, not-yet or declined
  videos              watched videos, playback progress, takeaways
```

How it is saved:

- Students save through `/api/member`. Before writing, the server checks the account's enrollment, tier access, whether the lesson is published, required answers or acknowledgment, and duplicate pending requests.
- The browser never sets its own tier. Tiers only go up when an admin approves a request, one tier at a time, and earlier completions are kept.
- Each course has its own enrollment, so starting a new course at Starter does not lower access in a course already completed.
- Progress updates lock the account row inside a transaction, so two saves at the same moment cannot overwrite each other.
- Admins see a student's enrollment history at `/admin/members/[memberId]` and pending reviews and nurture history at `/admin/approvals`. Admin actions are written to `cp_audit`.

## Environment variables

| Variable          | Where                     | Notes                                                    |
| ----------------- | ------------------------- | -------------------------------------------------------- |
| `DEMO_MODE`       | Local and Vercel          | `false` for live                                         |
| `DATABASE_URL`    | Local and Vercel          | Provider's pooled connection string, with its SSL settings |
| `APP_URL`         | Local and Vercel          | Exact origin, no path or trailing slash, e.g. `https://academy.example.com` |
| `ADMIN_EMAIL`     | Local `.env.local` only   | Used once by `npm run db:setup`                          |
| `ADMIN_PASSWORD`  | Local `.env.local` only   | 12+ characters. Do not add to Vercel.                    |

Template: `.env.example`.

## Go-live checklist

1. Create a PostgreSQL database (for example Neon, or a Vercel Marketplace integration). Copy the pooled connection string.
2. Copy `.env.example` to `.env.local`. Set `DEMO_MODE=false`, `DATABASE_URL`, `APP_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
3. Run the setup once. It creates the tables and the first admin, and does not overwrite existing accounts:

   ```bash
   npm run db:setup
   ```

4. In Vercel, set `DEMO_MODE=false`, `DATABASE_URL` and `APP_URL`. Redeploy.
5. Sign in as the admin, create a test student, and walk one lesson end to end: enroll, complete, check-in answers, bookmark, log out, log back in, and confirm everything is still there.
6. Restore lesson content if needed: Admin → Curriculum → lesson 1, paste `content/credit-score-lesson.json`.
7. Turn on database backups with your provider and test a restore.
8. If you add a custom domain, update `APP_URL` to it and redeploy.
9. Run the end-to-end tests against the live build:

   ```bash
   npm run test:e2e
   ```

## Not built yet

These are not connected in this codebase and need decisions and services before launch:

- Email delivery (ActiveCampaign or similar). The app stores requests and Not now choices but sends no email. Recommended approach in `docs/ARCHITECTURE.md`: an outbox table plus a retrying worker, never sending inside a member transaction.
- Password reset by email. Today only an admin can reset a password.
- Cash-back, payments and reward fulfilment.
- Privacy policy, data retention and account deletion process.
- Load and concurrency testing against the hosted database. `docs/VALIDATION.md` notes the PostgreSQL adapter was exercised with PGlite, not a hosted database.
