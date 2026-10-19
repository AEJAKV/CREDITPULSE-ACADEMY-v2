# Conversion calculator (`conversion` block)

An interactive "cost ÷ months = monthly transfer" panel in the same glass frame and moving outline as the credit-utilization calculator. The learner types a cost and a number of months, and the result updates live.

**Reference:** Building a Canadian Household Budget (`content/money-01-lesson.json`, "The Annual-Cost Conversion", right after the working formula).

Use it where a lesson teaches **one division the learner should try with their own numbers** (annual cost over months, a goal over months). Place it right after the formula paragraph.

---

## JSON

```json
{
  "type": "conversion",
  "text": "Convert an annual cost",
  "detail": "INTERACTIVE MATH LAB",
  "extra": "Enter any annual or predictable cost and the months available. Watch the planned monthly transfer update.",
  "items": [
    { "title": "Annual insurance", "text": "", "amount": "1440", "detail": "12" },
    { "title": "Tire replacement", "text": "", "amount": "900", "detail": "36" }
  ]
}
```

| Field | What it holds |
| --- | --- |
| `text` | Panel title. |
| `detail` | Small label above the title. |
| `extra` | One-line instruction under the header. |
| `items[].title` | Example chip label. |
| `items[].amount` | Example cost, digits only. The first example is also the starting value. |
| `items[].detail` | Example months, digits only. |
| `items[].text` | Unused. Keep it `""` (the validator requires a string). |

Take example figures from the lesson's own story (here: Elena's $1,440 premium, $600 gifts and $900 tires every three years).

## What it does

- **Result:** `$cost ÷ n months = $monthly`, with the dollar amounts formatted for Canada.
- **Pay-period tiles:** the same amount every two weeks and every week, since many learners are paid biweekly.
- **Planning window:** under 12 months it shows "Short runway" and a note that the first year may need a temporary adjustment, matching the lesson's own advice. Otherwise "On track".
- **Example chips:** one tap fills both fields. The active chip stays highlighted while the numbers match it.
- **Bad input:** a blank, zero or negative cost, or fewer than 1 month, shows a short prompt instead of a number.

## Where the code lives

| File | What |
| --- | --- |
| `components/lesson-interactives.tsx` | `ConversionCalculator` |
| `components/reading-blocks.tsx` | `case 'conversion'` |
| `app/premium.css` | `.conv-frame*`. The frame, inputs and result card reuse `.score-frame` and `.util-frame`. |
| `lib/types.ts`, `lib/content-validation.ts` | `'conversion'` block type |

## Checklist

- [ ] Placed straight after the formula it explains.
- [ ] Example figures match the lesson's own numbers.
- [ ] Checked on localhost:3000: chips switch examples, typing updates the result, no sideways scroll at phone width.
