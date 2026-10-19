# Image Card Carousel design (`carousel` block)

A sliding row of white cards. Each card has a photo on top, a round icon badge, a small step label ("STATION 1", "QUESTION 1"), an all-caps title and a short description. Arrows and dots move through the set, showing 3 at a time on desktop, 2 on tablet and 1 on phones.

**Reference:** Secured Credit Cards in Canada (`content/credit-06-lesson.json`, opening section: six inspection stations with photos).
**Also used in:** Rebuilding Credit After Bankruptcy (`credit-12`, "Five readiness questions") and Managing Rental Costs (`money-18`, "Put every housing cost under the X-ray").

Use it for a **sequence of 3–6 steps, questions or stations** (a longer timeline such as a 9-day cash-flow map also works, at three cards per page) the learner works through in order. It is a good replacement for a plain numbered `ordered` list or a white `cards` grid when the items deserve their own picture.

For the other reusable designs, see [`filecards-design.md`](filecards-design.md) and [`lesson-images-guide.md`](lesson-images-guide.md).

---

## Workflow

1. **I (Claude) build the carousel** from the existing section, with text word for word.
2. **You add the images.** Send one picture per card, in any format.
3. **I convert them to `.webp`** with `scripts/lesson-image.js` (see `lesson-images-guide.md`), save them in the lesson folder, rename them in sequence and add the `image` paths to the JSON.
4. Until the images arrive, the cards show without photos and the icon badge sits above the text. The layout is still usable, so the carousel can go live before the images are ready.

---

## JSON

```json
{ "type": "heading", "text": "Five readiness questions" },
{
  "type": "carousel",
  "items": [
    {
      "title": "ESSENTIALS COVERED",
      "text": "Are housing, food, utilities, transport, support payments and required debt payments covered?",
      "detail": "QUESTION 1",
      "icon": "list",
      "image": "/images/credit-mastery/04-platinum/credit-12/credit12-image-4.webp"
    }
  ]
}
```

| Field | What it holds | Rules |
| --- | --- | --- |
| `detail` | Step label | ALL CAPS: `STATION n`, `STEP n`, `STAGE n` (time-based phases), `QUESTION n` or `CHECK n`. Use one word for the whole set. |
| `title` | Card title | ALL CAPS, **2–4 words**. Use an imperative ("COUNT THE REAL COST") or a short noun phrase ("STARTER BUFFER"). |
| `text` | Description | The section's existing text, **word for word**. Ideally 15–25 words. |
| `icon` | Badge icon | One of the names in the icon list below. |
| `image` | Card photo | Optional. A local `/images/…/.webp` path. Add it when you send the image. |

Keep any heading above the carousel as its own `heading` block. Unlike file cards, the carousel has no heading built in.

### Converting an existing section

- **From an `ordered` list:** each item's `title` becomes the card's `text`, word for word. Write a new short ALL-CAPS `title` that names the idea. Add `detail` and `icon`.
- **From a `cards` grid:** keep `title` (in ALL CAPS) and `text` as they are. Add `detail` and `icon`.
- Never reword the learner-facing sentences. Only the short ALL-CAPS label is new.

### Icons

| Name | Shows | Good for |
| --- | --- | --- |
| `bank` | Bank building | deposits, lenders, accounts |
| `dollar` | Dollar coin | cost, fees, income, payments |
| `search` | Magnifier with tick | checking, reporting, reviewing terms |
| `filesearch` | File with magnifier | auditing reports |
| `filetext` | Document | statements, letters |
| `filecheck` | Document with tick | confirmed records, dispute outcomes |
| `files` | Stack of files | folders, record keeping |
| `list` | Checklist | essentials, requirements |
| `check` | Circle tick | final decision, done |
| `calendar` | Calendar | due dates, review dates |
| `clock` | Clock | timing, waiting, grace periods |
| `lock` | Padlock | protection, buffers, exit terms |
| `book` | Book | learning, rules |

Avoid repeating an icon within a set if another fits.

---

## Images

| Property | Value |
| --- | --- |
| Shape | **Landscape 16:9**, saved at 1672×941 (the converter limits the long edge to 1672px) |
| How it shows | Fills a 16:9 panel flush with the top and sides of the card (`aspect-ratio: 16 / 9`, `object-fit: cover`), with no padding above the photo |
| Badge | Teal circle (`--teal`, lime icon) overlapping the bottom-right of the photo |
| Content | One person carrying out that step, with the step's prop clearly visible (deposit box, calculator, report). Use the same person and setting across the set, as in credit-06. |
| File names | Continue the lesson's numbering after the existing images. Example: credit-12 uses `-image-1` to `-3`, so the five readiness cards are `credit12-image-4.webp` to `credit12-image-8.webp`, in card order. |

Send images in card order, or name them by step ("question 1", "station 2") so each one goes on the right card.

### No top gap (required)

The photo must sit flush against the top and both sides of the card, with no white strip above it. The CSS guarantees this as long as the image is **16:9**:

- `.card-carousel-image` is `aspect-ratio: 16 / 9` with `object-fit: cover`, so the photo always fills the panel edge to edge. Never switch it back to `contain` or a fixed pixel height. That is what created the gap.
- The badge position is tied to the same 16:9 panel (`top: calc(56.25cqw - 27px)`), so it always straddles the photo's bottom edge. Changing the panel ratio means changing that value too.
- **Always send 16:9 landscape images** (1672×941). If an image is a different ratio, `cover` crops it to fit, so keep the person and the key prop near the centre. A square or portrait image loses the top and bottom. Ask for a 16:9 re-export instead of accepting it.
- `scripts/lesson-image.js` keeps the source ratio and does not crop. After converting, check the size is about 1672×941 before adding the path to the JSON.

---

## How it looks

- Cards are white (`#ffffffdb`), 13px radius, with a thin border and a soft shadow.
- The step label is 9px, bold and teal-green with wide letter spacing. The title is 16px bold. The description is 13px muted text.
- 3 cards show at 1100px and up, 2 cards from 700 to 1099px, and 1 card below 700px.
- The track slides smoothly; motion is disabled under `prefers-reduced-motion`.
- Dots and round previous/next buttons sit below the track.
- **Without a photo**, the badge sits at the top-left above the label instead of floating over the text (see the `:not(:has(.card-carousel-image))` rule in `app/premium.css`).

## Where the code lives

| File | What |
| --- | --- |
| `components/lesson-interactives.tsx` | `CardCarousel` component and `carouselIcons` map |
| `components/reading-blocks.tsx` | `case 'carousel'` |
| `app/premium.css` | `.card-carousel*` styles |

Applying the carousel to another lesson is a **JSON-only change**.

---

## Checklist

- [ ] Text is unchanged word for word. Only the ALL-CAPS `title`, `detail` and `icon` are new.
- [ ] The step labels use one word for the whole set (all `QUESTION` or all `STATION`).
- [ ] Images have been requested from the user, with the planned file names listed.
- [ ] When the images arrive: converted with `scripts/lesson-image.js`, landscape at about 1672×941, and `image` paths added.
- [ ] Each photo is 16:9 and sits flush with the top and sides of the card (no white strip above it).
- [ ] Checked on localhost:3000: arrows and dots move through every card, and no badge overlaps text.

## Pending images

| Lesson | Section | Files needed |
| --- | --- | --- |
| credit-12 Rebuilding Credit After Bankruptcy | Five readiness questions | `credit12-image-4.webp` to `credit12-image-8.webp` (5 landscape images: essentials covered, starter buffer, paid from income, clear reported terms, able to wait) |
| credit-20 Credit Building After Divorce | Stabilize, Separate and Rebuild (5 steps) | `credit20-image-4.webp` to `credit20-image-8.webp` (5 landscape images: safety and access, payment continuity, lender-approved separation, bureau verification, independent rebuilding) |
| credit-18 Preparing for an Auto Loan | Build the Price Before Discussing the Payment (5 steps) | `credit18-image-4.webp` to `credit18-image-8.webp` (5 landscape images: cash price, separate the trade-in, financed extras, credit terms, ownership costs) |
| credit-13 Rebuilding Credit After a Consumer Proposal | Zone 3: Re-enter Credit in the Right Order (5 stages) | `credit13-image-4.webp` to `credit13-image-8.webp` (5 landscape images: days 0–30 stabilize, days 31–90 verify, months 4–6 test one tool, months 7–12 repeat, before a major loan compare) |
