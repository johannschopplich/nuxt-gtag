import { useGtag } from './useGtag'

export function useTrackEvent(
  eventName: string,
  eventParams?: Record<string, any>,
) {
  useGtag()('event', eventName, eventParams)
}
