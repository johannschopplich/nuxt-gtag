export function disableAnalytics(id: string) {
  (window as any)[`ga-disable-${id}`] = true
}

export function enableAnalytics(id: string) {
  const key = `ga-disable-${id}`

  if (key in window)
    delete (window as any)[key]
}
