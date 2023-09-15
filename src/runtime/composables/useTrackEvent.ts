import type { ControlParams, EventNames, EventParams } from '../types'
import { useGtag } from './useGtag'

export function useTrackEvent(
  eventName: EventNames | (string & Record<never, never>),
  eventParams?: ControlParams | EventParams | Record<string, any>,
) {
  const { gtag } = useGtag()
  gtag('event', eventName, eventParams)
}
