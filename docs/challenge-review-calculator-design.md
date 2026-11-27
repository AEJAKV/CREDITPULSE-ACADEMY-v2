# Challenge review calculator (`challengereview` block)

An interactive "score the month by your own rule" panel in the same glass frame and moving outline as the conversion calculator. The learner sets the chances per seven-day block and a pass mark (written on day 1), then enters what they did in each of the four blocks and how many were easier versions. The score, the pass/fail against their own mark, the trend and a day-30 call update live.

**Reference:** Thirty-Day Challenges (`content/health-29-lesson.json`, "Set the pass mark on day 1", right after the worked example).

Use it where a lesson runs a **multi-week experiment that should be judged against a rule set in advance**, not by mood at the end. Place it right after the paragraph that works the example by hand.

---

## The maths

```
planned = chances per block × 4
done    = block 1 + block 2 + block 3 + block 4
score   = done ÷ planned                 (rounded %)
passed  = score ≥ pass mark
trend   = (block 3 + block 4) vs (block 1 + block 2)   → Rising / Steady / Falling
```

Day-30 call:

| Result | Call |
| --- | --- |
| Passed and steady or rising | Continue as planned |
| Passed but falling | Continue, check the cue |
| Below the mark, 50% or more | Change one thing (amber) |
| Under 50% | Change the cue or stop (amber) |

Below the mark also shows an amber note that this is a result, not a failure.

## JSON

```json
{
  "type": "challengereview",
  "text": "Score your month",
  "detail": "INTERACTIVE CHALLENGE LAB",
  "extra": "Enter your chances per block, your day-1 pass mark and what you did. The panel makes the day-30 call by your own rule.",
  "items": [
    { "title": "Sample month", "text": "", "amount": "3", "detail": "3,2,2,1,2" },
    { "title": "Victor’s month", "text": "", "amount": "3", "detail": "2,2,3,2,3" },
    { "title": "Rough month", "text": "", "amount": "3", "detail": "1,1,1,0,1" }
  ]
}
```

| Field | What it holds |
| --- | --- |
| `text` | Panel title. |
| `detail` | Small label above the title. |
| `extra` | One-line instruction under the header. |
| `items[].title` | Example chip label. |
| `items[].amount` | Chances per block, 1–7. The first example is also the starting value. |
| `items[].detail` | `"b1,b2,b3,b4,easier"`: done in each block (each ≤ `amount`), then how many of the total were easier versions. |
| `items[].text` | Unused. Keep it `""` (the validator requires a string). |

The pass mark starts at 75% and isn't changed by the examples, so the learner's own rule stays put while they try them.

Pick examples that land in different calls. Take the first from the lesson's worked example and one from the story, so the story's numbers can be checked in the tool.

## Layout

A setup row (chances per block, pass mark, easier: 3 columns) sits above a blocks row (Days 1–7 … Days 22–28: 4 columns). On phones both rows are 2 columns, and the third setup field spans the full width.

## Bad input

Decimals, a block above its chances, or more easier versions than total done show a short prompt instead of a score.

## Where the code lives

| File | What |
| --- | --- |
| `components/lesson-interactives.tsx` | `ChallengeReviewCalculator` |
| `components/reading-blocks.tsx` | `case 'challengereview'` |
| `app/premium.css` | `.challenge-frame*`. Everything else reuses `.conv-frame`, `.util-frame` and `.score-frame`. |
| `lib/types.ts`, `lib/content-validation.ts` | `'challengereview'` block type |

Add changes under `.challenge-frame`, never on `.score-frame` or `.conv-frame`.

## Checklist

- [ ] Placed straight after the worked example it automates.
- [ ] The first example reproduces the worked example exactly, and the story's month matches one chip.
- [ ] Checked on localhost:3000: chips switch examples, a below-mark example shows the amber note, and there's no sideways scroll at phone width.
