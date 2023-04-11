export function gtag(..._args: any[]) {
  // eslint-disable-next-line prefer-rest-params
  (window as any).dataLayer.push(arguments)
}
