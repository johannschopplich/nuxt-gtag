import { defu } from 'defu'
import { addImports, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import { name, version } from '../package.json'
import type { GoogleTagOptions } from './runtime/types'

export interface ModuleOptions {
  /**
   * The Google tag ID to initialize.
   *
   * @default undefined
   */
  id?: string

  /**
   * The Google tags to initialize.
   *
   * @remarks
   * Each item can be a string or an object with `id` and `config` properties. The latter is useful especially when you want to set additional configuration for the Google tag ID.
   *
   * @default undefined
   */
  tags?: string[] | GoogleTagOptions[]

  /**
   * Additional configuration for the Google tag ID to be set when initializing the tag ID with the `config` command.
   *
   * @remarks
   * Does only apply when `id` is set or the `ids` array contains strings.
   *
   * @default undefined
   */
  config?: Record<string, any>

  /**
   * Whether to initialize the Google tag script immediately after the page has loaded.
   *
   * @remarks
   * Set this to `false` to delay the initialization until you call the `grantConsent` function manually.
   *
   * @default true
   */
  initialConsent?: boolean

  /**
   * Whether to load the Google tag ID script asynchronously or defer its loading.
   *
   * @remarks
   * If set to `async`, the script will be loaded asynchronously.
   * If set to `defer`, the script will be loaded with the `defer` attribute.
   *
   * @default 'defer'
   */
  loadingStrategy?: 'async' | 'defer'

  /**
   * The URL to load the Google tag script from.
   *
   * @remarks
   * Useful if you want to proxy the script through your own server.
   *
   * @default 'https://www.googletagmanager.com/gtag/js'
   */
  url?: string
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
    id: '',
    config: {},
    tags: [],
    initialConsent: true,
    loadingStrategy: 'defer',
    url: 'https://www.googletagmanager.com/gtag/js',
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Add module options to public runtime config
    nuxt.options.runtimeConfig.public.gtag = defu(
      nuxt.options.runtimeConfig.public.gtag as Required<ModuleOptions>,
      options,
    )

    // Transpile runtime
    nuxt.options.build.transpile.push(resolve('runtime'))

    addImports([
      'useGtag',
      'useTrackEvent',
    ].map(name => ({
      name,
      as: name,
      from: resolve(`runtime/composables/${name}`),
    })))

    addPlugin({
      src: resolve('runtime/plugin.client'),
      mode: 'client',
    })
  },
})
