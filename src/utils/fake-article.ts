import { LoremIpsum } from 'lorem-ipsum'

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 8,
  },
})

export function getFakeArticle() {
  return {
    title: lorem.generateSentences(1),
    headline: 'https://picsum.photos/800/600',
    excerpt: lorem.generateSentences(2),
    content: lorem
      .generateParagraphs(20)
      .split('\n')
      .map((x) => `<p>${x}</p>`)
      .join(''),
  }
}
