// Expose plugin types.
import type {} from 'nuxt/app'
import type { ModuleOptions } from '../module'
import { defineNuxtPlugin, useHead, useRuntimeConfig } from '#imports'
import { createScriptHead, initGtag, resolveTags } from './utils'

export default defineNuxtPlugin({
  parallel: true,
  setup() {
    const options = useRuntimeConfig().public.gtag as Required<ModuleOptions>
    const tags = resolveTags(options)
    const [firstTag] = tags

    if (!firstTag)
      return

    initGtag({ tags })

    if (options.initMode === 'manual')
      return

    useHead(createScriptHead(options, firstTag.id))
  },
})
