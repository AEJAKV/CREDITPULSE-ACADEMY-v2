# Fill-out form guide (`checkIn`)

The "Your Action (Fill Out Form)" section of each lesson holds a `checkIn` block: a short set of questions the learner answers to complete the course. This guide keeps the form **short, plain and easy to start**, with a sample answer inside every field.

**Reference:** Credit Mastery lesson 1 (`content/credit-score-lesson.json`) set the pattern. First applied to Money & Budgeting in `content/money-01-lesson.json` (8 long questions cut to 6) and `content/money-02-lesson.json` (8 cut to 6).

The form code already supports samples (`checkIn.samples`). Applying this guide is a **JSON-only change**.

---

## JSON

```json
"checkIn": {
  "questions": [
    "What take-home pay reaches your household in a typical month? If it changes, use the lower amount."
  ],
  "samples": [
    "About $3,800. My pay changes a little, so I will plan with $3,600."
  ],
  "rewardLabel": "Complete this activity and get $5 plus 20 Credit Pulse points",
  "acknowledgment": "I reviewed my answers and understand that this is educational information, not financial advice."
}
```

`samples[i]` shows as grey placeholder text in field `i`, prefixed with "Example:". It disappears when the learner starts typing. Keep `rewardLabel` and `acknowledgment` exactly as the course already has them.

## Writing the questions

1. **5–6 questions.** Each one asks for one thing. Split any question that asks for two (a figure and a date can stay together; a list and a decision cannot).
2. **Plain words, grade 8.** Drop the all-caps topic labels ("LAYER 1 —", "VERDICT —"). Start with a normal question word: What, How much, When, Is.
3. **Keep the lesson's steps.** Cover the same ideas in the same order. Merge related steps rather than dropping one, and end with one decision plus a date to check or review it.
4. **Ask for one item, not three.** "Name three costs" becomes "Pick one cost."
5. **Give a way out for uncertainty.** If a figure varies, say what to use ("use the lower amount").
6. **No personal identifiers.** The privacy line above the form stays. Never ask for account, card or ID numbers.

## Writing the samples

- **One short example answer per question**, in the voice of the learner ("I will…", "About $…"), at most about 120 characters. The validator allows 500.
- **Realistic, round numbers** that add up. If the sample shows working, show it ("$1,200 ÷ 12 = $100 a month").
- **Don't reuse the story character's figures** (Elena, Talia), so learners don't copy them.
- **Don't start with "Example"**, because the form adds that word.
- For true/false questions, use a format hint like Credit Mastery's: "Write True or False, then one sentence on why."
- Samples are the same length or shorter than the questions list. A missing sample is allowed.

## Checklist

- [ ] 5–6 questions, each asking for one thing, with no all-caps labels.
- [ ] Every question has a sample answer, and none starts with "Example".
- [ ] The lesson's key ideas are all still covered, ending with a decision and a date.
- [ ] `rewardLabel` and `acknowledgment` unchanged.
- [ ] JSON parses, and the fields show their examples on localhost:3000.
