export default defineNuxtConfig({
  modules: ['../src/module.ts'],

  gtag: {
    tags: ['G-ZZZZZZZZZZ'],
    initialConsent: false,
  },

  typescript: {
    shim: false,
  },
})
