// One-off: restructure health Starter lessons 01-05 with distinct block designs.
// Learner-facing text is kept word for word; only labels/icons/block types change.
const fs = require('fs');
const load = (n) => JSON.parse(fs.readFileSync(`content/health-${n}-lesson.json`, 'utf8'));
const save = (n, j) => fs.writeFileSync(`content/health-${n}-lesson.json`, JSON.stringify(j, null, 2) + '\n');
const sec = (j, id) => j.sections.find((s) => s.id === id) || (() => { throw new Error('no section ' + id); })();
const idx = (s, pred) => { const i = s.blocks.findIndex(pred); if (i < 0) throw new Error('no block in ' + s.id); return i; };
const headingIdx = (s, t) => idx(s, (b) => b.type === 'heading' && b.text === t);
const withIcons = (items, icons) => items.map((it, k) => ({ ...it, icon: icons[k] }));

// Ordered items -> number carousel (detail NUMBER n, short ALL-CAPS titles kept, icons added)
function orderedToCarousel(s, orderedIdx, icons) {
  const b = s.blocks[orderedIdx];
  s.blocks[orderedIdx] = {
    type: 'carousel',
    items: b.items.map((it, k) => ({ title: it.title, text: it.text, detail: `NUMBER ${k + 1}`, icon: icons[k] })),
  };
}
function orderedToFilecards(s, orderedIdx, text) {
  const b = s.blocks[orderedIdx];
  s.blocks[orderedIdx] = { type: 'filecards', text, items: b.items };
}
function cardsToIcons(s, cardsIdx, icons) {
  s.blocks[cardsIdx].items = withIcons(s.blocks[cardsIdx].items, icons);
}
function headingCardsToGlass(s, headIdx, detail) {
  const h = s.blocks[headIdx];
  const c = s.blocks[headIdx + 1];
  if (c.type !== 'cards') throw new Error('expected cards after heading ' + h.text);
  s.blocks.splice(headIdx, 2, { type: 'glasspanel', text: h.text, detail, items: c.items });
}
function chipsToLists(s, chipIdx, groups) {
  const b = s.blocks[chipIdx];
  const flat = b.items.map((x) => x.title);
  s.blocks[chipIdx] = {
    type: 'lists',
    items: groups.map(([title, from, to]) => ({ title, text: '', list: flat.slice(from, to) })),
  };
}
// "Key takeaway" heading + paragraph -> takeaway block (first sentence = text, rest = detail)
function keyTakeaway(j) {
  for (const s of j.sections) {
    const h = s.blocks.findIndex((b) => b.type === 'heading' && b.text === 'Key takeaway');
    if (h < 0) continue;
    const p = s.blocks[h + 1];
    const m = p.text.match(/^(.+?[.!?])\s+(.*)$/s);
    s.blocks.splice(h, 2, { type: 'takeaway', text: m ? m[1] : p.text, detail: m ? m[2] : '' });
    return;
  }
}
// Cap spotlights at 5, never two in one section; surplus become plain paragraphs (same words).
function capSpotlights(j) {
  const all = () => j.sections.flatMap((s) => s.blocks.map((b, i) => ({ s, b, i })).filter((x) => x.b.type === 'spotlight'));
  const demote = (x) => { x.b.type = 'paragraph'; };
  for (const s of j.sections) {
    const sp = s.blocks.filter((b) => b.type === 'spotlight');
    sp.slice(1).forEach((b) => (b.type = 'paragraph'));
  }
  while (all().length > 5) {
    const list = all().filter((x) => x.s.id !== 'action' && x.s.id !== 'start');
    demote(list[list.length - 1 - (all().length % 2 ? 0 : 0)] === undefined ? list[0] : list[Math.floor(list.length / 2)]);
  }
}

// ---------- 01 Beginner Fitness for Men: icon tiles + file cards + takeaway ----------
{
  const j = load('01');
  cardsToIcons(sec(j, 'jobs'), idx(sec(j, 'jobs'), (b) => b.type === 'cards'), ['heart', 'zap', 'route', 'shield']);
  const c = sec(j, 'circuit');
  const o = idx(c, (b) => b.type === 'ordered');
  orderedToFilecards(c, o, 'Your six-move starter circuit');
  keyTakeaway(j); capSpotlights(j); save('01', j);
}
// ---------- 02 Beginner Fitness for Women: number carousel + icon tiles ----------
{
  const j = load('02');
  const c = sec(j, j.sections.find((s) => s.title.includes('Shape-Shifting')).id);
  orderedToCarousel(c, idx(c, (b) => b.type === 'ordered'), ['check', 'list', 'clock', 'calendar', 'filecheck', 'book']);
  const l = j.sections.find((s) => s.title.startsWith('Life Stages'));
  cardsToIcons(l, idx(l, (b) => b.type === 'cards'), ['heart', 'shield', 'lifebuoy']);
  keyTakeaway(j); capSpotlights(j); save('02', j);
}
// ---------- 03 Home Workouts: file cards + number carousel + glass panel ----------
{
  const j = load('03');
  const m = j.sections.find((s) => s.title === 'Build the Movement Menu');
  orderedToFilecards(m, idx(m, (b) => b.type === 'ordered'), 'Build the movement menu');
  const t = j.sections.find((s) => s.title === 'The Twelve-Minute Foundation');
  orderedToCarousel(t, idx(t, (b) => b.type === 'ordered'), ['check', 'list', 'clock', 'calendar', 'filecheck', 'book']);
  const s3 = j.sections.find((s) => s.title === 'Three Session Sizes');
  const ci = idx(s3, (b) => b.type === 'cards');
  s3.blocks[ci] = { type: 'glasspanel', text: 'Three session sizes', detail: 'SMALL, STANDARD, EXTENDED', items: s3.blocks[ci].items };
  keyTakeaway(j); capSpotlights(j); save('03', j);
}
// ---------- 04 Gym Fundamentals: number carousel + etiquette lists ----------
{
  const j = load('04');
  const r = j.sections.find((s) => s.title === 'Use a First-Session Route');
  orderedToCarousel(r, idx(r, (b) => b.type === 'ordered'), ['check', 'list', 'filecheck', 'clock', 'calendar']);
  const e = j.sections.find((s) => s.title === 'Learn the Traffic Pattern');
  const ci = idx(e, (b) => b.type === 'chips');
  chipsToLists(e, ci, [['CLEAN AND RETURN', 0, 2], ['SHARE THE SPACE', 2, 4], ['KEEP IT QUIET', 4, 6]]);
  keyTakeaway(j); capSpotlights(j); save('04', j);
}
// ---------- 05 Strength Training: file cards + icon tiles + lists ----------
{
  const j = load('05');
  const f = j.sections.find((s) => s.title === 'Cover the Body With Movement Families');
  orderedToFilecards(f, idx(f, (b) => b.type === 'ordered'), 'Cover the body with movement families');
  const d = j.sections.find((s) => s.title === 'Learn the Five Training Dials');
  const oi = idx(d, (b) => b.type === 'ordered');
  d.blocks[oi] = { type: 'cards', items: withIcons(d.blocks[oi].items, ['zap', 'activity', 'route', 'timer', 'lifebuoy']) };
  keyTakeaway(j); capSpotlights(j); save('05', j);
}
console.log('ok');
