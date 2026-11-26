# Habit review calculator (`habitreview` block)

An interactive "count chances, not streaks" scorecard in the same glass frame and moving outline as the conversion calculator. The learner enters the chances they planned for a week, how many full and easier versions they did and the minutes each version takes. The score, minutes moved and a next-week suggestion update live.

**Reference:** Habit Building (`content/health-27-lesson.json`, "Count chances, not streaks", right after the worked example).

Use it where a lesson teaches **reviewing a week of practice against what was planned**, with a full and an easier version. Place it right after the paragraph that works the example by hand.

---

## The maths

```
chances used  = full versions + easier versions
score         = chances used ÷ planned chances
missed        = planned chances − chances used
minutes moved = full × minutes per full + easier × minutes per easier
```

Next-week suggestion: **75% or more** → "Keep it, or change one thing". **50–74%** → "Repeat the same level". **Under 50%** → "Shrink it or fix the cue", flagged amber with a note that the setup (cue, size, support) needs changing, not the learner.

## JSON

```json
{
  "type": "habitreview",
  "text": "Score your week",
  "detail": "INTERACTIVE HABIT LAB",
  "extra": "Enter the chances you planned and what you did. The scorecard counts fairly and suggests a next step.",
  "items": [
    { "title": "Sample week", "text": "", "amount": "4", "detail": "2,1" },
    { "title": "Five chances", "text": "", "amount": "5", "detail": "2,2" },
    { "title": "Crowded week", "text": "", "amount": "4", "detail": "0,1" }
  ]
}
```

| Field | What it holds |
| --- | --- |
| `text` | Panel title. |
| `detail` | Small label above the title. |
| `extra` | One-line instruction under the header. |
| `items[].title` | Example chip label. |
| `items[].amount` | Planned chances, digits only (1–14). The first example is also the starting value. |
| `items[].detail` | `"full,easier"`, for example `"2,1"`. Full + easier must not exceed `amount`. |
| `items[].text` | Unused. Keep it `""` (the validator requires a string). |

Minutes per full version start at 4 and minutes per easier version at 1 (the health-27 example week). The examples don't change them.

Pick examples that land in each band (75%+, 50–74%, under 50%) so learners see all three suggestions. Take the first example from the lesson's own worked week.

## Bad input

Planned chances outside 1–14, decimals, or full + easier above planned show a short prompt instead of a score.

## Where the code lives

| File | What |
| --- | --- |
| `components/lesson-interactives.tsx` | `HabitReviewCalculator` |
| `components/reading-blocks.tsx` | `case 'habitreview'` |
| `app/premium.css` | `.habit-frame*` (five fields: 5 columns on desktop, 3 under 900px, 2 under 560px). Everything else reuses `.conv-frame`, `.util-frame` and `.score-frame`. |
| `lib/types.ts`, `lib/content-validation.ts` | `'habitreview'` block type |

Add changes under `.habit-frame`, never on `.score-frame` or `.conv-frame`.

## Checklist

- [ ] Placed straight after the worked example it automates.
- [ ] The first example reproduces the worked example exactly.
- [ ] Checked on localhost:3000: chips switch examples, the under-50% example shows the amber note, and there's no sideways scroll at phone width.
