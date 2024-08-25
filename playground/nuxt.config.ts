import { defineNuxtConfig } from 'nuxt/config'
import NuxtGtag from '../src/module'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  // @ts-expect-error: Type mismatch
  modules: [NuxtGtag],

  gtag: {
    initMode: 'manual',
    id: 'G-ZZZZZZZZZZ',
    initCommands: [
      // Setup up consent mode
      ['consent', 'default', {
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        ad_storage: 'denied',
        analytics_storage: 'denied',
        wait_for_update: 500,
      }],
    ],
  },
})
