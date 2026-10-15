# Glass Panel design (`glasspanel` block)

One frosted glass container with a **moving colour outline**. A labelled header sits on top, with a row of translucent tiles below it. Each tile shows a small label, a large figure and a short caption.

**Visual reference:** the credit-score calculator in Understanding Your Credit (credit-01). The glass panel uses the same frame, outline animation and header styles, so the two always match.
**First used in:** Preparing for a Mortgage (`content/credit-17-lesson.json`, section "Run the File Before the Lender Does", "Cash screen": the three down-payment tiers).

Use it for **2–4 related facts that are compared side by side**, especially when each has a number: tiers, thresholds, rates, limits, before/after figures. It turns a plain white `cards` grid into one cohesive, calculator-style panel. For longer explanations or step sequences, use [`filecards-design.md`](filecards-design.md) or [`image-card-carousel.md`](image-card-carousel.md) instead.

---

## How to apply it

1. Find the `heading` + `cards` pair (or just the `cards` block).
2. Replace them with one `glasspanel` block:
   - `text`: the heading text, word for word. It becomes the panel header (shown in uppercase).
   - `detail` *(optional)*: a short ALL-CAPS pill label on the right of the header, **2–3 words** that name what the figures measure (for example `MINIMUM DOWN PAYMENT`). This is the only new wording.
   - `items`: the cards' items, unchanged.
3. Delete the old `heading` block, because the header now shows it.

**Before**

```json
{ "type": "heading", "text": "Cash screen" },
{
  "type": "cards",
  "items": [
    { "title": "UP TO $500,000", "text": "5% — Current minimum insured down payment." }
  ]
}
```

**After**

```json
{
  "type": "glasspanel",
  "text": "Cash screen",
  "detail": "MINIMUM DOWN PAYMENT",
  "items": [
    { "title": "UP TO $500,000", "text": "5% — Current minimum insured down payment." }
  ]
}
```

### The figure split

If an item's `text` contains **" — "** (space, em dash, space), the part before it shows as the **large figure** and the part after it as the caption:

| `text` | Figure | Caption |
| --- | --- | --- |
| `5% — Current minimum insured down payment.` | **5%** | Current minimum insured down payment. |
| `5% + 10% — 5% of first $500,000 plus 10% above it.` | **5% + 10%** | 5% of first $500,000 plus 10% above it. |

Keep the figure short (12 characters or fewer, such as `5%`, `$2,500`, `30 years`). Never reword the text to create a split. Only use it where the content already has one.

### Rows mode (label + amount sentences)

If an item's `text` has **no " — "** but is made of **two or more sentences that each read "Label $amount…"**, every sentence becomes an aligned row: the label on the left, and the amount in bold on the right (tabular numbers). The final full stop is dropped. Nothing else changes.

| `text` | Rows |
| --- | --- |
| `Monthly $536.67. Total payments $45,080.02. Interest $10,080.02.` | Monthly **$536.67** · Total payments **$45,080.02** · Interest **$10,080.02** |
| `Monthly $164.49 lower. Total payments $3,010.31 higher. Interest $3,010.31 more.` | Monthly **$164.49 lower** · Total payments **$3,010.31 higher** · Interest **$3,010.31 more** |

Use it for **side-by-side comparisons** (loan terms, scenarios, before/after). Use the same labels, in the same order, in every tile so readers can scan across. Put the "Difference" or result tile **last**, because the last tile gets the darkest accent. This mode is used in credit-18, "Total-Cost Lab: Expose the 84-Month Mirage": 84 months / 60 months / Difference, with the pill `$35,000 AT 7.49% APR` taken from the intro paragraph.

If a sentence doesn't fit the "Label $amount" pattern, the tile falls back to showing the whole text as one caption, so mixed text never breaks.

### No heading block?

Follow the same order as `filecards-design.md`: use a short paragraph right before the block, or the first sentence of a longer one, or else ask the user and offer the section's own title first.

---

## How it looks

| Part | Style |
| --- | --- |
| Frame | `.score-frame`: 2px outline made from a rotating conic gradient (green `#16745d` → mint `#6bdaa2` → white → purple `#8054c7` → lavender `#bb91ef`), **12s loop**, 11px radius, soft shadow. The animation stops under `prefers-reduced-motion`. |
| Panel | Frosted gradient `#fbfcfb → #edf4f0`, `backdrop-filter: blur(24px)`, inner highlight, 9px radius |
| Header | Sparkle icon + uppercase label (`text`) on the left, white pill (`detail`) on the right, divider line below (shared with the score explorer) |
| Tiles | Translucent white (`rgba(255,255,255,.45)`), white hairline border, 8px radius. Accent bar on top in a stepped green sequence: mint `#a9e582` → `#47a98a` → `#16745d` |
| Tile text | Label 0.68rem uppercase `#49635e` · figure 1.75rem bold · caption 0.82rem `#536c69` (15px on phones) |
| Layout | Tiles sit side by side and wrap automatically (`auto-fit`, at least 170px each). On phones they stack in one column. |

---

## Where the code lives

| File | What |
| --- | --- |
| `components/reading-blocks.tsx` | `case 'glasspanel'` (markup, the " — " figure split and rows mode) |
| `lib/types.ts`, `lib/content-validation.ts` | `'glasspanel'` block type |
| `app/premium.css` | `.glass-panel*` / `.glass-tile` styles near the end of the file. The frame and header come from `.score-frame` (the score explorer section). |

Applying it to another lesson is a **JSON-only change**.

**Don't edit `.score-frame` itself to restyle the glass panel.** The credit-score calculator and the utilization calculator share it. Add any panel-only change under `.glass-panel`.

---

## Checklist

- [ ] Heading moved into `text`, and the old `heading` block removed
- [ ] Item titles and texts unchanged word for word. Only the `detail` pill is new.
- [ ] Figures come from an existing " — " split and are 12 characters or fewer, **or** every sentence is "Label $amount" (rows mode), with the same labels in every tile
- [ ] The `detail` pill uses wording already in the section (for example, the loan amount and rate from the intro paragraph) wherever possible
- [ ] 2–4 tiles (more than 4 makes the row cramped; use file cards instead)
- [ ] Checked on localhost:3000: the outline is moving, the tiles are even and nothing overflows
