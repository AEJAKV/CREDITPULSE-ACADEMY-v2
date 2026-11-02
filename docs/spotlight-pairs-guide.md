# Spotlight pairs guide (`spotlight` blocks back to back)

A `spotlight` is the lime "Credit Pulse Spotlight" callout. When two sit **directly one after the other**, they read as one long green slab and the second one loses its punch. This guide says how to fix a pair: **pick the best one**, or **reposition one** so the callouts are separated by other content.

**First applied to:** Canada Child Benefit (`content/benefits-01-lesson.json`, picked one), GST/HST Credit (`content/benefits-02-lesson.json`, one picked and one repositioned) and Canada Workers Benefit (`content/benefits-03-lesson.json`, repositioned).

This is a **JSON-only change**: delete one block, or move one block. No spotlight text is ever reworded.

---

## The rule

**No two `spotlight` blocks may sit next to each other.** At least one other block (`paragraph`, `cards`, `myths`, `ordered`, `heading`…) must come between them.

## Find the pairs

Run this from the project root. It lists every adjacent pair, by lesson and section:

```bash
node -e "
const fs=require('fs');
for(const f of fs.readdirSync('content').filter(f=>/-lesson\.json$/.test(f))){
  const j=JSON.parse(fs.readFileSync('content/'+f));
  for(const s of j.sections){const b=s.blocks||[];
    for(let i=1;i<b.length;i++)
      if(b[i].type==='spotlight'&&b[i-1].type==='spotlight')
        console.log(f,s.id,'->',b[i-1].text.slice(0,40)+' | '+b[i].text.slice(0,40));}}"
```

When this guide was written, 59 pairs were found across 42 lessons. Fix a pair while you are already treating its course. Don't hunt them all in one sweep.

---

## Decide: pick one, or reposition?

Read both spotlights, then ask these in order.

1. **Does one of them repeat something the lesson already says elsewhere** (the intro paragraph, a transition, a numbered step, the quick-check, the story)? If so, **pick the other one and delete the repeat**. Nothing is lost, because the idea survives elsewhere.
2. **Does one of them carry facts that appear nowhere else** (dollar figures, thresholds, dates, form numbers)? If so, **that one stays**. Never delete the only place a figure appears.
3. **Do both carry unique facts?** Then you can't delete either. **Reposition** one (see below).
4. **Is one a joke or a flourish with no teaching content?** Pick the one that teaches.

| Situation | Action | Example |
| --- | --- | --- |
| One repeats the lesson's main message | Pick the other, delete the repeat | benefits-02, "Track the Benefit": the "file a return" spotlight repeats the intro, the transition and step 1, so the spotlight with the $679 / $890 / $234 maximums stayed. |
| One has the only figures, the other states a rule | Keep the figures, delete the rule if it is restated elsewhere | benefits-01, "How the CRA Calculates": the thresholds spotlight stayed because the myth and quick-check depend on it. |
| Both carry unique facts | Reposition, keep both | benefits-02 "File, Map and Update"; benefits-03 "Do Not Ask One Number to Do Four Jobs". |

If you are unsure which to delete, **ask the user** and give your pick with a one-line reason. Deleting is the only step here that removes content.

## How to reposition

Move **one** spotlight (usually the second) so another block sits between them. Choose its new place by what it is about:

- **Right after the block it supports.** A spotlight about a step goes after the steps. A spotlight about a figure goes after the paragraph that introduces the figure.
- **After the `myths` block** when it relates to the myth's topic. This is the most common fix, because the section then ends: content → spotlight → myth → spotlight.
- **Before the `source` or `transition` block**, never after it. Those two close a section.
- **Never** move a spotlight across sections, into the story, or after the `checkin`. The one after the form is a closing note, and it stays.

Keep the order of everything else unchanged. After moving, the sequence in the section should alternate, for example:

```
cards → spotlight (thresholds) → myths → spotlight (disability supplement)
ordered → spotlight (missing payment) → myths → spotlight (couple payment)
```

## What not to do

- **Don't merge two spotlights into one.** That rewords text and makes a slab of green.
- **Don't reword a spotlight to make it shorter or to fit.**
- **Don't delete a spotlight that holds the only copy of a figure**, a date or a form number.
- **Don't turn a spotlight into a plain `paragraph`** to avoid the pair. The callout is the design.
- **Don't move a spotlight that the artwork carousel depends on.** The carousel goes after the *first* spotlight in `start` (see `lesson-images-guide.md`).

---

## Checklist

- [ ] No two `spotlight` blocks are adjacent (run the finder above for the lesson).
- [ ] Every figure, date and form number that was in the lesson is still in the lesson.
- [ ] Spotlight text is word for word.
- [ ] If one was deleted, the idea it carried is still stated elsewhere (say where, in your note to the user).
- [ ] The first spotlight in `start` is still before the `myths` block, so the carousel placement rule still works.
- [ ] The JSON parses, and the section reads in a sensible order on localhost:3000.
