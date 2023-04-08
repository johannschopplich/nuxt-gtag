import { gtag, loadGtagScript } from './utils'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
  const { gtag: gtagOpts } = useRuntimeConfig().public

  if (!gtagOpts.id)
    return

  // @ts-expect-error: `dataLayer` is not defined
  window.dataLayer = window.dataLayer || []

  gtag('js', new Date())
  gtag('config', gtagOpts.id, gtagOpts.config)

  if (gtagOpts.initialConsent)
    loadGtagScript()
})
