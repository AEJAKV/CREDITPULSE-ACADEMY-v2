# Payoff calculator (`payoff` block)

An interactive **snowball vs avalanche** panel for **up to four debts**, in the same glass frame and moving outline as the loan-cost and interest-scan calculators. The learner enters an extra monthly amount and each debt's balance, yearly rate and required payment. The block runs both routes month by month on the same budget and shows each route's total interest, months to finish, when each debt clears, the interest difference, and which route clears the second debt sooner.

**Reference:** Snowball Versus Avalanche Debt Repayment (`content/money-09-lesson.json`, "Tournament Results", right after the two "THE TRADE-OFF" paragraphs).

Use it where a lesson compares **two repayment orders on the same debts**. For a single formula use [`interest-scan-calculator-design.md`](interest-scan-calculator-design.md), [`loan-cost-calculator-design.md`](loan-cost-calculator-design.md), [`conversion-calculator-design.md`](conversion-calculator-design.md) or [`payday-calculator-design.md`](payday-calculator-design.md).

---

## JSON

```json
{
  "type": "payoff",
  "text": "Run your own tournament",
  "detail": "INTERACTIVE MATH LAB",
  "extra": "Enter up to four debts and the extra amount you can add each month. Watch both routes run on the same budget.",
  "items": [
    {
      "title": "Devon’s four debts",
      "text": "",
      "amount": "250",
      "detail": "Retail card:900:29.99:35,Family loan:1500:0:50,Credit card:3400:24.99:105,Line of credit:8000:11.5:120"
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
| `items[].amount` | Extra monthly amount, digits only (`"250"`) |
| `items[].detail` | Up to four debts as `name:balance:rate:payment`, comma separated. Rate is a plain number (`29.99`). No `:` or `,` inside a name. |

The first item loads on open. Add more items to give the learner more one-tap examples.

## The model (must match the lesson's own rules)

Same rules as the Canadian Debt Payoff Tool workbook and the lesson's "Model Rules" text:

1. Each month, interest is added to every open balance: balance × rate ÷ 12.
2. Every required payment is made (capped at the balance).
3. The rest of the fixed budget (all required payments + the extra) goes to the first open debt in priority order, **and anything left over in the same month cascades to the next one**.
4. A cleared debt's payment stays in the budget, so it rolls to the next target.
5. No new charges, fees or missed payments. The model stops at 600 months and then tells the learner to raise a payment.

**Priority order.** Snowball: smallest starting balance first. Avalanche: highest rate first, smaller balance first on a tie.

Rule 3's "cascade" matters. Without it the model drops money in the month a debt clears and the figures drift. With it, Devon's example reproduces the lesson exactly: snowball $2,490 and 30 months, avalanche $2,197 and 29 months, a $293 gap, and the second debt clearing in month 8 versus month 13.

**If you reuse this in another lesson**, run the lesson's own debts through the block first and check the published figures match before relying on it.

## How it looks

- Extra-amount field across the top, then one box per debt (two across on a laptop, one on a phone) with Balance, Annual rate and Required payment. Under each box, the month that debt clears under each route.
- A result line ("Avalanche costs about $293 less interest.") with a second line for the second-debt and finish-month comparison.
- Three tiles: Snowball, Avalanche and Interest difference. The difference tile turns amber when snowball is cheaper.
- A short training-model note, then the "Try an example" button.
- Debts left blank are skipped. It needs at least two complete debts.

## Where the code lives

| File | What |
| --- | --- |
| `components/payoff-calculator.tsx` | `PayoffCalculator` component and the `payoffPlan` model |
| `components/reading-blocks.tsx` | `case 'payoff'` |
| `lib/types.ts`, `lib/content-validation.ts` | `'payoff'` block type |
| `app/premium.css` | `.payoff-frame` styles at the end of the file. The frame, fieldsets and tiles come from `.loan-frame` and `.conv-frame`. |

## Checklist

- [ ] Placed right after the paragraphs that give the lesson's own results, so learners can compare.
- [ ] The example's figures match the lesson's published numbers (run it and compare).
- [ ] Debt names have no `:` or `,`.
- [ ] Checked on localhost:3000: the example loads, the numbers update as you type, and nothing overflows on a phone.
