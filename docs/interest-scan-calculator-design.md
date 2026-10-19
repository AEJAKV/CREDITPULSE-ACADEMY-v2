# Interest scan calculator (`interestscan` block)

An interactive "balance × annual rate ÷ 12 = estimated monthly interest" panel for **up to three debts side by side**, in the same glass frame and moving outline as the loan-cost calculator. The learner enters each balance and yearly rate and sees what each debt costs in interest each month, which debt costs the most, and which has the highest rate (they are often different debts).

**Reference:** Paying Down High-Interest Debt (`content/money-08-lesson.json`, "The Approximate Monthly Interest Scan", right after the two formula paragraphs and before the three cards).

Use it where a lesson teaches **estimating monthly interest from a balance and a rate**. For payment × payments comparisons use [`loan-cost-calculator-design.md`](loan-cost-calculator-design.md). For cost ÷ months use [`conversion-calculator-design.md`](conversion-calculator-design.md). For deposits towards a target use [`payday-calculator-design.md`](payday-calculator-design.md).

---

## JSON

```json
{
  "type": "interestscan",
  "text": "Scan your own debts",
  "detail": "INTERACTIVE MATH LAB",
  "extra": "Enter each balance and its yearly rate. Watch the estimated monthly interest update.",
  "items": [
    {
      "title": "Tara’s three debts",
      "text": "",
      "detail": "Store card:1050:29.99,Credit card:2800:22.99,Line of credit:3600:11.5"
    }
  ]
}
```

| Field | What it holds |
| --- | --- |
| `text` | Panel title. |
| `detail` | Small label above the title. |
| `extra` | One-line instruction under the header. |
| `items[].title` | Example chip label. |
| `items[].detail` | Three `name:balance:rate` triples for debts 1 to 3, comma separated. Digits only for balance and rate (no `$` or `%`). The first example is also the starting value. |
| `items[].text` | Unused. Keep it `""` (the validator requires a string). |

Take the figures from the lesson's own debts. Every chip must have exactly three triples, and a name must not contain `:` or `,`.

## What it does

- **Per debt:** `balance × rate% ÷ 12 ≈ monthly interest`.
- **Result:** which debt costs the most interest each month, and whether it also has the highest rate. If not, it says the highest-rate debt costs less a month because its balance is smaller, and by how much.
- **Tiles** (when two or more debts are filled in): most interest a month, highest rate, and all debts together a month.
- **Example chips:** one tap fills every field and the debt names. The active chip stays highlighted while the numbers match it.
- **Bad input:** a debt with a blank or zero balance, or a blank rate, shows a short prompt and is left out of the comparison.
- It is a training estimate only. The lesson's own text before the block tells learners to use their statement for the real charge.

## Where the code lives

| File | What |
| --- | --- |
| `components/lesson-interactives.tsx` | `InterestScanCalculator` |
| `components/reading-blocks.tsx` | `case 'interestscan'` |
| `app/premium.css` | Reuses the `.loan-frame*` styles (border sweep, offer cards, mobile layout) |
| `lib/types.ts`, `lib/content-validation.ts` | `'interestscan'` block type |

## Checklist

- [ ] Placed straight after the formula it explains, before the example cards.
- [ ] Figures match the lesson's own numbers and each `detail` has three `name:balance:rate` triples.
- [ ] Checked on localhost:3000: typing in every field updates the result, the chip highlights, and nothing overflows at phone width.
