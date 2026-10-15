# File Cards design (`filecards` block)

A numbered checklist shown as an image cover beside tall gradient cards, each with a large faded number watermark. It was first used in **Rebuilding Credit After Collections** (`content/credit-11-lesson.json`, section "Put these six items in the file").

Use it in place of the plain white `cards` grid when a lesson has a short set of named items (ideally **6**) that deserve visual weight.

---

## How to apply it to another lesson

1. In the lesson JSON, find the `heading` block followed by a `cards` block.
2. Replace both with one `filecards` block:
   - `text`: the old heading text, word for word.
   - `image`: a local lesson image under `/images/...` (never an outside URL).
   - `items`: the old card items, unchanged.
3. Delete the old `heading` block. The heading now sits on the image card, so keeping the block would show it twice.

**Before**

```json
{ "type": "heading", "text": "Put these six items in the file" },
{
  "type": "cards",
  "items": [
    { "title": "Collector identity", "text": "Write down the agency, ..." }
  ]
}
```

**After**

```json
{
  "type": "filecards",
  "text": "Put these six items in the file",
  "image": "/images/credit-mastery/03-gold/credit-11/credit11-image-2.webp",
  "items": [
    { "title": "Collector identity", "text": "Write down the agency, ..." }
  ]
}
```

### When there is no heading block

Some `cards` blocks follow a `paragraph` instead of a `heading`. In that case, use the **short paragraph directly before the cards** as `text`, word for word, and delete that paragraph block. Any earlier paragraphs stay as normal text. Examples:
- credit-11, "Build Better Evidence": "Keep your routine simple enough to repeat."
- credit-12, "Gate 2": "Review both. A fix at one bureau does not prove the other file changed."

If the paragraph is longer than about 15 words but its **first sentence** works on its own as a heading, split it: the first sentence becomes `text`, and the rest stays as a paragraph, word for word, moved to **directly after** the `filecards` block so the heading is still read first. Example:
- credit-14, "Use a Script That Matches the Situation": "A script keeps the call short enough to be useful." The rest ("Speak calmly, promise nothing…") follows the cards.

If neither works (the paragraph is long and its first sentence doesn't introduce the cards), ask the user for a heading instead of inventing one. Offer the **section's own title** as the first option. The user approved this for credit-15, "Evidence Hearing: Build the Timeline Before Testing the Clock", which became "Build the timeline before testing the clock". Drop any label before the colon and use sentence case. In this case the paragraph before the cards stays where it is.

### Choosing the image

Use an image the lesson already has, in this order of preference:
1. The carousel slide that shows the **action** (`<id>-image-2.webp`). This suits the first set of cards in a lesson.
2. The lesson **hero** (`hero-image.webp`). This suits a second set of cards, or a section about reviewing or rebuilding.
3. Avoid the story image (`<id>-image-3.webp`). It is portrait with the subject low in the frame, so the wide tablet and phone banner crops to empty background.

Avoid the "problem" carousel slide (`-image-1`), because a worried face clashes with a checklist of actions. Don't use the same image for two `filecards` blocks in one lesson.

### Rules

- Do not change titles or descriptions. Only the block type and structure change.
- The image must be a local file matching `/images/....(webp|avif|jpg|png)`. That is all the content validator accepts.
- Pick an image where the subject sits in the upper-middle of the frame, because the heading overlays the bottom. A shot of the course's main character with their documents works best.
- If the lesson has no suitable image, leave `image` out. The cover falls back to a deep green gradient, and you can add the photo later.
- Six items fill the 3×2 grid exactly. Other counts still work, but leave gaps on desktop. Three items is the next best fit (one row).
- Keep descriptions to about 25 words or fewer. Desktop cards are only about 163px wide.
- Two-word titles are ideal. Longer titles wrap, which is fine.
- **A single word of 14 or more letters** (such as "Acknowledgements") doesn't fit the narrow desktop card. Chrome on Windows can't hyphenate it automatically. Add an invisible soft hyphen (`­`) at a syllable break in the JSON title, for example `"Acknowledge­ments"`. The text looks the same, but breaks as "Acknowledge-" / "ments" when it wraps. As a fallback, the CSS (`overflow-wrap: break-word`) stops any long word spilling past the card edge.

---

## Design spec

### Cards

| Property | Value |
| --- | --- |
| Shape | Portrait, `border-radius: 16px`, no border |
| Min height | 250px desktop · 220px tablet · 230px mobile |
| Layout inside | Title top-left (bold, 16px) · description bottom-left (14px desktop, 15px mobile) |
| Watermark | Number `01`–`06`, 150px, weight 800, bottom-right, offset `right: -10px; bottom: -38px` so the card edge cuts it off |
| Hover | `translateY(-4px)` plus a soft shadow, 0.2s. Disabled under `prefers-reduced-motion` |

### Colour sequence (brand greens, light → deep)

| Card | Gradient (160deg) | Text | Watermark | Worst-case contrast |
| --- | --- | --- | --- | --- |
| 1 | `#f1fbb4` → `#dcf88c` | `#092a2b` | `#092a2b` @ 9% | 13.7:1 |
| 2 | `#d4f77e` → `#c0f56d` | `#092a2b` | `#092a2b` @ 9% | 12.0:1 |
| 3 | `#b4ee78` → `#8fd672` | `#092a2b` | `#092a2b` @ 9% | 8.7:1 |
| 4 | `#16745d` → `#11594f` | `#ffffff` | `#ffffff` @ 7% | 5.7:1 |
| 5 | `#11594f` → `#0d4141` | `#ffffff` | `#ffffff` @ 7% | 8.2:1 |
| 6 | `#0d4141` → `#092a2b` | `#ffffff` | `#ffffff` @ 7% | 11.4:1 |

All pairs pass WCAG AA. Do not use white text on anything lighter than `#1e7a5a` (5.3:1), or dark text on anything darker than `#8fd672`.

Tones repeat every six cards (`tone-1` … `tone-6`).

### Image cover

- Photo is `object-fit: cover`, with a dark overlay rising from the bottom: `linear-gradient(to top, #092a2bf2 0%, #092a2b8c 42%, transparent 72%)`.
- Heading is white, 19px bold (18px on mobile), sitting bottom-left.
- Fallback with no image: `linear-gradient(160deg, #16745d, #092a2b)`.

---

## Responsive layout

| Viewport | Layout |
| --- | --- |
| **Desktop ≥1024px** | Cover on the left (1.2fr) spanning both rows, with the cards in a 3×2 grid to its right (3fr). All cards are equal height (`grid-auto-rows: 1fr`). |
| **Tablet 640–1023px** | Cover becomes a full-width banner (200px), with the cards in 2 columns below. |
| **Mobile <640px** | Short banner (150px), then a horizontal swipe row: `scroll-snap-type: x mandatory`, each card `flex: 0 0 80%` so the next one peeks in, scrollbar hidden. A `1 / 6` position counter shows below. The page itself never scrolls sideways. |

The swipe row is keyboard-focusable (`tabIndex=0`) and has a visible focus ring. The cards are an `<ol>`, so screen readers announce the order. The watermark and counter are `aria-hidden`.

---

## Where the code lives

| File | What |
| --- | --- |
| `components/lesson-interactives.tsx` | `FileCards` component (client, tracks the swipe position for the counter) |
| `components/reading-blocks.tsx` | `case 'filecards'` renders `FileCards` |
| `lib/types.ts` | `'filecards'` in `ReadingBlock['type']` |
| `lib/content-validation.ts` | `'filecards'` in the allowed block types |
| `app/premium.css` | Styles, in the block headed `/* File cards: ... */` near the end of the file |

The code is shared, so applying the design to another lesson is a **JSON-only change**. No code edits are needed.

---

## Checklist after applying

- [ ] Text is unchanged word for word (compare the items before and after).
- [ ] No card title has a single word of 14 or more letters without a soft hyphen (check on desktop that no title is cut off at the card edge).
- [ ] Phone numbers in card text use non-breaking hyphens (`‑`), so they never split across lines. Example: `1‑888‑495‑8501` (credit-16). They render as normal dashes.
- [ ] The old `heading` block is removed.
- [ ] The image path exists under `public/images/...`.
- [ ] Checked on desktop (about 1440px), tablet (768px) and phone (375px):
  - [ ] no sideways page scroll
  - [ ] no description cut off at the bottom of a card
  - [ ] the subject's face isn't cropped badly on the banner (crop is set by `object-position: 60% 22%` on tablet and mobile)
- [ ] `npx tsc --noEmit` and `npm test` pass.

## Rolling it out everywhere instead

To give every `cards` section this look, there are two options. You could map `case 'cards'` to `FileCards` in `reading-blocks.tsx`, but `cards` blocks have no image or heading and vary from 2 to 8+ items. The safer route is to convert lessons one at a time with the steps above. That way each one gets a chosen image and a layout check.
