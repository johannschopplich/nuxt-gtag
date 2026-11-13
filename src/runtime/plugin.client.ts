// Expose plugin types.
import type {} from 'nuxt/app'
import type { ModuleOptions } from '../module'
import { defineNuxtPlugin, useHead, useRuntimeConfig } from '#imports'
import { createScriptHead, initGtag, resolveTags } from './utils'

export default defineNuxtPlugin({
  parallel: true,
  setup() {
    const options = useRuntimeConfig().public.gtag as Required<ModuleOptions>
    // A third-party snippet such as Google Tag Manager may read `window.dataLayer`
    // before the visitor consents, so manual mode leaves every command to `initialize`.
    if (options.initMode === 'manual')
      return

    const tags = resolveTags(options)
    const [firstTag] = tags

    if (!firstTag)
      return

    initGtag({ tags })
    useHead(createScriptHead(options, firstTag.id))
  },
})
