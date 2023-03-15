export interface Gtag {
  (command: 'config', targetId: string, config?: Record<string, any>): void
  (command: 'event', eventName: string & {}, eventParams?: Record<string, any>): void
  (command: 'set', targetId: string, config: string | boolean | Record<string, any>): void
  (command: 'set', config: Record<string, any>): void
  (command: 'get', targetId: string, fieldName: string, callback?: (field?: string | Record<string, any>) => void): void
  (command: 'consent', consentArg: string, consentParams: Record<string, any>): void
  (command: 'js', config: Date): void
}
