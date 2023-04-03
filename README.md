![Nuxt Gtag module](./.github/og.png)

# Nuxt Gtag

[![npm version](https://img.shields.io/npm/v/nuxt-gtag?color=a1b858&label=)](https://www.npmjs.com/package/nuxt-gtag)

> [Nuxt 3](https://nuxt.com) module to integrate [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4?hl=en).

## Features

- 🌻 No dependencies except Google's `gtag.js`
- 🦾 SSR-ready
- 📯 Track events manually with [composables](#composables)
- 📂 [`.env` file support](#configuration)

## Setup

```bash
# pnpm
pnpm add -D nuxt-gtag

# npm
npm i -D nuxt-gtag
```

## Basic Usage

Add `nuxt-gtag` to the `modules` section of your Nuxt configuration and provide your Google Analytics measurement ID.

```ts
// `nuxt.config.ts`
export default defineNuxtConfig({
  modules: ['nuxt-gtag'],

  gtag: {
    id: 'G-XXXXXXXXXX'
  }
})
```

Done! Google Analytics will now run in your application's client.

> ℹ️ Make sure the `Page changes based on browser history events` checkbox is enabled. This will allow GA4 to automatically track page views. You can find this option in the `Admin` > `Property` > `Data Streams` > `Web` > `General Settings` > `User-Defined` > `Page changes based on browser history events` section.

## Configuration

All [supported module options](#module-options) can be configured using the `gtag` key in your Nuxt configuration:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-gtag'],

  gtag: {
    id: 'G-XXXXXXXXXX',
    config: {
      page_title: 'My Custom Page Title'
    }
  },
})
```

### Runtime Config

Alternatively, leveraging [automatically replaced public runtime config values](https://nuxt.com/docs/api/configuration/nuxt-config#runtimeconfig) by matching environment variables at runtime, set your desired option in your project's `.env` file:

```bash
# Sets the `gtag.id` module option
NUXT_PUBLIC_GTAG_ID=G-XXXXXXXXXX
```

With this setup, you can omit the `gtag` key in your Nuxt configuration if you only want to set the measurement ID.

## Module Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `undefined` | The Google Analytics measurement ID. |
| `config` | `Record<string, any>` | `{}` | The [configuration parameters](https://developers.google.com/analytics/devguides/collection/ga4/reference/config) to be passed to `gtag.js` on initialization. |
| `loadingStrategy` | `'async' \| 'defer'` | `'defer'` | The loading strategy to be used for the `gtag.js` script. |

## Composables

As with other composables in the Nuxt 3 ecosystem, they are auto-imported and can be used in your application's components.

### `useGtag`

The `useGtag` composable is SSR-safe and can be used to call any of the [gtag.js methods](https://developers.google.com/tag-platform/gtagjs/reference).

```ts
// SSR-ready
const gtag = useGtag()
gtag(
  // <command>,
  // <command-parameters>
)
```

> ℹ️ Since the Gtag instance is available in the client only, any `gtag()` (assuming the variable from above) calls executed on the server will have no effect.

**Type Declarations**

```ts
function useGtag(): {
  (command: 'config', targetId: string, config?: Record<string, any>): void
  (command: 'event', eventName: string & {}, eventParams?: Record<string, any>): void
  (command: 'set', targetId: string, config: string | boolean | Record<string, any>): void
  (command: 'set', config: Record<string, any>): void
  (command: 'get', targetId: string, fieldName: string, callback?: (field?: string | Record<string, any>) => void): void
  (command: 'consent', consentArg: string, consentParams: Record<string, any>): void
  (command: 'js', config: Date): void
}
```

**Example**

The following event command fires the event `screen_view` with two parameters: `app_name` and `screen_name`.

```ts
// SSR-ready
const gtag = useGtag()
gtag('event', 'screen_view', {
  app_name: 'My App',
  screen_name: 'Home'
})
```

### `useTrackEvent`

> ℹ️ Since the Gtag instance is available in the client only, executing the composable on the server will have no effect.

Track your defined goals by passing the following parameters:

- The name of the recommended or custom event
- A collection of parameters that provide additional information about the event (optional)

**Type Declarations**

```ts
function useTrackEvent(
  eventName: (string & {}),
  eventParams?: Record<string, any>
): void
```

**Example**

For example, the following is an event called `login` with a parameter `method`:

```ts
// Tracks the `login` event
useTrackEvent('login', {
  method: 'Google'
})
```

## 💻 Development

1. Clone this repository
2. Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
3. Install dependencies using `pnpm install`
4. Run `pnpm run dev:prepare`
5. Start development server using `pnpm run dev`

## Credits

- [SVGBackgrounds.com](https://www.svgbackgrounds.com) for the OpenGraph image background pattern.

## License

[MIT](./LICENSE) License © 2023-present [Johann Schopplich](https://github.com/johannschopplich)
