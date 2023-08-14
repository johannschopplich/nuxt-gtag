export interface Gtag {
  (command: 'config', targetId: string, config?: Record<string, any>): void
  (command: 'event', eventName: string, eventParams?: Record<string, any>): void
  (command: 'set', targetId: string, config: string | boolean | Record<string, any>): void
  (command: 'set', config: Record<string, any>): void
  (command: 'get', targetId: string, fieldName: string, callback?: (field?: string | Record<string, any>) => void): void
  (command: 'consent', consentArg: string, consentParams: Record<string, any>): void
  (command: 'js', config: Date): void
}

export interface UseGtagConsentOptions {
  /**
   * Whether to accept or decline the consent.
   *
   * @default true
   */
  hasConsent?: boolean
  /**
   * In case you want to initialize a custom Gtag ID. Make sure to set
   * `initialConsent` to `false` in the module options beforehand.
   */
  id?: string
}
