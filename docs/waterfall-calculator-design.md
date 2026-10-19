# Waterfall calculator (`waterfall` block)

An interactive **surplus-assignment** panel in the same glass frame and moving outline as the other calculators. The learner enters the income they received and their baseline. The block works out the surplus (income − baseline) and shows one box per job for that surplus, prefilled in the lesson's priority order. As they type, it shows how much is assigned and how much has no job yet.

**Reference:** Managing Variable Income (`content/money-10-lesson.json`, "Give Every Sunny-Month Dollar a Job", right after "Total assigned: $2,100.").

Use it where a lesson teaches **money above a fixed amount being split across named jobs until nothing is left** (a sunny-month surplus, a bonus, a tax refund). For a single formula use the [conversion](conversion-calculator-design.md), [payday](payday-calculator-design.md), [loan-cost](loan-cost-calculator-design.md) or [interest-scan](interest-scan-calculator-design.md) calculators. For comparing two repayment orders use [`payoff-calculator-design.md`](payoff-calculator-design.md).

---

## JSON

```json
{
  "type": "waterfall",
  "text": "Assign your own surplus",
  "detail": "INTERACTIVE MATH LAB",
  "extra": "Enter what you received and your baseline. Give every dollar above the baseline a job until nothing is left unassigned.",
  "items": [
    {
      "title": "Zara’s sunny month",
      "text": "",
      "amount": "5200",
      "detail": "3100;Tax/remittance:500,Income buffer:500,Irregular costs:300,Emergency fund:400,High-interest debt:250,Long-term goal:100,Flexible spending:50"
    }
  ]
}
```

| Field | What it holds |
| --- | --- |
| `text` | Panel heading |
| `detail` | Pill label above the heading (`INTERACTIVE MATH LAB`) |
| `extra` | One-sentence intro under the header |
| `items[].title` | Label on the "Try an example" button |
| `items[].amount` | Income received, digits only (`"5200"`) |
| `items[].detail` | `baseline;Job:amount,Job:amount,…`. The part before `;` is the baseline. Up to **8** jobs after it. No `:`, `,` or `;` inside a job name. |

The first item loads on open. Add more items for more one-tap examples. List the jobs **in the lesson's priority order**; the number badge on each box is its position.

## What the learner sees

| Situation | Result |
| --- | --- |
| Income above baseline, surplus fully assigned | "Every dollar of the $2,100 surplus has a job." Unassigned tile shows $0. |
| Surplus not fully assigned | "$X of the $Y surplus still has no job." Unassigned tile turns amber. |
| More assigned than the surplus | "You have assigned $X more than the $Y surplus." Unassigned tile turns amber and shows a negative amount. |
| Income below baseline | "Income is $X below your baseline. This is a storm month." The job boxes are hidden and the line points to the storm-month rule (cover essentials, use the buffer, pause lower priorities). |
| Income equals baseline | "There is no surplus to assign." |
| A field is empty | "Enter the income you received and your baseline." |

Each job box has a thin bar showing its share of the surplus.

The block never works out tax or remittance. A fixed note under the tiles tells learners to type a confirmed figure, not a guess. This matches the lesson's own rule.

## How it looks

- Two fields across the top (income, baseline), then the job boxes in two columns on a laptop and one on a phone.
- A result line, then three tiles: Surplus above baseline, Assigned, Unassigned.
- The example button sits at the bottom.

## Where the code lives

| File | What |
| --- | --- |
| `components/waterfall-calculator.tsx` | `WaterfallCalculator` |
| `components/reading-blocks.tsx` | `case 'waterfall'` |
| `lib/types.ts`, `lib/content-validation.ts` | `'waterfall'` block type |
| `app/premium.css` | `.waterfall-frame` styles at the end of the file. The frame, fields and tiles come from `.loan-frame` and `.conv-frame`. |

## Checklist

- [ ] Placed right after the lesson's own worked example, so learners can compare.
- [ ] The example's amounts add up to the surplus (income − baseline), so it opens on "Every dollar … has a job."
- [ ] Jobs are listed in the lesson's priority order, with no `:`, `,` or `;` in names.
- [ ] Checked on localhost:3000: the example loads, the numbers update as you type, a storm-month income shows the storm message, and nothing overflows on a phone.
