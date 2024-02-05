export interface FoundedArticle {
  client: string
  id: string
}

export function useFindArticle(): Ref<FoundedArticle | undefined> {
  const foundArticle = ref<FoundedArticle | undefined>()

  const location = useBrowserLocation()

  watch(
    location,
    () => {
      const lastArticle = Array.from(document.querySelectorAll('[data-sp-article]')).at(-1)
      if (!lastArticle) {
        return
      }
      const article = parseArticle((lastArticle as HTMLElement).dataset['sp-article'])
      foundArticle.value = article
    },
    { immediate: true },
  )

  useMutationObserver(
    document.body,
    (records) => {
      const lastArticle = records.at(-1)
      if (!lastArticle) {
        return
      }
      const article = parseArticle((lastArticle.target as HTMLElement).dataset['sp-article'])
      foundArticle.value = article
    },
    {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-sp-article'],
    },
  )

  return foundArticle
}

function parseArticle(mark: string | undefined): FoundedArticle | undefined {
  if (!mark) {
    return undefined
  }

  const [client, id] = mark.split('.')
  if (!client || !id) {
    return undefined
  }

  return {
    client,
    id,
  }
}
