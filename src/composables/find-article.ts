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
    const article = parseArticle((el as HTMLElement).dataset.spArticle)
    if (article && articleContainer) {
      foundArticle.value = {
        element: articleContainer,
        ...article,
      }
    }
  }

  function searchArticle() {
    const lastArticle = Array.from(document.querySelectorAll('[data-sp-article]')).at(-1)
    if (!lastArticle) {
      return
    }
    trySaveArticle(lastArticle)
  }

  watch(
    location,
    () => {
      searchArticle()
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

  onMounted(async () => {
    await nextTick()
    searchArticle()
  })

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
