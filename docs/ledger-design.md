# Ledger design (`ledger` block)

A budget-style table for a list of **labelled dollar figures**, each with a category and a question. Each row shows the label, the amount, a category chip, the question, and a thin bar showing its share of the first row (the income total). A dark result panel can follow the rows.

**Reference:** Building a Canadian Household Budget (`content/money-01-lesson.json`, "Exhibit A: A Realistic Monthly Household").

Use it instead of a `cards` grid whenever the items are numbers that add up. On phones each row stacks (label and amount, chip, question, bar) so nothing scrolls sideways.

---

## JSON

```json
{
  "type": "ledger",
  "detail": "HEARING RESULT",
  "text": "$5,200 income minus $5,200 planned jobs equals $0 unassigned.",
  "extra": "The $150 margin is not missing. It has a job of its own, which is breathing room.",
  "items": [
    { "title": "Net household income", "amount": "$5,200", "detail": "Income", "text": "Is this reliable money after payroll deductions?" },
    { "title": "Housing and utilities", "amount": "$2,250", "detail": "Fixed/essential", "text": "What changes by season or billing cycle?" }
  ]
}
```

| Field | What it holds | Rules |
| --- | --- | --- |
| `items[].title` | Row label | Existing card title, word for word. |
| `items[].amount` | Dollar figure | Shown as written (`$2,250`). The bar width is this number divided by the largest amount in the set. |
| `items[].detail` | Category chip | Short, e.g. `Fixed/essential`. Shown in capitals by the CSS. |
| `items[].text` | The row's question | Word for word. |
| `text` | Result headline | Optional. Omit it and no result panel shows. |
| `detail` | Small label above the result | Optional, e.g. `HEARING RESULT`. |
| `extra` | Line under the headline | Optional. |

- **The first row is the total.** It gets a highlighted background and a teal bar. Put the income or grand total first, and every other row is measured against the largest amount.
- **Converting from `cards`:** the old text was `$amount — category — question`. Split it into `amount`, `detail` and `text`. Merge the "HEARING RESULT" heading and its two paragraphs into `detail`, `text` and `extra`.
- Never reword the learner-facing sentences.

## Where the code lives

| File | What |
| --- | --- |
| `components/reading-blocks.tsx` | `case 'ledger'` |
| `app/premium.css` | `.ledger*` styles (the row layout switches on the block's own width, not the screen) |
| `lib/types.ts`, `lib/content-validation.ts` | `ledger` block type and the `amount` field |

## Checklist

- [ ] Text is word for word. Only the field split is new.
- [ ] The total is the first row.
- [ ] Checked on localhost:3000 at desktop width and at phone width (no sideways scroll, chips and amounts readable).
