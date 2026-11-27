# Sleep-window calculator (`sleepwindow` block)

An interactive "count back from the alarm" panel in the same glass frame and moving outline as the conversion calculator. The learner enters a fixed wake-up time, the hours of sleep they're aiming for, the minutes it takes them to fall asleep and their wind-down length. The plan updates live.

**Reference:** Sleep and Recovery (`content/health-26-lesson.json`, "Count back from the alarm", right after the worked example).

Use it where a lesson teaches **planning a day backwards from a fixed time** with sleep. It is the Elite "twist" tool for Health & Fitness. Place it right after the paragraph that works the example by hand.

---

## The maths

```
wake-up time − (hours of sleep + minutes to fall asleep) = lights-out time
lights-out time − wind-down minutes                      = start wind-down
lights-out time − 6 hours                                = last caffeine (about)
hours of sleep + minutes to fall asleep                  = sleep opportunity
```

Times wrap past midnight both ways, so a 3:00 p.m. wake-up after a night shift gives a 7:10 a.m. lights-out.

## JSON

```json
{
  "type": "sleepwindow",
  "text": "Find your lights-out time",
  "detail": "INTERACTIVE SLEEP LAB",
  "extra": "Enter your fixed wake-up time and the sleep you’re aiming for. The plan counts back for you.",
  "items": [
    { "title": "Early workday", "text": "", "amount": "06:30", "detail": "7.5" },
    { "title": "After a night shift", "text": "", "amount": "15:00", "detail": "7.5" },
    { "title": "Day off", "text": "", "amount": "07:30", "detail": "8" }
  ]
}
```

| Field | What it holds |
| --- | --- |
| `text` | Panel title. |
| `detail` | Small label above the title. |
| `extra` | One-line instruction under the header. |
| `items[].title` | Example chip label. |
| `items[].amount` | Wake-up time, 24-hour `HH:MM`. The first example is also the starting value. |
| `items[].detail` | Hours of sleep, digits only (halves allowed: `7.5`). |
| `items[].text` | Unused. Keep it `""` (the validator requires a string). |

Minutes to fall asleep start at 20 and wind-down at 15. The examples don't change them, so a learner's own settling time stays put while they try examples.

Take example figures from the lesson's worked example and story (health-26: the 6:30 a.m. worked example and Mara's 3 p.m. alarm).

## What it shows

- **Result:** "Lights out by 10:40 p.m.", with the working underneath (`6:30 a.m. − (7 h 30 min + 20 min) = 10:40 p.m.`). Times use Canadian `a.m.` / `p.m.`.
- **Tiles:** start wind-down, last caffeine about (6 hours before lights out, matching the lesson's caffeine advice) and sleep opportunity.
- **Below the guideline:** under 7 hours of sleep flags the sleep-opportunity tile and shows a note that the schedule, not the learner, needs to change. This follows Canada's 24-Hour Movement Guidelines (7–9 hours for adults 18–64, 7–8 for 65+).
- **Bad input:** a missing time, or hours outside 1–12, shows a short prompt instead of a time.

## Where the code lives

| File | What |
| --- | --- |
| `components/lesson-interactives.tsx` | `SleepWindowCalculator` (plus the `clockTime` and `hoursMinutes` helpers) |
| `components/reading-blocks.tsx` | `case 'sleepwindow'` |
| `app/premium.css` | `.sleep-frame*` (the four-field row: 4 columns on desktop, 2 on phones). Everything else reuses `.conv-frame`, `.util-frame` and `.score-frame`. |
| `lib/types.ts`, `lib/content-validation.ts` | `'sleepwindow'` block type |

Don't edit `.score-frame` or `.conv-frame` to restyle this block. Add changes under `.sleep-frame`.

## Checklist

- [ ] Placed straight after the worked example it automates.
- [ ] The first example matches the worked example's figures, and any story figure is reproduced exactly by one chip.
- [ ] Checked on localhost:3000: chips switch examples, typing updates the result, the night-shift example wraps past midnight, and there's no sideways scroll at phone width.
