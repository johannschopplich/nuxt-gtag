import { defineNuxtConfig } from 'nuxt/config'
import NuxtGtag from '../src/module'

export default defineNuxtConfig({
  modules: [NuxtGtag],

  compatibilityDate: '2025-01-01',

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
