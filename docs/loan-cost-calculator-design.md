# Loan-cost calculator (`loancost` block)

An interactive "payment × number of payments − amount borrowed = borrowing cost" panel for **up to three offers side by side**, in the same glass frame and moving outline as the conversion, payday and utilization calculators. The learner enters the amount borrowed and each offer's payment and number of payments, and sees every offer's total repayment and borrowing cost, which has the lowest payment and which has the lowest cost.

**Reference:** Understanding Interest and APR (`content/money-07-lesson.json`, "Lab Test 1: Hold the Borrowing Amount Still", right after the two paragraphs that teach the formula and before the offer cards).

Use it where a lesson teaches **comparing loan offers for the same amount** by multiplying payment by number of payments. For cost ÷ months use [`conversion-calculator-design.md`](conversion-calculator-design.md). For savings deposits use [`payday-calculator-design.md`](payday-calculator-design.md).

---

## JSON

```json
{
  "type": "loancost",
  "text": "Compare three offers",
  "detail": "INTERACTIVE MATH LAB",
  "extra": "Enter the amount borrowed, then each offer’s payment and number of payments. Watch the borrowing cost update.",
  "items": [
    { "title": "Owen’s three offers", "text": "", "amount": "2000", "detail": "185:12,75:36,53:60" }
  ]
}
```

| Field | What it holds |
| --- | --- |
| `text` | Panel title. |
| `detail` | Small label above the title. |
| `extra` | One-line instruction under the header. |
| `items[].title` | Example chip label. |
| `items[].amount` | Amount borrowed for that example, digits only. The first example is also the starting value. |
| `items[].detail` | Three `payment:count` pairs for offers A, B and C, comma separated (`185:12,75:36,53:60`). |
| `items[].text` | Unused. Keep it `""` (the validator requires a string). |

Take the example figures from the lesson's own numbers (here Owen's $185 × 12, $75 × 36 and $53 × 60 on $2,000). Every chip must have exactly three pairs.

## What it does

- **Per offer:** `payment × count = total repayment`, then `Borrowing cost = total − borrowed`. A total below the amount borrowed is flagged instead of shown as a negative cost.
- **Result:** which offer has the lowest borrowing cost, and whether the lowest payment is the same offer. If not, it says how much more the lowest-payment offer costs to borrow.
- **Tiles** (when two or more offers are filled in): lowest payment, lowest total cost, and the cost of choosing the lower payment.
- **Example chips:** one tap fills every field. The active chip stays highlighted while the numbers match it.
- **Bad input:** a blank offer shows a short prompt and is left out of the comparison. A blank or zero amount borrowed shows a prompt instead of costs.

## Where the code lives

| File | What |
| --- | --- |
| `components/lesson-interactives.tsx` | `LoanCostCalculator` |
| `components/reading-blocks.tsx` | `case 'loancost'` |
| `app/premium.css` | `.loan-frame*`, built on the shared `.conv-frame` and `.util-frame` styles |
| `lib/types.ts`, `lib/content-validation.ts` | `'loancost'` block type |

## Checklist

- [ ] Placed straight after the formula it explains, before the offer cards.
- [ ] Example figures match the lesson's own numbers and each `detail` has three `payment:count` pairs.
- [ ] Checked on localhost:3000: typing in every field updates the result, the chip highlights, and nothing overflows at phone width.
