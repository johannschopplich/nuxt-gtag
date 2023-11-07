import { initGtag } from './gtag'
import { defineNuxtPlugin, useHead, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
  const {
    gtag: { id: _id, config, initialConsent, loadingStrategy },
  } = useRuntimeConfig().public
    
  const id = [].concat(_id)

  if (!id.length)
    return

  initGtag({ id, config })

  if (!initialConsent)
    return

  // Sanitize loading strategy to be either `async` or `defer`
  const strategy = loadingStrategy === 'async' ? 'async' : 'defer'

  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${id[0]}`,
        [strategy]: true,
      },
    ],
  })
})
