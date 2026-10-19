# Story trim guide (`story` block)

How to shorten a long case-file story without losing its substance, humour or arc. Use it when a lesson's story runs well past the length of its neighbours, or when the lesson repeats the same scenes as separate "CASE FILE" headings.

**First applied to:** Building a Canadian Household Budget (`content/money-01-lesson.json`, "Elena's Complete Budget Story": 342 words in 6 labelled beats, trimmed to 276 words in 6 unlabelled paragraphs).

**Target length:** other Money & Budgeting stories run about **230–280 words in 5–6 paragraphs**. Anything over about 300 words, or any story with more than 6 paragraphs, is a candidate.

---

## Steps

1. **Remove the duplicate case-file fragments first.** If the lesson spreads the same scenes over separate `heading` + `paragraph` blocks ("CASE FILE — CONFLICT…", "CASE FILE — VERDICT…") and then retells them in the story, delete the fragments. The story is the one complete telling. The lesson's teaching text stays.
2. **Drop the beat labels.** Paragraphs that start "Setup.", "Conflict:", "Pressure:" and so on become plain narrative. The arc stays in the order of the paragraphs. Neighbouring stories (money-02, money-03) have no labels.
3. **List what must survive**, then check it against the trimmed text:
   - **Every figure that carries the lesson.** Costs, the shortfall and each cut must still add up (here: $195 + $140 − $150 margin = $185 short, and $110 + $35 + $40 = $185).
   - **The setting detail** (city, job, the one thing the character does).
   - **The turning point** (the cheerful number meets the evidence).
   - **The temptation** (the easy wrong answer, such as putting it on a card).
   - **The resolution and the last-line payoff** (here, "It came out of the sinking fund.").
   - **Every joke.** Keep the funniest 4–5 lines word for word, for example "It has also not yet met November", "cross-examined", "nobody had to invent cheaper groceries", "disguised as a personal failing". Cut explanation around a joke, never the joke.
4. **Cut these first:**
   - Repeated setup ("Every year… every year…" can stay once, but not twice).
   - Phrases that restate what the previous sentence said.
   - Lead-ins such as "The real question is not whether… It is whether…" when the next sentence already shows it.
   - Adjectives and adverbs that carry no number or joke.
5. **Merge, don't chop.** Join a beat that is under 25 words into its neighbour. Keep sentences at their usual length so the reading level doesn't drop.
6. **Keep the closing beat** as its own short paragraph if the transition block after the story refers to it.

## What not to change

- `text` (story title), `detail` (case-file label), `image` and any `items` timeline: unchanged.
- The `transition` block after the story, which depends on the last line.
- Facts: do not round, drop or change a figure to make the text shorter.

## Checklist

- [ ] Word count is within about 230–280, with 5–6 paragraphs.
- [ ] No labels at the start of paragraphs.
- [ ] All the figures still add up.
- [ ] The setting, turning point, temptation, resolution and last line are all still there.
- [ ] The best jokes are still word for word.
- [ ] The fragment headings that duplicated the story are removed from the lesson.
- [ ] The JSON still parses, and the story looks right on localhost:3000.

For the story image see [`lesson-images-guide.md`](lesson-images-guide.md). For the full story-rebuild treatment on a plot arc, see the `course-treatment` skill in `.claude/skills/course-treatment/`.
