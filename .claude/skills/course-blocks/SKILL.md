---
name: course-blocks
description: Pick and apply the right reusable lesson block (image carousel, file cards, glass panel, ledger table, icon tiles, conversion and payday calculators), simplify a fill-out form, or trim a long story when migrating or polishing a course lesson JSON. Use when asked to "apply the carousel", "use the ledger", "add icons to the cards", "add the calculator", "trim the story", "improve this section's layout", or to match a section to the design used on earlier courses.
---

# Course blocks

The lesson content lives in `content/<id>-lesson.json`. Each section has `blocks`, and each block has a `type`. The designs below are all **block types or block options that already exist**, so applying one is usually a **JSON-only change**. Only add code when a design needs a new icon or a new block type.

Every design has its own guide in `docs/`. **Read the guide before applying a design.** It holds the exact JSON, the field rules and the checklist. This skill only helps you choose and keeps the shared rules in one place.

## Choose the block

| The section has… | Use | Guide |
| --- | --- | --- |
| A sequence of 3–6 steps, questions or stations, each deserving a picture | `carousel` (image card carousel) | `docs/image-card-carousel.md` |
| 6 numbered checklist items that read as a file | `filecards` (tall green cards) | `docs/filecards-design.md` |
| 2–4 related facts or tiers compared side by side, with numbers | `glasspanel` | `docs/glass-panel-design.md` |
| A list of dollar figures with a category and a question each (a budget table), plus a result | `ledger` | `docs/ledger-design.md` |
| Short notes per region, category or audience, where an icon helps scanning | `cards` with `icon` on each item (icon tiles) | `docs/icon-tiles-design.md` |
| A formula the learner should try with their own numbers (cost ÷ months) | `conversion` (interactive calculator) | `docs/conversion-calculator-design.md` |
| A savings or payoff target reached by regular deposits ((target − saved) ÷ transfer = deposits) | `paydays` (interactive calculator) | `docs/payday-calculator-design.md` |
| Up to three loan offers for the same amount, compared by payment × number of payments − borrowed | `loancost` (interactive calculator) | `docs/loan-cost-calculator-design.md` |
| Up to three debts where monthly interest is estimated as balance × annual rate ÷ 12 | `interestscan` (interactive calculator) | `docs/interest-scan-calculator-design.md` |
| Up to four debts compared under snowball and avalanche (same budget, month-by-month payoff) | `payoff` (interactive calculator) | `docs/payoff-calculator-design.md` |
| Money above a baseline (a surplus, bonus or refund) split across named jobs until nothing is left | `waterfall` (interactive calculator) | `docs/waterfall-calculator-design.md` |
| A case-file story far longer than its neighbours (over about 300 words, or repeated "CASE FILE" fragments) | trim the `story` block | `docs/story-trim-guide.md` |
| A `checkIn` fill-out form with long or labelled questions and no sample answers | simplify the questions and add `samples` | `docs/fillout-form-guide.md` |
| A 2-slide `artwork` image carousel whose slide text describes the photo | rewrite as lesson taglines | `docs/lesson-images-guide.md` ("Writing the taglines") |
| Photos to add (card photos, hero, story image) | image workflow | `docs/lesson-images-guide.md` |

If a section fits none of these, leave it as it is. Do not force a design onto content it doesn't suit.

## Rules that apply to every block

1. **Text stays word for word.** Only new short labels may be added (ALL-CAPS card titles, step labels, pills). Never reword a learner-facing sentence to fit a design.
2. **Replace, don't stack.** When a block replaces a `heading` + `cards` pair, delete the old heading if the new block shows it itself. The guide says which blocks do.
3. **Check the rendered result** on localhost:3000, not just the JSON. See "Checking your work" below.
4. **Mobile matters.** Every design must stack cleanly at phone width with no sideways scroll. The dev browser window can't be resized here, so narrow the block's own width or use a phone to check.
5. **Images are 16:9** for carousel cards and fill the card edge to edge. Other ratios get cropped. See the carousel guide.
6. **Keep JSON formatting.** Edit with `JSON.parse` / `JSON.stringify(j, null, 2) + '\n'` in a small script, or with exact string edits, so the diff only shows the real change.

7. **Image captions are taglines, not descriptions.** The text on an `artwork` slide states a lesson from the course (slide 1 the problem, slide 2 the action), in 12 words or fewer. Never describe what the photo shows. Check this whenever a lesson has an `artwork` block.

## Adding something new

- **A new icon** for carousels goes in `carouselIcons` in `components/lesson-interactives.tsx`. A new icon for icon tiles goes in `tileIcons` in `components/reading-blocks.tsx`. Update the icon table in the matching guide.
- **A new block type** needs four edits: the `type` union in `lib/types.ts`, the `blockTypes` list in `lib/content-validation.ts` (plus any new item field), the `case` in `components/reading-blocks.tsx`, and the styles in `app/premium.css`. Then write a guide in `docs/` in the same format and add a row to the table above.
- Put block-only styling under the block's own class. Don't edit `.score-frame` to restyle one block, because the score and utilization calculators share it.

## Checking your work

```
npx tsc --noEmit
node -e "JSON.parse(require('fs').readFileSync('content/<id>-lesson.json','utf8'))"
```

Then open the lesson on localhost:3000. The demo accounts are in the README. The Elite member can open any course. The lesson route is `/course/<courseId>/lesson/<lessonId>` (for example `money-budgeting` / `money-01`).

- If Next.js shows a red "Element type is invalid" or "(stale)" error right after you add a component, the dev cache is stale. Hard refresh (Ctrl+Shift+R) or restart `npm run dev`. It is not a code bug.
- Don't commit unless asked.

## Related

- `course-treatment` skill: the full course pass (motivator banners, grade-8 rewrite, plot-arc story).
- `EXTRACT_COURSE.md`: extracting a course before migrating it.
