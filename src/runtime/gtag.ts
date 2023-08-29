export function gtag(..._args: any[]) {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer?.push(arguments)
}
