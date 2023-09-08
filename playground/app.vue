<script setup lang="ts">
const { gtag: gtagOpts } = useRuntimeConfig().public

const { gtag, grantConsent, revokeConsent } = useGtag()
const consent = ref(gtagOpts.initialConsent)

onMounted(() => {
  // eslint-disable-next-line no-console
  console.log('Use the "gtag" function to send custom events', gtag)
})

function toggleConsent() {
  consent.value = !consent.value

  if (consent.value)
    grantConsent()
  else
    revokeConsent()
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

  <h3>Usage</h3>
  <p>
    <button @click="toggleConsent">
      {{ consent ? 'Revoke' : 'Grant' }} consent
    </button>
    &nbsp;
    <button @click="trackEvent">
      Track event
    </button>
  </p>
</template>
