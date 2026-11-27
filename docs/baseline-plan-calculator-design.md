# Baseline plan calculator (`baselineplan` block)

An interactive "plan into the gaps you already have" panel in the same glass frame and moving outline as the conversion calculator. The learner enters the free slots their baseline week showed, how many they'll plan and the minutes per session. Planned weekly minutes, backup slots, the share of the 150-minute guideline and the weeks 2–12 total update live.

**Reference:** Twelve-Week Transformations (`content/health-30-lesson.json`, "Read your baseline week", right after the worked example).

Use it where a lesson builds a **multi-week plan from an observed baseline week** and teaches keeping a spare slot as a backup. Place it right after the paragraph that works the example by hand.

---

## The maths

```
weekly minutes = slots planned × minutes per session
backup slots   = free slots − slots planned          (flag at 0)
guideline share = weekly minutes ÷ 150               (Canada's 24-Hour Movement Guidelines, adults 18–64)
weeks 2–12     = 11 × weekly minutes                 (week 1 is the baseline week, so it isn't counted)
```

With zero backup slots, the backup tile reads "None" in amber, with a note that the first busy week will break the plan.

## JSON

```json
{
  "type": "baselineplan",
  "text": "Turn your baseline into a plan",
  "detail": "INTERACTIVE PLANNING LAB",
  "extra": "Enter the free slots your baseline week showed, how many you’ll plan and how long each session is.",
  "items": [
    { "title": "Worked example", "text": "", "amount": "4", "detail": "3,15" },
    { "title": "Grace’s baseline", "text": "", "amount": "3", "detail": "2,10" },
    { "title": "Every slot booked", "text": "", "amount": "3", "detail": "3,20" }
  ]
}
```

| Field | What it holds |
| --- | --- |
| `text` | Panel title. |
| `detail` | Small label above the title. |
| `extra` | One-line instruction under the header. |
| `items[].title` | Example chip label. |
| `items[].amount` | Free slots in the baseline week, 1–14. The first example is also the starting value. |
| `items[].detail` | `"planned,minutes"`: slots planned (≤ free slots) and minutes per session (1–120). |
| `items[].text` | Unused. Keep it `""` (the validator requires a string). |

Include one example with every slot booked, so learners see the backup warning.

## Bad input

Planned slots above free slots, zero planned slots, or minutes outside 1–120 show a short prompt instead of a result.

## Where the code lives

| File | What |
| --- | --- |
| `components/lesson-interactives.tsx` | `BaselinePlanCalculator` |
| `components/reading-blocks.tsx` | `case 'baselineplan'` |
| `app/premium.css` | `.baseline-frame*` (three fields: 3 columns on desktop, 1 under 560px). Everything else reuses `.conv-frame`, `.util-frame` and `.score-frame`. |
| `lib/types.ts`, `lib/content-validation.ts` | `'baselineplan'` block type |

Add changes under `.baseline-frame`, never on `.score-frame` or `.conv-frame`.

## Checklist

- [ ] Placed straight after the worked example it automates.
- [ ] The first example reproduces the worked example exactly, and the story's baseline matches one chip.
- [ ] Checked on localhost:3000: chips switch examples, the fully booked example shows the amber note, and there's no sideways scroll at phone width.
