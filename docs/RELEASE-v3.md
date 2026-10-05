# Credit Pulse Academy v3

## What changed

- All 140 lesson titles, exact order, and tier assignment imported from the supplied structured-courses PDF.
- Credit Mastery corrected to 20 lessons (4/4/3/3/3/3); Income & Business corrected to 20.
- Six inspectable course syllabuses and an administrator curriculum studio covering every course.
- First credit-score lesson copied word for word from the authenticated live lesson, including the five written questions and glossary.
- Premium studio UI: custom tier glyphs, individual illustrated course covers, glass navigation, interactive tier previews, progress orbit, Savings Book spines, and a spacious reading layout.
- Native scroll reveal and gentle artwork motion, with reduced-motion support. Sticky reading controls, focus mode, adjustable text size, and active section tracking.
- Interactive score explorer, utilization calculator, quick-check disclosures, and illustrative carousel.
- Five-answer check-ins persisted through the same account/PostgreSQL backend; obsolete quiz-only requests cannot bypass them.

## Runtime and remaining setup

npm install and npm run dev start the local demo without a database. Persistent real accounts use the included PostgreSQL adapter and schema. No hosted database, email automation, payment processor, or cash-back/points fulfillment service is connected by this download. Production requires your own verified configuration.

The other 139 lesson bodies remain clearly labelled templates. The seven-day demo target is illustrative; real-account deadlines stay unset until configured. Segment headings are editorial additions. The PDF fixes titles and access allocation, not bonus amounts or fulfillment rules.

## Validation

Results are recorded in VALIDATION.md after the release checks complete.
