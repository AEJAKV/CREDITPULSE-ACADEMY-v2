# v3 validation and release scope

## Checks completed on 2026-10-02

- TypeScript: passed.
- Seven unit tests: passed. Covers all 140 unique curriculum slots, exact per-tier counts, source lesson structure, rich-block safety, cumulative tier access, segment/Elite completion, and salted passwords.
- Next.js production build: passed. All member pages, admin pages, and three API endpoints compiled.
- Included Chromium end-to-end test: passed. Member login, six visible tiers, inline Gold preview, score/utilization controls, quick-check disclosure, focus mode, mobile overflow, keyboard drawer dismissal, six course syllabuses, locked page/API protection, pending reapplication, all-course admin curriculum, and verified Gold approval.
- Extended browser checks: five written responses persisted; old quiz-only completion rejected; Not now and later reapply; pending does not unlock; all twenty Credit Mastery lessons completed; Elite Go Wider enrolls at Starter even if a forged higher tier is supplied; previous Elite access remains; 30-lesson Benefits curriculum available to administrators.
- Eighteen desktop/mobile captures produced. Horizontal overflow was checked at 1440px and 390px. No runtime/console errors in the extended capture after waiting for rendered content and avoiding test-induced caret styling during hydration.
- Production accessibility checks using axe-core, tagged WCAG 2 A/AA and WCAG 2.1 AA: no violations reported for login, dashboard, source lesson, course library, and locked segment at desktop, plus dashboard/source lesson at 390px mobile. Low-contrast labels found in the first pass were corrected before the final pass.
- Production dependency audit: zero known vulnerabilities reported at verification time.

This is not formal WCAG certification or a measured Lighthouse score. Automated checks do not replace testing with actual assistive technologies or your target learners.

## Backend scope

The persistent PostgreSQL adapter, schema, account sessions, tier gates, content overrides, and administration are included. The original adapter was exercised with a PostgreSQL-compatible PGlite engine in v2; v3 retains the schema and adds written responses inside the existing enrollment JSON. No hosted database was connected for this release. Hosted TLS, backups, concurrency, deployment, and your production configuration need verification in your environment.

No GitHub repository, Vercel deployment, cash-back provider, payment processor, points ledger, or ActiveCampaign account was connected. Requests and Not now choices are recorded; automated email and reward fulfillment are not implemented.

Demo fixtures are shared and temporary. Use PostgreSQL mode for real accounts. The 140 lesson titles and tier mappings are final as supplied by the structured-courses PDF. Only the first credit-score lesson body is complete; the other 139 bodies remain clearly labelled templates, and are drafts in real-account mode until published.

## Repeat locally

```bash
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm audit --omit=dev
```

The end-to-end test starts its own demo server on port 3020. Its browser checks are included in tests/academy.e2e.ts. The external screenshot/axe runner is development tooling and is not required to run or deploy the application.
