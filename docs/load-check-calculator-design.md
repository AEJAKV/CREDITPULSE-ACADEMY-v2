# Load check calculator (`loadcheck` block)

An interactive "does the work fit the time?" panel in the same glass frame and moving outline as the conversion calculator. The learner enters up to three tasks in hours and the hours they have left. The total, the gap, the load percentage and a next move update live.

**Reference:** Stress Management (`content/health-28-lesson.json`, "Do the load maths first", right after the worked example).

Use it where a lesson teaches **checking whether a demand can physically fit before working on the reaction to it** (workload, a crowded day, competing deadlines). Place it right after the paragraph that works the example by hand.

---

## The maths

```
hours needed = task A + task B + task C
gap          = hours needed − hours available   (positive = over, negative = spare)
load         = hours needed ÷ hours available   (shown as a rounded %)
```

Next move: **up to 85%** → "Fits: pause, then start". **Over 85% up to 100%** → "Tight: protect a buffer". **Over 100%** → "Ask for a priority call", flagged amber, with a note that a pause can't create the missing time.

Hours are shown as `1 h 30 min`, `45 min` or `2 h`.

## JSON

```json
{
  "type": "loadcheck",
  "text": "Check the load",
  "detail": "INTERACTIVE STRESS LAB",
  "extra": "Enter up to three tasks and the hours you have. The panel shows whether it fits, and what to do next.",
  "items": [
    { "title": "Report and desk", "text": "", "amount": "3.5", "detail": "3,2," },
    { "title": "Anika’s Tuesday", "text": "", "amount": "1", "detail": "1,1," },
    { "title": "A normal afternoon", "text": "", "amount": "4", "detail": "1.5,1,0.5" }
  ]
}
```

| Field | What it holds |
| --- | --- |
| `text` | Panel title. |
| `detail` | Small label above the title. |
| `extra` | One-line instruction under the header. |
| `items[].title` | Example chip label. |
| `items[].amount` | Hours available (decimals allowed, up to 24). The first example is also the starting value. |
| `items[].detail` | Task hours as `"a,b,c"`. Leave a slot empty for fewer tasks (`"3,2,"`). |
| `items[].text` | Unused. Keep it `""` (the validator requires a string). |

Pick examples that show both an overload and a fit, so learners see both outcomes. Take the first from the lesson's worked example and one from the story.

## Bad input

No task hours, hours available of 0 or more than 24, or a negative task shows a short prompt instead of a result.

## Where the code lives

| File | What |
| --- | --- |
| `components/lesson-interactives.tsx` | `LoadCheckCalculator` (plus the `hm` hours formatter) |
| `components/reading-blocks.tsx` | `case 'loadcheck'` |
| `app/premium.css` | `.load-frame*` (four fields: 4 columns on desktop, 2 on phones). Everything else reuses `.conv-frame`, `.util-frame` and `.score-frame`. |
| `lib/types.ts`, `lib/content-validation.ts` | `'loadcheck'` block type |

Add changes under `.load-frame`, never on `.score-frame` or `.conv-frame`.

## Checklist

- [ ] Placed straight after the worked example it automates.
- [ ] The first example reproduces the worked example exactly, and the story's figures match one chip.
- [ ] Checked on localhost:3000: chips switch examples, the overload shows the amber note, the fit shows spare time, and there's no sideways scroll at phone width.
