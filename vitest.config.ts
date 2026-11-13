import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Run the runtime code as Nuxt builds it for the client.
  define: {
    'import.meta.client': true,
    'import.meta.server': false,
  },
})
