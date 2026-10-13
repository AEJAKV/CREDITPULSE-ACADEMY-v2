# EXTRACT_COURSE.md

Instructions for migrating ONE course from the OLD project into the NEW project.

- OLD (source): credit-pulse-course-delivery (runs at http://localhost:3000)
- NEW (destination): CREDIT-PULSE-ACADEMY-v2 (runs at http://localhost:3001)

Claude Code should be started inside the NEW project (CREDIT-PULSE-ACADEMY-v2).
The old project must be added as an extra folder so it can be read:

    /add-dir <full path to credit-pulse-course-delivery>

(Example: C:\Users\<you>\Downloads\credit-pulse-course-delivery)

The OLD project is only a SOURCE. Never modify it. Only write inside the NEW project.

---

## How to use

Tell Claude Code:

> Follow EXTRACT_COURSE.md for this course:
> COURSE TITLE: <title>
> OLD COURSE: <old course number or slug, e.g. course-1-10 / the slug in the old URL>
> NEW CATEGORY: <e.g. credit-mastery or benefits-support>
> NEW TIER: <e.g. 01-starter, 02-silver, 03-gold, 04-platinum, 05-diamond, 06-elite>
> NEW LESSON ID: <e.g. credit-02 or benefits-01>

If any input is missing, ask before starting. Do not guess where a course belongs.

For batches, use the manifest section at the bottom.

---

## Rules (apply to every course)

1. Copy all text VERBATIM. Do not summarize, rewrite, shorten, reorder, fix
   grammar, or "improve" anything. Keep headings, paragraphs, bullet lists,
   tables, quizzes, key takeaways, callouts, and lesson order exactly as in
   the old project.
2. Match the NEW project's structure exactly. The new project is the template:
   its content format, field names, file names and image naming win over
   anything in the old project. Do not invent a new schema.
3. Never modify the old project. Never touch other courses or lessons in the
   new project.
4. If something cannot be converted or found (missing image, video, embedded
   quiz, content that only exists on a live page), do NOT invent it. List it in
   the final report.

## Steps

### 1. Study the NEW project first
Before copying anything, learn how an existing finished lesson is stored in
the new project, for example credit-mastery / 01-starter / credit-02:
- the content/ folder: file format, naming, and fields for lessons, quizzes,
  takeaways, and metadata
- how app/ routes load that content
  (e.g. /course/credit-mastery/lesson/credit-02)
- the image layout under public/images/<category>/<tier>/<lesson>/, for
  example public/images/benefits-support/01-starter/benefits-01/ contains
  hero-image.webp, benefit01-image-1.webp, benefit01-image-2.webp
- any rules in docs/, NOTES.md, or design-handoff/ about how lessons should
  be built

Choose one finished lesson as the reference and mirror it.

### 2. Study the OLD course
In the old project, find everything belonging to OLD COURSE:
- its content/data files and any components holding its text
- its images (for example public/images/course-1-10/ with files like
  10.1.webp, 10.2.webp, course-10bg.webp, dedicated-story-10.webp) and any
  "starter images" folder entries for it
Count the lessons/sections it contains. If the text lives somewhere that is
not in the files (database, API, remote CMS), tell me and stop.

### 3. Map old to new
Before writing files, show me a short mapping table and wait for my OK only
if anything is ambiguous:
- old content fields -> new content fields
- old image files -> new image file names
  (e.g. course-10bg.webp -> hero-image.webp, 10.1.webp -> <lesson>-image-1.webp)
  Never guess an image's role. If unsure, say so.

### 4. Create the lesson in the NEW project
- Create the content file(s) in content/ following the reference lesson.
- Copy the text verbatim into the new format.
- Copy images to public/images/<NEW CATEGORY>/<NEW TIER>/<NEW LESSON ID>/
  with the new naming pattern. Convert to .webp if not already. Update the
  paths in the content file.
- Register the lesson wherever the new project lists lessons (course
  index, tier list, navigation) only if that is how the reference lesson is
  registered.

### 5. Backup
Save a raw copy at extracted/<course-slug>.md in the NEW project: the full
verbatim text plus the list of source files and image mappings used.

### 6. Verify
- Lesson/section count in old vs. new must match.
- Every image path in the new content points to a file that exists.
- Run the type check / lint if the project has one, and fix errors you caused.
- Open http://localhost:3001/course/<category>/lesson/<lesson-id> (start
  npm run dev if needed) and confirm the lesson loads with all images.
- Compare 3 random paragraphs against the old project for exact wording.
- Optionally compare visually with the old page at http://localhost:3000.

### 7. Report (short)
- course title and where it was placed (category / tier / lesson id)
- sections: old count vs. new count
- images copied and their name mapping
- anything missing, skipped, or unclear
- the localhost:3001 URL to review

---

## Manifest (one-time setup for all 140 courses)

If courses-manifest.json does not exist in the NEW project, create it first:

> Scan the OLD project and list every course in courses-manifest.json:
> old number/slug, title, source file(s), image folder, and status "pending".
> There should be 140. Then PROPOSE the new category, tier, and lesson id for
> each one based on how the new project's tiers and categories are organized.
> Do not extract any content yet. Report the count, duplicates, and any
> course you could not place, then wait for my approval of the mapping.

After approval, batches look like this:

> Follow EXTRACT_COURSE.md. Read courses-manifest.json and migrate the next 5
> courses with status "pending". Mark each "done" only after it passes Step 6.
> Stop after 5.

## Batch tips

- At most 5 courses per session, then /clear and start the next batch.
- Do ONE course first, review it in the browser, and only then scale up.
- Spot-check about 1 in 10 courses against the old project.
