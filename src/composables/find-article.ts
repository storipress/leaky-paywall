export interface FoundedArticle {
  element: Element
  client: string
  id: string
}

export function useFindArticle(): Ref<FoundedArticle | undefined> {
  const foundArticle = ref<FoundedArticle | undefined>()

  const location = useBrowserLocation()

  function trySaveArticle(el?: Element) {
    if (!el) {
      return
    }
    const articleContainer = el.parentElement
    const article = parseArticle((el as HTMLElement).dataset['sp-article'])
    if (article && articleContainer) {
      foundArticle.value = {
        element: articleContainer,
        ...article,
      }
    }
  }

  watch(
    location,
    () => {
      const lastArticle = Array.from(document.querySelectorAll('[data-sp-article]')).at(-1)
      if (!lastArticle) {
        return
      }
      trySaveArticle(lastArticle)
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
      trySaveArticle(lastArticle.target as Element)
    },
    {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-sp-article'],
    },
  )

  return foundArticle
}

function parseArticle(mark: string | undefined): Pick<FoundedArticle, 'client' | 'id'> | undefined {
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
