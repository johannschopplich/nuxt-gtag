import type { GtagCommands } from '../types'
import { useGtag } from './useGtag'

export function useTrackEvent(
  ...args: GtagCommands['event']
) {
  const { gtag } = useGtag()
  gtag('event', ...args)
}
