import { fileURLToPath } from 'node:url'
import { join } from 'pathe'
import { defu } from 'defu'
import { addImportsDir, addPlugin, defineNuxtModule } from '@nuxt/kit'
import { name, version } from '../package.json'

export interface ModuleOptions {
  /**
   * The Google Analytics 4 property ID to use for tracking
   *
   * @default undefined
   */
  id?: string

  /**
   * Additional configuration for the Google Analytics 4 property
   *
   * @remarks
   * Will be set when initializing `gtag` with the `config` command
   *
   * @default undefined
   */
  config?: Record<string, any>
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'gtag',
    compatibility: {
      nuxt: '^3',
    },
  },
  defaults: {
    id: undefined,
    config: undefined,
  },
  setup(options, nuxt) {
    // Add module options to public runtime config
    nuxt.options.runtimeConfig.public.gtag = defu(
      nuxt.options.runtimeConfig.public.gtag,
      options,
    )

    // Transpile runtime
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)

    addImportsDir(join(runtimeDir, 'composables'))

    addPlugin({
      src: join(runtimeDir, 'plugin.client'),
      mode: 'client',
    })
  },
})
