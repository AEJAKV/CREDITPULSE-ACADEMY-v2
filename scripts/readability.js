#!/usr/bin/env node
/*
 * Readability + voice checker for v2 lesson JSON (content/<lesson>-lesson.json).
 *
 * Same scoring and tells as the course-delivery script, but reads the lesson file
 * directly instead of a rendered page.
 *
 * House targets: teaching prose ~ grade 8, story ~ grade 4-6.
 *
 * Usage
 *   node scripts/readability.js credit-11 [--breakdown] [--tells]
 */

const fs = require('fs');
const path = require('path');

function countSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const trimmed = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const groups = trimmed.match(/[aeiouy]{1,2}/g);
  return groups ? groups.length : 1;
}

function score(text) {
  const clean = text.replace(/[—–]/g, ' ').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
  const sentences = clean.split(/[.!?]+(?=\s|$)/).filter((s) => s.trim().length > 1);
  const words = clean.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w));
  if (!words.length) return { grade: 0, words: 0, sentences: 0, wps: 0, spw: 0 };
  const syllables = words.reduce((t, w) => t + countSyllables(w), 0);
  const wps = words.length / (sentences.length || 1);
  const spw = syllables / words.length;
  return {
    grade: +(0.39 * wps + 11.8 * spw - 15.59).toFixed(2),
    words: words.length,
    sentences: sentences.length,
    wps: +wps.toFixed(1),
    spw: +spw.toFixed(2),
  };
}

const punct = (t) => (/[.!?”"]$/.test(t.trim()) ? t.trim() : `${t.trim()}.`);

function extract(lesson) {
  const teaching = [];
  const story = [];
  for (const section of lesson.sections) {
    for (const b of section.blocks || []) {
      if (b.type === 'story') {
        (b.paragraphs || []).forEach((p) => story.push(punct(p)));
        continue;
      }
      const push = (t) => t && t.trim().split(/\s+/).length >= 4 && teaching.push(punct(t));
      if (['paragraph', 'spotlight', 'transition', 'takeaway', 'quote'].includes(b.type)) {
        push(b.text);
        if (b.type === 'transition' || b.type === 'takeaway') push(b.detail);
        if (b.type === 'transition') push(b.extra);
      }
      for (const it of b.items || []) {
        push(it.text);
        if (b.type === 'accordions') push(it.detail);
      }
    }
  }
  return { teaching, story };
}

const TELLS = [
  { name: 'Filler adverbs', re: /\b(actually|simply|genuinely|truly|really|perfectly|very|quite|essentially|effectively|incredibly)\b/gi },
  { name: 'Formula analogy', re: /less like [^.]{1,50} and more like/gi },
  { name: 'Mirrored antithesis', re: /\b(?:is|are) not\b[^.]{0,70}\b(?:it|that|they) (?:is|are)\b/gi },
  { name: 'Sentence-start "So"', re: /(?:^|[.!?”]\s)So\s/g },
  { name: 'Em dashes', re: /—/g },
  { name: 'Not X, but Y', re: /\bnot (?:a|an|the|just|only)\b[^.;]{0,60}[;,] (?:it|but)\b/gi },
];

const [slug, ...flags] = process.argv.slice(2);
if (!slug) {
  console.error('Usage: node scripts/readability.js <credit-NN> [--breakdown] [--tells]');
  process.exit(1);
}
const file = path.join(__dirname, '..', 'content', `${slug}-lesson.json`);
const lesson = JSON.parse(fs.readFileSync(file, 'utf8'));
const { teaching, story } = extract(lesson);
const t = score(teaching.join(' '));
const s = score(story.join(' '));
console.log(`${lesson.title}`);
console.log(`  teaching: grade ${t.grade}  (${t.words} words, ${t.wps} words/sentence, ${t.spw} syll/word)`);
console.log(`  story:    grade ${s.grade}  (${s.words} words, ${s.wps} words/sentence, ${s.spw} syll/word)`);

if (flags.includes('--breakdown')) {
  console.log('\nHardest teaching blocks:');
  teaching
    .map((x) => ({ x, g: score(x).grade }))
    .filter((r) => r.x.split(/\s+/).length >= 12)
    .sort((a, b) => b.g - a.g)
    .slice(0, 12)
    .forEach((r) => console.log(`  ${String(r.g).padStart(5)}  ${r.x.slice(0, 130)}`));
}
if (flags.includes('--tells')) {
  console.log('\nVoice tells:');
  const all = [...teaching, ...story];
  for (const tell of TELLS) {
    const hits = all.filter((b) => b.match(tell.re));
    const count = all.join('\n').match(tell.re)?.length || 0;
    console.log(`  ${tell.name}: ${count}`);
    hits.slice(0, 3).forEach((h) => console.log(`      ${h.slice(0, 120)}`));
  }
}
