import { gtag } from './gtag'
import { defineNuxtPlugin, useHead, useRoute, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
  const {
    gtag: { id, config, initialConsent, loadingStrategy },
  } = useRuntimeConfig().public

  if (!id)
    return

  // @ts-expect-error: `dataLayer` is not defined
  window.dataLayer = window.dataLayer || []

  gtag('js', new Date())
  gtag('config', id, config)

  if (!initialConsent)
    return

  // Sanitize loading strategy to be either `async` or `defer`
  const strategy = loadingStrategy === 'async' ? 'async' : 'defer'

  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${id}`,
        [strategy]: true,
      },
    ],
  })

  // Send initial `page_view` event
  gtag('event', 'page_view', {
    page_location: window.location.href,
    page_path: useRoute().path,
    page_title: document.title,
  })
})
