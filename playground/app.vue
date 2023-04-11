<script setup lang="ts">
const { gtag: gtagOpts } = useRuntimeConfig().public

const gtag = useGtag()
const consent = ref(gtagOpts.initialConsent)

function logGtagFn() {
  // eslint-disable-next-line no-console
  console.log('Use the "gtag" function to send custom events', gtag)
}

function toggleConsent() {
  useGtagConsent(!consent.value)
  consent.value = !consent.value
}

function trackEvent() {
  useTrackEvent('share')
}
</script>

<template>
  <Head>
    <Title>nuxt-gtag</Title>
    <Link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css"
    />
  </Head>

  <header>
    <h1>nuxt-gtag</h1>
  </header>

  <h3>Configuration</h3>
  <details>
    <summary>Public Runtime Options</summary>
    <pre>{{ JSON.stringify(gtagOpts, null, 2) }}</pre>
  </details>

  <h3>Consent</h3>
  <p>
    <mark>{{ consent ? 'Consent granted' : 'Consent denied' }}</mark>
  </p>

  <h3>Composables</h3>
  <button @click="logGtagFn">
    useGtag
  </button>
  &nbsp;
  <button @click="toggleConsent">
    useGtagConsent
  </button>
  &nbsp;
  <button @click="trackEvent">
    useTrackEvent
  </button>
</template>
