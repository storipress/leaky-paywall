import slugify from '@sindresorhus/slugify'
import { LoremIpsum } from 'lorem-ipsum'
import { html } from 'proper-tags'

export const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 8,
  },
})

export function getFakeArticle(mark: string) {
  return {
    title: lorem.generateSentences(1),
    headline: 'https://picsum.photos/800/600',
    excerpt: lorem.generateSentences(2),
    content: lorem
      .generateParagraphs(20)
      .split('\n')
      .map((line) => processParagraph(line))
      .map((line, index) => html`<p ${index === 0 ? `data-sp-article="${mark}"` : ''}>${line}</p>`)
      .join(''),
  }
}

function processParagraph(line: string) {
  const words = line.split(' ')
  return words.map((word) => (Math.random() < 0.1 ? wrapAsLink(word) : word)).join(' ')
}

function wrapAsLink(word: string) {
  return html`<a href="https://example.com/${slugify(word)}">${word}</a>`
}
