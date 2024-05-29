<script setup lang="ts">
useHead({
  title: 'Nuxt Gtag',
  link: [
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css' },
  ],
})

const { gtag: gtagOpts } = useRuntimeConfig().public
const { gtag, initialize, enableAnalytics, disableAnalytics } = useGtag()
const isInitialized = ref(gtagOpts.enabled)
const isAnalyticsActive = ref(true)

onMounted(() => {
  console.log('Use the "gtag" function to send custom events', gtag)
})

function init() {
  initialize()
  isInitialized.value = true
}

function toggleAnalytics() {
  if (!isAnalyticsActive.value)
    enableAnalytics()
  else
    disableAnalytics()

  isAnalyticsActive.value = !isAnalyticsActive.value
}

function trackEvent() {
  useTrackEvent('share')
}
</script>

<template>
  <header>
    <h1>Nuxt Gtag</h1>
  </header>

  <h3>Configuration</h3>
  <details>
    <summary>Public Runtime Options</summary>
    <pre>{{ JSON.stringify(gtagOpts, null, 2) }}</pre>
  </details>

  <h3>Status</h3>
  <p>
    <mark>{{ isInitialized ? 'Initialized' : 'Pending' }}</mark>
  </p>

  <h3>Usage</h3>
  <p>
    <button @click="init">
      Initialize <code>gtag.js</code>
    </button>
    &nbsp;
    <button @click="toggleAnalytics">
      {{ isAnalyticsActive ? 'Disable' : 'Enable' }} Analytics
    </button>
    &nbsp;
    <button @click="trackEvent">
      Track event
    </button>
  </p>
</template>
