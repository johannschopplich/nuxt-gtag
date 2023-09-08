import { useGtag } from './useGtag'

export function useTrackEvent(
  eventName: string,
  eventParams?: Record<string, any>,
) {
  const { gtag } = useGtag()
  gtag('event', eventName, eventParams)
}
