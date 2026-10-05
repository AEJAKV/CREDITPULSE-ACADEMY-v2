import type { LessonContent, ReadingBlock } from './types';
const blockTypes: ReadingBlock['type'][] = [
  'paragraph',
  'heading',
  'quote',
  'source',
  'score',
  'utilization',
  'spotlight',
  'transition',
  'artwork',
  'cards',
  'myths',
  'ordered',
  'chips',
  'accordions',
  'story',
  'takeaway',
  'glossary',
  'checkin',
];
export function validateRichContent(content: LessonContent) {
  if (
    content.subtitle !== undefined &&
    (typeof content.subtitle !== 'string' || content.subtitle.length > 1000)
  )
    return false;
  if (
    content.checkIn &&
    (!Array.isArray(content.checkIn.questions) ||
      content.checkIn.questions.length < 1 ||
      content.checkIn.questions.length > 10 ||
      !content.checkIn.questions.every(
        (q) => typeof q === 'string' && q.trim().length > 0 && q.length <= 1000,
      ) ||
      (content.checkIn.samples !== undefined &&
        (!Array.isArray(content.checkIn.samples) ||
          content.checkIn.samples.length > content.checkIn.questions.length ||
          !content.checkIn.samples.every((s) => typeof s === 'string' && s.length <= 500))) ||
      typeof content.checkIn.rewardLabel !== 'string' ||
      typeof content.checkIn.acknowledgment !== 'string')
  )
    return false;
  for (const section of content.sections) {
    if (!section.blocks) continue;
    if (!Array.isArray(section.blocks) || section.blocks.length > 100) return false;
    for (const block of section.blocks) {
      if (!block || !blockTypes.includes(block.type)) return false;
      if (
        ['text', 'detail', 'extra', 'url'].some(
          (key) =>
            block[key as keyof ReadingBlock] !== undefined &&
            (typeof block[key as keyof ReadingBlock] !== 'string' ||
              String(block[key as keyof ReadingBlock]).length > 20000),
        )
      )
        return false;
      if (block.type === 'source' && (!block.url || !/^https:\/\//.test(block.url))) return false;
      if (
        block.paragraphs &&
        (!Array.isArray(block.paragraphs) ||
          block.paragraphs.length > 100 ||
          !block.paragraphs.every((p) => typeof p === 'string'))
      )
        return false;
      if (
        block.items &&
        (!Array.isArray(block.items) ||
          block.items.length > 100 ||
          !block.items.every(
            (item) =>
              item &&
              typeof item.title === 'string' &&
              typeof item.text === 'string' &&
              (item.detail === undefined || typeof item.detail === 'string') &&
              (item.image === undefined ||
                (typeof item.image === 'string' &&
                  /^\/images\/[\w\-./]+\.(webp|avif|jpe?g|png)$/.test(item.image) &&
                  !item.image.includes('..'))),
          ))
      )
        return false;
      if (block.type === 'artwork' && !block.items?.length) return false;
    }
  }
  return true;
}
