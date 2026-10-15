# Lesson images guide: carousel, hero background, story image

Every treated lesson gets the same three image additions. Follow this guide so the remaining courses match the ones already done (credit-01 to credit-11).

| Addition | Images | Where it is set |
| --- | --- | --- |
| Image carousel | 2 | `artwork` block in the lesson JSON |
| Hero background | 1 | `heroImages` map in the lesson page |
| Story image | 1 | `image` field on the `story` block |

For the numbered card grid, see [`filecards-design.md`](filecards-design.md). For the photo step carousel, see [`image-card-carousel.md`](image-card-carousel.md).

---

## 1. Folder and file names

All images live in `public/images/`, one folder per lesson:

```
public/images/<course>/<NN-tier>/<lesson-id>/
```

| Tier | Folder | Credit Mastery lessons |
| --- | --- | --- |
| Starter | `01-starter` | credit-01 – credit-04 |
| Silver | `02-silver` | credit-05 – credit-08 |
| Gold | `03-gold` | credit-09 – credit-11 |
| Platinum | `04-platinum` | credit-12 – credit-14 |
| Diamond | `05-diamond` | credit-15 – credit-17 |
| Elite | `06-elite` | credit-18 – credit-20 |

Other courses use the same pattern (`money-budgeting/01-starter/money-01/`, and so on). Check the existing folder before creating one.

**File names** (lesson id without the hyphen, then the image number):

| Image | File name | Example (credit-12) |
| --- | --- | --- |
| Carousel slide 1 | `<id>-image-1.webp` | `credit12-image-1.webp` |
| Carousel slide 2 | `<id>-image-2.webp` | `credit12-image-2.webp` |
| Story image | `<id>-image-3.webp` | `credit12-image-3.webp` |
| Hero background | `hero-image.webp` | `hero-image.webp` |

Rules:
- **Copy** the file from Downloads, then rename the copy. Leave the original where it is.
- **Every lesson image is `.webp`.** Convert anything else (png, jpg, avif, heic-exported jpg and so on) with the script below. The validator accepts only `/images/…(webp|avif|jpg|png)` paths and never outside URLs, but all existing lessons use WebP, so stay consistent.
- If a lesson already has images, continue from the next free number. The story image always comes right after the carousel images.

### Converting to WebP

One command converts, resizes and saves to the right place in a single step. The source is never changed:

```bash
node scripts/lesson-image.js "<source file>" public/images/<course>/<NN-tier>/<lesson-id>/<file name>.webp
```

Example:

```bash
node scripts/lesson-image.js "C:/Users/ASUS TUF/Downloads/img 1.png" \
  public/images/credit-mastery/04-platinum/credit-12/credit12-image-1.webp
```

What it does (it uses `sharp`, which is already installed with the project):
- Shrinks the longest edge to at most **1672px** and never enlarges. The aspect ratio is kept.
- Applies the camera rotation and strips metadata (including GPS and camera info).
- Writes WebP at **quality 82**, then prints the final size and dimensions.

Use it for `.webp` sources too. It re-compresses oversized files to match the others.

**Target sizes** (matching credit-05, credit-10 and credit-11):

| Image | Shape | Typical dimensions | Typical file size |
| --- | --- | --- | --- |
| Carousel slides | Square | 1080×1080 – 1254×1254 | 70–100 KB |
| Story image | Portrait 9:16 | 941×1672 | 40–85 KB |
| Hero background | Landscape 16:9 | 1672×941 | 40–120 KB |

If a converted file is over about 200 KB, or much smaller than 900px on its short edge, flag it to the user before using it. A larger source image may be needed.

---

## 2. Image carousel (`artwork` block)

### Placement

The first section of the lesson (`start`), **directly after the first `spotlight`** and before the `myths` block. This is the position used in credit-05, credit-10 and credit-11.

### JSON

```json
{
  "type": "artwork",
  "items": [
    {
      "title": "A collection notice arrives. Read it, but don't pay yet.",
      "text": "A collection notice arrives. Read it, but don't pay yet.",
      "image": "/images/credit-mastery/03-gold/credit-11/credit11-image-1.webp"
    },
    {
      "title": "Every letter, call and receipt goes into one recovery file.",
      "text": "Every letter, call and receipt goes into one recovery file.",
      "image": "/images/credit-mastery/03-gold/credit-11/credit11-image-2.webp"
    }
  ]
}
```

`title` and `text` are identical. `text` is what shows on the slide.

### Writing the taglines

- One sentence each, **12 words or fewer**, so it fits at 28px on a phone.
- Write it at a grade-8 level, the same voice as the lesson. Plain, calm, no hype, no score promises.
- **Slide 1 = the problem or moment** (what the person is facing). **Slide 2 = the action or outcome** (what the course teaches them to do).
- Describe what the image shows, tied to the course method. For example: notice arrives → don't pay yet; papers → one recovery file.
- End with a full stop.

### How it looks

- Deep green panel (`#113d37`), 18px radius, at least 245px tall, with the tagline in large light text on the left.
- The photo fills the **right two-thirds**, in grayscale and screen-blended at about 60% opacity, fading out to the left.
- On phones the photo moves to the bottom 58% and fades upward.
- Controls below show previous and next arrows, "Image 1 of 2" and dots.

**Pick images where the subject sits right of centre.** The left third fades away behind the text. Because the photo is grayscale, its colours don't matter, but contrast and a clear subject do.

---

## 3. Hero background

### Wiring

Add one line to the `heroImages` map in `app/(academy)/course/[courseId]/lesson/[lessonId]/page.tsx`, in lesson order:

```ts
const heroImages: Record<string, string> = {
  // ...
  'credit-11': '/images/credit-mastery/03-gold/credit-11/hero-image.webp',
  'credit-12': '/images/credit-mastery/04-platinum/credit-12/hero-image.webp',
  // ...
};
```

### How it looks

- It sits behind the lesson title, in grayscale, screen-blended at **30% opacity**, and starts 14% in from the top and left.
- Masks fade the **left 55%** and the **top 40%**, so the text side stays clean.
- On phones (760px or narrower) it covers the bottom 62%, focused at `60% 20%`, and fades upward.

**Pick a wide (landscape) image with the main subject on the right half.** A scene that sums up the whole course works best. For example, credit-11's hero shows the verify → document → rebuild journey in one frame.

---

## 4. Story image

### JSON

Add `image` to the existing `story` block, between `extra` and `paragraphs`:

```json
{
  "type": "story",
  "text": "Meet Ariane",
  "detail": "DEDICATED STORY",
  "extra": "",
  "image": "/images/credit-mastery/03-gold/credit-11/credit11-image-3.webp",
  "paragraphs": ["..."]
}
```

Adding `image` switches the story to the **photo story** layout. Without it, the story renders as a plain card.

### How it looks

- A dark panel (`#102f31`) at least 560px tall. The photo fills it at 42% opacity, slightly desaturated, focused at `center 56%`.
- A dark gradient runs from left to right and from the bottom. The story text sits in a frosted glass panel on the **left**, at most 760px wide.
- The eyebrow (`detail`) is lime, small caps. The title (`text`) is white, 28–44px.

**Pick an image of the story's main character**, in the story's setting (for example, Ariane at the catering kitchen). Portrait or landscape both work, because the photo is cropped to cover. Keep the face around the middle of the frame, since the text panel covers the left side.

### Story length (do this at the same time)

- Aim for **about 200 words** (credit-10's story is 196). Long stories lose readers.
- Keep the arc: setup → problem arrives → temptation → better choice → proof or twist → outcome → short callback ending.
- Cut background detail and repeated beats, and anything a later section already teaches. Keep any detail that later sections refer back to.

---

## 5. Checklist per course

- [ ] Folder exists: `public/images/<course>/<NN-tier>/<lesson-id>/`
- [ ] Converted with `scripts/lesson-image.js` to `<id>-image-1.webp`, `<id>-image-2.webp`, `<id>-image-3.webp`, `hero-image.webp` (originals left in Downloads)
- [ ] Each file is within the target sizes (about 200 KB or less, short edge 900px or more)
- [ ] `artwork` block added after the first spotlight in `start`, with two taglines of 12 words or fewer (problem, then action)
- [ ] `heroImages` entry added in `page.tsx`, in lesson order
- [ ] `image` added to the `story` block, and the story is about 200 words
- [ ] Lesson JSON still parses: `node -e "JSON.parse(require('fs').readFileSync('content/<id>-lesson.json','utf8'))"`
- [ ] Viewed on localhost:3000 (CREDIT-PULSE-ACADEMY-v2; port 3001 is the separate course-delivery app)

### Editing the lesson JSON safely

Some lesson files have uncommitted rewrites in progress. When editing by script, read the current file, change only the target block, and keep the existing line endings and 2-space indentation. Then run `git diff --ignore-all-space` to confirm only the intended blocks changed.
