export default defineNuxtConfig({
  modules: ['../src/module.ts'],

  gtag: {
    initialConsent: false,
  },

  typescript: {
    typeCheck: true,
    shim: false,
  },
})
