# Payday calculator (`paydays` block)

An interactive "(target − saved) ÷ transfer per payday = deposits needed" panel, in the same glass frame and moving outline as the conversion and utilization calculators. The learner sets a target, what they have saved and what they can move each payday, picks how often they are paid, and sees how many deposits it takes.

**Reference:** Emergency Funds (`content/money-03-lesson.json`, "Build the Fund in Three Layers", right after the working formula).

Use it where a lesson teaches **a savings or payoff target reached by regular deposits**. For a single cost ÷ months calculation, use [`conversion-calculator-design.md`](conversion-calculator-design.md) instead.

---

## JSON

```json
{
  "type": "paydays",
  "text": "Plan your paydays",
  "detail": "INTERACTIVE MATH LAB",
  "extra": "Enter your target, what you have saved so far and what you can move each payday. Watch the number of deposits update.",
  "items": [
    { "title": "One month", "text": "", "amount": "3500" },
    { "title": "Three months", "text": "", "amount": "10500" },
    { "title": "Six months", "text": "", "amount": "21000" }
  ]
}
```

| Field | What it holds |
| --- | --- |
| `text` | Panel title. |
| `detail` | Small label above the title. |
| `extra` | One-line instruction under the header. |
| `items[].title` | Target chip label. |
| `items[].amount` | The target the chip loads, digits only. The first chip is also the starting target. |
| `items[].text` | Unused. Keep it `""`. |

Take the target chips from the lesson's own numbers (here, the one-, three- and six-month targets of the essential-expense ladder). The starting transfer is $45 every two weeks, which matches the lesson's example, and the panel's "Added in one year" tile reproduces its $1,170 over 26 paydays.

## What it does

- **Result:** `(target − saved) ÷ transfer = exact number`, then "rounded up to N" when it isn't whole, because a part deposit is still a deposit.
- **Pay frequency:** weekly (52), every two weeks (26), twice a month (24) or monthly (12). It changes the time estimate and the "added in one year" figure.
- **Tiles:** time at this pace (months, or years and months), added in one year, and percent already saved. A progress bar under the result fills as the saved amount grows.
- **Chips:** one tap loads a target. The active chip stays highlighted while the target matches.
- **Edge cases:** saved at or above the target shows "Target reached"; a blank target or a transfer of zero or less shows a short prompt instead of a number.

## Where the code lives

| File | What |
| --- | --- |
| `components/lesson-interactives.tsx` | `PaydayCalculator` |
| `components/reading-blocks.tsx` | `case 'paydays'` |
| `app/premium.css` | `.pay-frame*`, built on the shared `.conv-frame` and `.util-frame` styles |
| `lib/types.ts`, `lib/content-validation.ts` | `'paydays'` block type |

## Checklist

- [ ] Placed straight after the formula it explains, before the worked example.
- [ ] Target chips and the default transfer match the lesson's own numbers.
- [ ] Checked on localhost:3000: chips, frequency buttons and typing all update the result, and nothing overflows at phone width.
