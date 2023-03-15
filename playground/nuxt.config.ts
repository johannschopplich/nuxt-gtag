export default defineNuxtConfig({
  modules: ['../src/module.ts'],

  typescript: {
    typeCheck: true,
    shim: false,
  },
})
