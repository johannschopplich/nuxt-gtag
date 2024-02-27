export default defineNuxtConfig({
  modules: ['../src/module.ts'],

  gtag: {
    enabled: false,
    tags: ['G-ZZZZZZZZZZ'],
  },

  typescript: {
    shim: false,
  },
})
