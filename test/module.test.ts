import { fileURLToPath } from 'node:url'
import { loadNuxt } from '@nuxt/kit'
import { describe, expect, it } from 'vitest'

describe('module', () => {
  it('writes the public runtime config with enabled false', async () => {
    const nuxt = await loadNuxt({
      cwd: fileURLToPath(new URL('../playground', import.meta.url)),
      overrides: {
        gtag: { enabled: false },
      },
    })

    try {
      expect(nuxt.options.runtimeConfig.public.gtag).toMatchObject({
        enabled: false,
        initMode: 'manual',
      })
    }
    finally {
      await nuxt.close()
    }
  })
})
