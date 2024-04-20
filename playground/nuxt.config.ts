export default defineNuxtConfig({
  modules: ['nuxt-gtag'],

  gtag: {
    enabled: false,
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
