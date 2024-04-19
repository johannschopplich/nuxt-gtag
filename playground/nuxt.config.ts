export default defineNuxtConfig({
  modules: ['../src/module.ts'],

  gtag: {
    enabled: true,
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
