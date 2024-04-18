/* eslint-disable @typescript-eslint/no-explicit-any */

export function disableAnalytics(id: string) {
  (window as any)[`ga-disable-${id}`] = true
}

export function enableAnalytics(id: string) {
  const key = `ga-disable-${id}`

  if (key in window)
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (window as any)[key]
}
