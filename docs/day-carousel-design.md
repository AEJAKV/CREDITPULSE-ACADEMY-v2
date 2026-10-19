# Day carousel (coverflow `carousel` for day-by-day plans and numbered demands)

A coverflow carousel for **day-by-day plans**. The active day is a dark green card in the centre, and the days either side peek in blurred. It is for reading and moving through the plan; there is no "mark done" or progress tracking. Use it for a plan the learner works through **one day (or a short run of days) at a time**, for example a 30-day reset split into weekly carousels of 4–7 days. It also fits a **short numbered list of 5–7 items read one at a time**, labelled `NUMBER n` (see below).

**References:** The 30-Day Financial Reset (`content/money-15-lesson.json`): Week 1 (Days 1–7), Week 2 (Days 8–14), Week 3 (Days 15–21) and Week 4 (Days 22–30). Buying Versus Leasing (`content/money-16-lesson.json`): "The seven-number demand" (`NUMBER 1` to `NUMBER 7`).

## How to apply it

It is an ordinary `carousel` block. It switches to the day carousel **automatically** when every item's `detail` starts with `DAY `, `DAYS ` or `NUMBER ` and no item has an `image`. Nothing else has to be set. A carousel with any other label (`STEP 1`, `STATION 2`) or with photos keeps the image card carousel (`docs/image-card-carousel.md`).

```json
{
  "type": "heading",
  "text": "Week 3—Stabilize the System (Days 15–21)"
},
{
  "type": "carousel",
  "items": [
    { "title": "PROTECT", "text": "Fund housing, food, utilities…", "detail": "DAYS 15–16", "icon": "lock" },
    { "title": "TEST", "text": "Run a reduced-income or surprise-expense week…", "detail": "DAY 21", "icon": "clock" }
  ]
}
```

| Field | Rule |
| --- | --- |
| `detail` | `DAY 5`, `DAYS 15–16` or `NUMBER 3`, in capitals and unique within its carousel. The number goes in the tab's number pill. |
| `title` | ALL CAPS in the JSON. It shows in title case ("FLEXIBLE SPENDING" → "Flexible Spending"). Keep it short (1–2 words); long titles get an ellipsis in the phone tabs. |
| `text` | Word for word from the lesson. Aim for 25 words or fewer so it fits the panel without making the cards tall. |
| `icon` | One from the table below. An unknown name falls back to a tick. |
| `image` | Never. Adding a photo turns the block back into the image carousel. |

**Heading:** the carousel has **no title of its own**. It starts at the pill tabs, because the section title or the `heading` block above it already names the week, and repeating it centred over the tabs was redundant. That heading is also used, unseen, as the carousel's screen-reader name: the `heading` block directly before the carousel if there is one, otherwise the section title. When a section holds more than one day carousel (Weeks 3 and 4), **put a `heading` block just above each one**.

**Only use it for real days or real numbered items.** Don't relabel `STEP 1` as `DAY 1` to get this design. The label must be true to the content: `DAY n` for a day plan, `NUMBER n` for a list whose items are already numbered in the lesson (such as "the seven numbers"). Keep one label word for the whole carousel.

**Converting a numbered `cards` block** (`01`, `02`… as titles): keep each card's `text` word for word, set `detail` to `NUMBER 1`…, add a short ALL-CAPS `title` naming the item (for example `PRICE`, `DUE AT SIGNING`, `RATE AND CHARGES`) and an `icon`, and keep the `heading` above it. The seven-number demand uses `dollar`, `bank`, `search`, `calendar`, `filetext`, `lock`, `filecheck`.

| Icon | Shows | Good for |
| --- | --- | --- |
| `files` | Stack of files | gathering papers |
| `dollar` | Dollar in a circle | income, money moved |
| `list` | Checklist | sorting, listing, prioritizing |
| `search` | Magnifier with tick | finding, reviewing spending |
| `filetext` | Page of text | debts, statements, calls on record |
| `filesearch` | Page with magnifier | research, checking benefits |
| `filecheck` | Page with tick | verifying a change |
| `calendar` | Calendar | dates, scheduling |
| `clock` | Clock | timing, tests, deadlines |
| `bank` | Bank building | accounts, buffers |
| `lock` | Padlock | protecting essentials |
| `book` | Open book | choosing a goal, planning |
| `check` | Tick in a circle | finishing a week, departure |

Use a different icon for neighbouring days where you can.

## How it looks

**Desktop (768px and up)**, centred, 18px gaps:

1. Pill tabs (no eyebrow or title above them; see "Heading"): previous, current and next day (number pill + title). The current tab is pale green with a dark green number pill. Clicking a tab jumps to that day.
2. Stage: full section width with a soft fade at both edges. Cards are 400px wide:
   - **Centre:** dark green gradient panel, white text, lime eyebrow, white icon circle, 27px title, deep shadow.
   - **Neighbours (±1):** pale panel, dark text, 23px title, moved 340px out, scaled to 86%, 62% opacity, slightly blurred. Clicking anywhere on one brings it to the centre.
   - **Further away:** hidden (fully transparent, not clickable, not focusable).
   - Each card is just the panel (icon, day label, title, text) inside a white frame. There is no footer, no Mark done button and no "Done" badge: learners don't realistically tick off each day, so tracking was removed.
3. Controls: big counter "05 / 07" on the left, a progress bar in the middle (one grey segment per day; the current day is a long dark green segment), round prev/next arrows on the right (faded at the ends).

**Phone (under 768px):** 300px cards with neighbours at 262px so only a blurred sliver shows at each edge, taller panels so text never clips, a "Swipe or tap a side card" hint under the stage, and no counter (progress bar left, 48px arrows right).

**Motion:** cards move only with `transform` (0.55s); opacity, blur and colours fade over 0.45s. Under reduced motion there is no blur and no sliding: only the active card shows, and cards cross-fade.

## Behaviour

- **Always starts on the first day** of the carousel. Nothing is saved.
- **Swipe** left or right on touch (40px, mostly horizontal; vertical drags still scroll the page). **← / →** move between days while focus is inside the carousel.
- **Accessibility:** the section is a labelled carousel; tabs, progress segments, arrows and side cards are real buttons with labels; far cards are inert; if a focused side card is centred, focus moves to the carousel so ← / → keep working; the active day ("Day 5 of 7" or "Number 3 of 7", or "Day 8 · 1 of 7" when the number differs from its position) is announced ("Day 5 of 7: Debts").

## Where the code lives

| File | What |
| --- | --- |
| `components/day-carousel.tsx` | `DayCarousel` (state, swipe, keys, focus) |
| `components/reading-blocks.tsx` | `isDayCarousel()` (which `carousel` blocks switch) and `case 'carousel'` (picks the screen-reader name) |
| `components/lesson-interactives.tsx` | `carouselIcons` (shared with the image carousel). Add new icons there and to the table above. |
| `app/(academy)/course/[courseId]/lesson/[lessonId]/page.tsx` | Passes the section title to `ReadingBlocks` |
| `app/premium.css` | `--day-*` colour tokens and all `.day-carousel` / `.day-card` styles (offsets are `[data-offset]` rules; phone sizes are CSS variables in the `max-width: 767px` query) |

## Checklist

- [ ] Every item's `detail` is `DAY n`, `DAYS a–b` or `NUMBER n`, unique in its carousel, and true to the plan.
- [ ] No `image` on any item; every item has an `icon` from the table.
- [ ] The week heading is a `heading` block directly above the carousel (and not repeated anywhere else).
- [ ] Titles and text unchanged.
- [ ] Checked on localhost:3000 at desktop and phone width: tabs, side-card click, swipe, ← / →.
