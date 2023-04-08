import { useHead, useRuntimeConfig } from '#imports'

export function gtag(..._args: any[]) {
  if (process.client) {
    // eslint-disable-next-line prefer-rest-params
    (window as any).dataLayer.push(arguments)
  }
}

export function loadGtagScript() {
  const { gtag: gtagOpts } = useRuntimeConfig().public
  const { id, loadingStrategy } = gtagOpts

  // Sanitize loading strategy to be either `async` or `defer`
  const strategy = loadingStrategy === 'async' ? 'async' : 'defer'

  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${id}`,
        [strategy]: true,
      },
    ],
  })
}
