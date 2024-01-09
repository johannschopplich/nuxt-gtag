export default defineNuxtConfig({
  modules: ['../src/module.ts'],

  gtag: {
    initialConsent: false,
  },

  future: {
    typescriptBundlerResolution: true,
  },

  typescript: {
    shim: false,
  },
})
