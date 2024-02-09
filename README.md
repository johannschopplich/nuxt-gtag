![Nuxt Google Tag module](./.github/social-card.jpg)

# Nuxt Google Tag

[![npm version](https://img.shields.io/npm/v/nuxt-gtag?color=a1b858&label=)](https://www.npmjs.com/package/nuxt-gtag)

[Google Tag](https://developers.google.com/tag-platform/gtagjs?hl=en) integration for [Nuxt](https://nuxt.com) with support for [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4?hl=en), Google Ads and more.

## Features

- 🌻 No dependencies except Google's `gtag.js`
- 🛍️ For Google Analytics 4, Google Ads and other products
- 🤝 Manual [consent management](#consent-management) for GDPR compliance
- 🔢 Supports [multiple tag IDs](#multiple-google-tags)
- 📯 Track events manually with [composables](#composables)
- 🏷️ Fully typed `gtag.js` API
- 🦾 SSR-ready
- 📂 [`.env` file support](#configuration)

## Setup

```bash
# pnpm
pnpm add -D nuxt-gtag

# npm
npm i -D nuxt-gtag

# yarn
yarn add -D nuxt-gtag
```

## Basic Usage

Add `nuxt-gtag` to the `modules` section of your Nuxt configuration and provide your Google tag ID (for multiple tag IDs, see below).

```ts
// `nuxt.config.ts`
export default defineNuxtConfig({
  modules: ['nuxt-gtag'],

  gtag: {
    id: 'G-XXXXXXXXXX'
  }
})
```

Done! The `gtag.js` script will be loaded and initialized client-side with your Google tag ID when the Nuxt application starts.

> [!NOTE]
> Ensure that the **Enhanced measurement** feature is enabled to allow `gtag.js` to automatically track page changes based on browser history events in Nuxt.
>
> To enable this feature:
>
> 1. Go to the GA4 reporting view and click on “Admin”
> 2. Select “Data Streams” under the “Property” column.
> 3. Click on your web data stream.
> 4. Next, toggle the switch button near “Enhanced measurement”.

### Multiple Google Tags

If you want to send data to multiple destinations, you can add more than one Google tag ID to your Nuxt configuration in the `tags` module option.

The following example shows how to load a second Google tag that is connected to a Floodlight destination. To send data to Floodlight (tag ID `DC-ZZZZZZZZZZ`), add another config command after initializing the first Google tag (tag ID `GT-XXXXXXXXXX`):

```ts
// `nuxt.config.ts`
export default defineNuxtConfig({
  modules: ['nuxt-gtag'],

  gtag: {
    tags: [
      'GT-XXXXXXXXXX', // Google Ads and GA4
      'DC-ZZZZZZZZZZ' // Floodlight
    ]
  }
})
```

Or use the object syntax to initialize multiple tags with different configurations:

```ts
// `nuxt.config.ts`
export default defineNuxtConfig({
  modules: ['nuxt-gtag'],

  gtag: {
    tags: [
      {
        id: 'GT-XXXXXXXXXX',
        config: {
          page_title: 'GA4'
        }
      },
      {
        id: 'DC-ZZZZZZZZZZ',
        config: {
          page_title: 'Floodlight'
        }
      }
    ]
  }
})
```

## Configuration

All [supported module options](#module-options) can be configured using the `gtag` key in your Nuxt configuration. An example of some of the options you can set:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-gtag'],

  gtag: {
    // Your primary Google tag ID
    id: 'G-XXXXXXXXXX',
    // Additional configuration for this tag ID
    config: {
      page_title: 'My Custom Page Title'
    },

    // To send data to multiple destinations, use this option instead:
    tags: [
      'GT-XXXXXXXXXX', // Google Ads and GA4
      'DC-ZZZZZZZZZZ' // Floodlight
    ]
  }
})
```

### Runtime Config

Instead of hard-coding your Google tag ID in your Nuxt configuration, you can set your desired option in your project's `.env` file, leveraging [automatically replaced public runtime config values](https://nuxt.com/docs/api/nuxt-config#runtimeconfig) by matching environment variables at runtime.

```ini
# Overwrites the `gtag.id` module option
NUXT_PUBLIC_GTAG_ID=G-XXXXXXXXXX
```

With this setup, you can omit the `gtag` key in your Nuxt configuration if you only intend to set the Google tag ID.

### Consent Management

For GDPR compliance, you may want to delay the loading of the `gtag.js` script until the user has granted consent. Set the `initialConsent` option to `false` to prevent the `gtag.js` script from loading until you manually enable it.

```ts
export default defineNuxtConfig({
  modules: ['nuxt-gtag'],

  gtag: {
    id: 'G-XXXXXXXXXX',
    initialConsent: false
  }
})
```

To manually manage consent, you can use the [`grantConsent` method destructurable from `useGtag`](#usegtag) to set the consent state, e.g. after the user has accepted your cookie policy.

```vue
<script setup lang="ts">
const { gtag, grantConsent, revokeConsent } = useGtag()
</script>

<template>
  <button @click="grantConsent()">
    Accept Tracking
  </button>
</template>
```

### Multi-Tenancy Support

You can even leave the Google tag ID in your Nuxt config blank and set it dynamically later in your application by passing your ID as the first argument to `grantConsent`. This is especially useful if you want to use a custom ID for each user or if your app manages multiple tenants.

```ts
const { gtag, grantConsent, revokeConsent } = useGtag()

function acceptTracking() {
  grantConsent('G-XXXXXXXXXX')
}
```

## Module Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `undefined` | The Google tag ID to initialize. |
| `config` | `Record<string, any>` | `undefined` | The [configuration parameters](https://developers.google.com/analytics/devguides/collection/ga4/reference/config) to be passed to `gtag.js` on initialization. |
| `tags` | `string[] \| GoogleTagOptions[]` | `[]` | Multiple Google tag IDs to initialize for sending data to different destinations. |
| `initialConsent` | `boolean` | `true` | Whether to initialize the Google tag script immediately after the page has loaded. |
| `loadingStrategy` | `'async' \| 'defer'` | `'defer'` | The loading strategy to be used for the `gtag.js` script. |
| `url` | `string` | `'https://www.googletagmanager.com/gtag/js'` | The URL to the `gtag.js` script. Use this option to load the script from a custom URL. |

## Composables

As with other composables in the Nuxt 3 ecosystem, they are auto-imported and can be used in your application's components.

### `useGtag`

The SSR-safe `useGtag` composable provides access to:

- The `gtag.js` instance
- The `grantConsent` method
- The `revokeConsent` method

It can be used as follows:

```ts
// Each method is destructurable from the composable and can be
// used on the server and client-side
const { gtag, grantConsent, revokeConsent } = useGtag()
```

**Type Declarations**

```ts
function useGtag(): {
  gtag: Gtag
  grantConsent: (id?: string) => void
  revokeConsent: (id?: string) => void
}
```

#### `gtag`

The `gtag` function is the main interface to the `gtag.js` instance and can be used to call any of the [gtag.js methods](https://developers.google.com/tag-platform/gtagjs/reference).

```ts
const { gtag } = useGtag()

// SSR-ready
gtag('event', 'screen_view', {
  app_name: 'My App',
  screen_name: 'Home'
})
```

> [!NOTE]
> Since the `gtag.js` instance is available in the client only, any `gtag()` calls executed on the server will have no effect.

**Type Declarations**

```ts
const gtag: {
  (command: 'config', targetId: string, config?: ControlParams | EventParams | ConfigParams | Record<string, any>): void
  (command: 'set', targetId: string, config: string | boolean | Record<string, any>): void
  (command: 'set', config: Record<string, any>): void
  (command: 'js', config: Date): void
  (command: 'event', eventName: EventNames | (string & Record<never, never>), eventParams?: ControlParams | EventParams | Record<string, any>): void
  (command: 'get', targetId: string, fieldName: FieldNames | string, callback?: (field?: string | Record<string, any>) => any): void
  (command: 'consent', consentArg: ConsentArg | string, consentParams: ConsentParams): void
}
```

**Example**

The following event command fires the event `screen_view` with two parameters: `app_name` and `screen_name`.

```ts
const { gtag } = useGtag()

// SSR-ready
gtag('event', 'screen_view', {
  app_name: 'My App',
  screen_name: 'Home'
})
```

#### `grantConsent`

If you want to manually manage consent, i.e. for GDPR compliance, you can use the `grantConsent` method to initialize the `gtag.js` script after the user has accepted your cookie policy. Make sure to set `initialConsent` to `false` in the module options beforehand.

This function accepts an optional ID in case you want to initialize a custom Google tag ID and haven't set it in the module options.

```ts
const { grantConsent } = useGtag()

// When called, the `gtag.js` script will be loaded all tag IDs initialized
grantConsent()
```

> [!TIP]
> Although this method is SSR-safe, the `gtag.js` script will be loaded in the client only. Make sure to run this method in the client.

**Type Declarations**

```ts
function grantConsent(id?: string): void
```

#### `revokeConsent`

If a user has previously granted consent, you can use the `revokeConsent` method to revoke the consent. It will prevent the Google tag from sending data until the consent is granted again.

> [!Note]
> This works only with Google Analytics 4 tags

This function accepts an optional ID in case you haven't set it in the module options. Make sure to pass the same ID that was used to grant the consent.

```ts
const { revokeConsent } = useGtag()

// When called, the `gtag.js` script will be stopped from tracking events
revokeConsent()
```

**Type Declarations**

```ts
function revokeConsent(id?: string): void
```

### `useTrackEvent`

Track your defined goals by passing the following parameters:

- The name of the recommended or custom event.
- A collection of parameters that provide additional information about the event (optional).

> [!NOTE]
> This composable is SSR-ready. But since the `gtag.js` instance is available in the client only, executing the composable on the server will have no effect.

**Type Declarations**

```ts
function useTrackEvent(
  eventName: EventNames | (string & Record<never, never>),
  eventParams?: ControlParams | EventParams | Record<string, any>,
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

- [Maronbeere](https://maronbeere.carrd.co) for his logo pixel art.
- [Junyoung Choi](https://github.com/rokt33r) and [Lucas Akira Uehara](https://github.com/KsAkira10) for their Google [`gtag.js` API type definitions](https://www.npmjs.com/package/@types/gtag.js)

## License

[MIT](./LICENSE) License © 2023-PRESENT [Johann Schopplich](https://github.com/johannschopplich)
