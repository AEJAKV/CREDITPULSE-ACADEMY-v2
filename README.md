# Credit Pulse Academy · v3

A complete, portable Next.js App Router project. Open this folder in VS Code, install dependencies, and run it locally. Deploy the same project to Vercel.

## Quick start

Install Node.js 24 LTS and VS Code. Open this folder (the one containing package.json), open Terminal → New Terminal, and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000. No environment file, database, or setup command is needed for the local demo.

| Account       | Email                   | Password             |
| ------------- | ----------------------- | -------------------- |
| Silver member | member@creditpulse.demo | LearnWithPulse2026!  |
| Administrator | admin@creditpulse.demo  | ManageWithPulse2026! |

These credentials work only in demo mode. Demo data is temporary, seeded with Starter completed and Silver in progress. Credit Mastery lesson 1 reproduces the original live lesson wording. The remaining 139 lesson bodies are clearly identified templates. All 140 titles and tier assignments match the supplied structured-courses PDF. Never use demo mode for real member records.

## Included pages

- Login and email-link context; verified account access.
- Course dashboard with six visible segment panels and cumulative tier access.
- Six-course library with distinct illustrated covers and expandable syllabuses for every tier.
- Original reading lesson with live score explorer, utilization calculator, quick-check disclosures, five written answers, focus mode, text size controls, reading progress, and bookmarks.
- Locked segment previews.
- Segment celebration, reapplication request, pending review, and Not now return path.
- Elite completion with all six earned badges and five next-course previews.
- Master Savings Book with saved actions and a print layout.
- Member help.
- Admin overview, member creation/search/detail/password reset, tier review queue, all-course curriculum studio and rich-block lesson editor, and settings.

## Real accounts and Vercel

Use PostgreSQL for real member records. There is no SQLite or local JSON storage in production. Copy .env.example to .env.local, set DEMO_MODE=false, DATABASE_URL, APP_URL, and your own ADMIN_EMAIL / ADMIN_PASSWORD (12+ characters), then run npm run db:setup. The setup script creates the schema and initial administrator without replacing existing accounts.

See [docs/SETUP.md](docs/SETUP.md) for Windows, GitHub, Vercel, and troubleshooting instructions. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the model, integrations, and unresolved business rules.

## Commands

| Command           | Purpose                                               |
| ----------------- | ----------------------------------------------------- |
| npm run dev       | Local development with automatic refresh              |
| npm run build     | Compile and verify the production application         |
| npm start         | Serve the completed production build                  |
| npm run typecheck | Check TypeScript types                                |
| npm test          | Verify tier mapping, completion, and password hashing |
| npm run db:setup  | Initialize PostgreSQL and your chosen administrator   |

## Scope and readiness

This is a working application foundation with a complete first lesson and reviewable demo flows. The live database adapter, schema, and admin workflows are included. Cash-back verification, payments, ActiveCampaign email delivery, and scheduled nurture/re-offer automation require your actual external services. The application stores requests and Not now choices; it does not send emails or issue money.

Do not launch real financial offers until your team confirms tier mapping, deadlines, bonus terms, and Savings Book benefits. The supplied structured-courses PDF is now authoritative: Credit Mastery, Money & Budgeting, Tax & Wealth, and Income & Business each have 20 lessons, distributed 4/4/3/3/3/3 by tier. Benefits & Support and Health & Fitness each have 30 lessons, five per tier. Access depends on tier, not equal lesson counts.

## Where to customize the website

| File                               | Purpose                                                                                         |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| content/curriculum.json            | All six approved courses, 140 exact lesson titles, order, and tier assignments                  |
| content/credit-score-lesson.json   | Original credit-score lesson text, ordered blocks, and five written questions                   |
| app/premium.css                    | v3 visual design: glass surfaces, course artwork, reading studio, responsive layouts            |
| components/experience.tsx          | Tier exploration, reading progress, focus/text controls, reduced-motion-aware reveal animations |
| components/lesson-interactives.tsx | Live educational calculators, artwork carousel, written check-in                                |
| components/visuals.tsx             | Six custom tier glyphs, course icons, lightweight decorative illustrations                      |
| lib/store.ts + scripts/schema.sql  | Demo data and persistent PostgreSQL backend                                                     |

Segment headings are editorial navigation labels; the PDF's lesson titles and assignments are unchanged. The source lesson's reward sentence is preserved. This project does not issue the $5 or points; Credit Pulse must confirm eligibility and connect fulfillment. Written answers are saved for review, without automatic grading or a time-on-page requirement.

## Updating an older installation

Extract v3 into a **new folder** rather than mixing it with old source files. Run npm install and npm run dev in that folder. Re-enter only your own verified production environment settings when ready. Existing PostgreSQL accounts are retained if you reuse the same database; the catalogue uses the new approved tier boundaries. Existing lesson IDs credit-01 through credit-18 keep the same topics. Previously saved lesson content overrides the bundled default; restore the original first lesson through Admin → Curriculum → lesson 1 by pasting content/credit-score-lesson.json into the structured editor. Back up production data before adopting the changed tier boundaries, and review historical segment completion/offer records affected by those boundaries.

See docs/RELEASE-v3.md for the changes and validation results.
