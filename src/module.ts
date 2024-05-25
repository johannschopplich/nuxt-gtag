import { defu } from 'defu'
import { addImports, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import { name, version } from '../package.json'
import type { GoogleTagOptions } from './runtime/types'

export interface ModuleOptions {
  /**
   * Whether to enable the module.
   *
   * @remarks
   * Allows for enabling the module conditionally.
   *
   * @default true
   */
  enabled?: boolean

  /**
   * Whether to initialize the Google tag script immediately after the page has loaded.
   *
   * @remarks
   * Set this to `manual` to delay the initialization until you call the `initialize` function manually.
   *
   * @default true
   */
  initMode?: 'auto' | 'manual'

  /**
   * The Google tag ID to initialize.
   *
   * @default undefined
   */
  id?: string

  /**
   * Additional commands to be executed before the Google tag ID is initialized.
   *
   * @remarks
   * Useful to set the default consent state. Only applies when `id` is set. For multiple tags, use the `tags` option instead.
   *
   * @example
   * ```ts
   * commands: [
   *   ['consent', 'default', {
   *     ad_storage: 'denied',
   *     ad_user_data: 'denied',
   *     ad_personalization: 'denied',
   *     analytics_storage: 'denied'
   *   }]
   * ]
   * ```
   *
   * @default []
   */
  initCommands: GoogleTagOptions['initCommands']

  /**
   * Additional configuration for the Google tag ID, to be set during initialization of the tag ID with the `config' command.
   *
   * @remarks
   * Only applies when `id` is set. For multiple tags, use the `tags` option instead.
   *
   * @default {}
   */
  config?: GoogleTagOptions['config']

  /**
   * The Google tags to initialize.
   *
   * @remarks
   * Each item can be a string or an object with `id` and `config` properties. The latter is useful especially when you want to set additional configuration for the Google tag ID.
   *
   * @default []
   */
  tags?: string[] | GoogleTagOptions[]

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
      nuxt: '^3.7',
    },
  },
  defaults: {
    enabled: true,
    id: '',
    initCommands: [],
    config: {},
    tags: [],
    loadingStrategy: 'defer',
    url: 'https://www.googletagmanager.com/gtag/js',
  },
  setup(options, nuxt) {
    if (!options.enabled) {
      return
    }

    const { resolve } = createResolver(import.meta.url)

    // Add module options to public runtime config
    nuxt.options.runtimeConfig.public.gtag = defu(
      nuxt.options.runtimeConfig.public.gtag,
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
