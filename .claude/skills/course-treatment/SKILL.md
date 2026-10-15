---
name: course-treatment
description: Apply the standard Credit Pulse course treatment to a course — two benefit-framed motivator banners, a grade-8 content rewrite, sharpened humour, and a story rebuilt on a classic plot arc. Use when asked to "apply the treatment", "add motivators", "rewrite course X", or to bring a course in line with courses 1.1 through 1.4.
---

# Credit Pulse course treatment

The pattern established on courses 1.1, 1.2, 1.3 and 1.4. Applying it to a course means
five things: two motivator banners, a reading-level rewrite, a story rebuilt on a plot arc,
a voice pass, and a simple action form. Reference implementation: course 1.2,
`components/BureauComparisonCourse.jsx` with `lib/course-12-data.js`.

## Before you start

Find the two files for the course. The component is `components/<Name>Course.jsx`; the data
file is the `lib/*-data.js` it imports. The route is `app/course/<slug>/page.jsx`, and the
data file's `id` field is what the password gate uses.

Take a baseline measurement. The dev server must be running (`npm run dev`):

```
node scripts/readability.js <course-slug> --tells
```

**Check line endings before any multi-line edit.** `components/SinglePageCourse.jsx` uses
CRLF while the others use LF. Multi-line find-and-replace fails silently against CRLF, and
normalising the file produces a whitespace-only diff across every line. Read the file,
detect `\r\n`, work on an LF copy, and restore the original convention on write.

## 1. Motivator banners

Add this component to the course's own `.jsx`, near its other local helpers. Do not import
it from a shared module — each course defines its own.

```jsx
function Motivator({ title, children, kicker }) {
  return <aside className="course-motivator">
    <div className="course-motivator-inner">
      <h2>{title}</h2>
      <p className="course-motivator-lead">{children}</p>
      <p className="course-motivator-kicker"><ArrowRight aria-hidden="true" />{kicker}</p>
    </div>
  </aside>;
}
```

`ArrowRight` from `lucide-react` is already imported in every course component, so no
import changes are needed. There is no eyebrow and no icon prop.

Place exactly two instances, as direct children of `<div className="reader-body">`:

1. Immediately after the closing `</section>` of Section 01, before Section 02's
   `<section>` tag. Courses 1.1 through 1.4 originally placed this banner before Section 01;
   it was corrected to this later position on courses 2.2 and 2.3, and this is the standard
   for course 2.x onward and anything built since.
2. Immediately after the closing `</section>` of the section that contains the story —
   never inside it. This holds whether the story owns its own section (course 1.2) or sits
   inside a numbered one (courses 1.1, 1.3, 1.4).

**No CSS work is required.** `.course-motivator` and its child rules already live once in
`app/globals.css`, and new courses inherit them.

### Motivator copy

Benefit-framed: say what the reader gains, never tease what is coming. `title` is one
sentence. `children` is the emphasized lead — one sentence, two clauses, never a three-item
list. `kicker` is one short forward-pointing line, ideally naming a specific later section,
ending in a period rather than an em dash. Vary the kicker phrasing between courses; a
repeated line like "Stay to the end" reads as a template.

## 2. Reading level

Target **Flesch-Kincaid grade 8 for teaching prose**. Courses have landed between 6.99 and
8.05 from an original band of 8.8 to 9.8.

The method: **cut syllables per word, hold sentence length steady.** On course 1.2 that was
1.68 to 1.47 syllables per word with words per sentence moving only 14.7 to 14.5. Replace
hard vocabulary with plain words; do not chop sentences. A pass that shortened sentences
instead overshot to grade 4.3 and read choppy and condescending.

Use `--breakdown` to find the few passages dragging the score, and re-measure after each
pass rather than guessing.

## 3. Story

Rebuild the story on a classic plot arc: a goal with real stakes, an inciting incident,
rising action, **a decision the character actually makes**, a twist or complication, a
resolution, and a callback to a detail from the opening. The decision beat is the teachable
moment, and it was missing from all four original stories, which summarised outcomes
instead of dramatising a choice.

Stories should read faster than the teaching prose — around grade 4 to 6 — and that is
correct, not a miss.

## 4. Voice

Run `node scripts/readability.js <slug> --tells` and clear the genuine hits: tricolon
pileups, mirrored antithesis, "less like X and more like Y", filler adverbs, aphoristic
zinger closers, repeated "So" openers, em-dash overuse.

Two things are false positives: em dashes inside `<strong>Label</strong> — copy` are JSX
markup, not prose; and filler adverbs that carry a real contrast can stay.

## 5. Action form

The closing fill-in section that writes to `cp-*-submissions` in localStorage. The audience
skews toward people who are stressed by paperwork (lower income, newcomers, seniors), so the
form must be easy to answer, not just easy to read. A form that feels like a tax form
defeats the point of the course.

- Prefer short, concrete questions over ones that need a technical concept to answer.
  "How many children live with you, and how old are they?" beats "Estimate your dependent
  count by qualifying age band."
- Add a plain-language hint under any open-ended question that might feel intimidating,
  e.g. "An estimate is fine. Round to the nearest thousand if that's easier," or "Write
  'no changes' if nothing's different."
- Replace a hard-to-phrase free-text question with a `<select>` of concrete options,
  including a safe "Not sure", when the underlying fact is really yes/no/unsure. This works
  with the existing `FormData`-based submit handlers with no structural change.
- Keep the field count modest. Silver's Mortgage course used eight fields because it is a
  45-minute readiness file; a benefits-eligibility check-in does not need to match that.

This is a standing bar for every course's action form, Gold included.

## What must not change

Every FCAC, Equifax, TransUnion and other regulator citation and source link is
non-negotiable. Keep the original author's jokes — they are good and they are the house
voice. Simplify around them.

Also rewrite the data file's glossary definitions and side-nav section labels to match the
new reading level, not just the component's body copy.

## Verify before reporting done

- Both files parse: `node -e "…ts.createSourceFile…"` or a build.
- Page renders: fetch the course URL and confirm HTTP 200.
- Motivators are in position: the rendered HTML should show
  `section-01 → motivator → section-02 → … → story-section → motivator → next-section`.
- Action form questions are short and plain, with hints or `<select>` options where needed.
- Re-measure with the readability script and report the before and after numbers.

## Tracking

`MANIFEST.md` in this folder lists every course as treated or untreated. After you finish a course, tick it off there and add its before and after readability scores.
