export default defineNuxtConfig({
  modules: ['../src/module.ts'],

  gtag: {
    initialConsent: false,
  },

  experimental: {
    typescriptBundlerResolution: true,
  },

  typescript: {
    shim: false,
  },
})
