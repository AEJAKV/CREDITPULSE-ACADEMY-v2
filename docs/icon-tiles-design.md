# Icon tiles (`cards` block with icons)

A white `cards` grid where each card shows a small icon tile instead of the "01, 02…" number. Use it for **short region, category, question or step notes (2–5 tiles)** where a picture cue helps scanning (for example, one tile per province group).

**References:** Building a Canadian Household Budget (`content/money-01-lesson.json`, "Province Lens") and Managing Money Between Paydays (`content/money-02-lesson.json`: the four-question opener, the three-part separation method and the province guardrails) and Emergency Funds (`content/money-03-lesson.json`: the four triage questions, the emergency and sinking-fund examples, the essential-cost categories and the deposit-insurance provinces) and Canadian Bank Accounts and Fees (`content/money-04-lesson.json`: account jobs, the four mystery-shop questions, the three monthly statements and five regulator tiles).

## How to apply it

Add an `icon` to each item of an existing `cards` block. Nothing else changes, and the text stays word for word. If **any** item has an `icon`, the whole block switches to icon tiles. Without icons, it stays the numbered grid.

```json
{
  "type": "cards",
  "items": [
    { "title": "AB and BC", "text": "Use your real housing…", "icon": "mountain" },
    { "title": "NB and PEI", "text": "Build in the real seasonal…", "icon": "snowflake" }
  ]
}
```

| Icon | Shows | Good for |
| --- | --- | --- |
| `mountain` | Peaks | mountain provinces, terrain |
| `snowflake` | Snowflake | winter, heating, seasonal work |
| `building` | Office block | city, commuting, housing |
| `waves` | Waves | coast, water, marine |
| `map` | Map pin | generic place (also the fallback for an unknown name) |
| `flame` | Flame | heating, energy |
| `home` | House | housing |
| `car` | Car | driving, transport |
| `calendar` | Calendar | dates, deposits, schedules |
| `bank` | Bank building | accounts, ownership, lenders |
| `route` | Route with two stops | crossings, gaps, journeys |
| `shield` | Shield with tick | floors, buffers, protection |
| `inbox` | Arrow into tray | money arriving, income |
| `receipt` | Receipt | bills, withdrawals |
| `wallet` | Wallet | daily spending |
| `zap` | Lightning bolt | sudden events |
| `lifebuoy` | Lifebuoy | needs, rescue, support |
| `alert` | Warning triangle | unplanned, risk |
| `timer` | Timer | time-sensitive, deadlines |
| `heart` | Heart with pulse | health, medical, dental |
| `briefcase` | Briefcase | work, income |
| `gift` | Gift | gifts, holidays |
| `basket` | Shopping basket | food, groceries |
| `piggy` | Piggy bank | savings |
| `target` | Target | goals, purpose |
| `activity` | Activity pulse | habits, behaviour, usage |
| `tree` | Pine tree | forest or northern provinces |

Use a different icon for each tile in a set.

## How it looks

- Columns follow the **block's own width**, not the screen: two across for sets of 2 or 4, three across for sets of 3 or 5 (the `by-three` class is added automatically), one across when the block is narrow. When narrow, the icon sits to the left of the title and text to save height. This works on a laptop (where the lesson column is narrower than the window) as well as on a phone.
- Frosted white tiles with a soft shadow, a mint icon tile and a green title. They lift slightly on hover (switched off under reduced motion).

## Where the code lives

| File | What |
| --- | --- |
| `components/reading-blocks.tsx` | `case 'cards'` and the `tileIcons` map. Add new icons there. |
| `app/premium.css` | `.factor-grid.has-icons` (columns use `auto-fit`; the narrow layout is an `@container` query) |

## Checklist

- [ ] Every item has a different `icon` from the list above.
- [ ] Titles and text unchanged.
- [ ] Checked on localhost:3000 at desktop and phone width.
