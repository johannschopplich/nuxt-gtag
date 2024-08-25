import type { ModuleOptions } from '../module'

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    gtag: ModuleOptions
  }
}

export interface GoogleTagOptions {
  /**
   * The Google tag ID to initialize.
   */
  id: string
  /**
   * Additional commands to be executed before the Google tag ID is initialized.
   *
   * @remarks
   * Useful to set the default consent state.
   *
   * @example
   * ```ts
   * commands: [
   *   ['consent', 'default', {
   *     ad_storage: 'denied',
   *     ad_user_data: 'denied',
   *     ad_personalization: 'denied',
   *     analytics_storage: 'denied'
   *   }]
   * ]
   * ```
   *
   * @default undefined
   */
  initCommands?: {
    [K in keyof GtagCommands]: [K, ...GtagCommands[K]]
  }[keyof GtagCommands][]
  /**
   * Additional configuration for the Google tag ID, to be set during initialization of the tag ID with the `config' command.
   *
   * @default undefined
   */
  config?: GtagCommands['config'][1]
}

export interface GtagCommands {
  config: [targetId: string, config?: ControlParams | EventParams | ConfigParams | CustomParams]
  set: [targetId: string, config: CustomParams | boolean | string] | [config: CustomParams]
  js: [config: Date]
  event: [eventName: EventNames | (string & {}), eventParams?: ControlParams | EventParams | CustomParams]
  get: [
      targetId: string,
      fieldName: FieldNames | string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback?: (field?: string | CustomParams) => any,
  ]
  consent: [consentArg: ConsentArg | (string & {}), consentParams: ConsentParams]
}

export interface Gtag {
  <Command extends keyof GtagCommands>(command: Command, ...args: GtagCommands[Command]): void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CustomParams = Record<string, any>

export interface ConfigParams {
  page_title?: string
  page_location?: string
  page_path?: string
  send_page_view?: boolean
}

export interface ControlParams {
  groups?: string | string[]
  send_to?: string | string[]
  event_callback?: () => void
  event_timeout?: number
}

export type EventNames =
  | 'add_payment_info'
  | 'add_shipping_info'
  | 'add_to_cart'
  | 'add_to_wishlist'
  | 'begin_checkout'
  | 'checkout_progress'
  | 'earn_virtual_currency'
  | 'exception'
  | 'generate_lead'
  | 'join_group'
  | 'level_end'
  | 'level_start'
  | 'level_up'
  | 'login'
  | 'page_view'
  | 'post_score'
  | 'purchase'
  | 'refund'
  | 'remove_from_cart'
  | 'screen_view'
  | 'search'
  | 'select_content'
  | 'select_item'
  | 'select_promotion'
  | 'set_checkout_option'
  | 'share'
  | 'sign_up'
  | 'spend_virtual_currency'
  | 'tutorial_begin'
  | 'tutorial_complete'
  | 'unlock_achievement'
  | 'timing_complete'
  | 'view_cart'
  | 'view_item'
  | 'view_item_list'
  | 'view_promotion'
  | 'view_search_results'

export interface EventParams {
  checkout_option?: string
  checkout_step?: number
  content_id?: string
  content_type?: string
  coupon?: string
  currency?: string
  description?: string
  fatal?: boolean
  items?: Item[]
  method?: string
  number?: string
  promotions?: Promotion[]
  screen_name?: string
  search_term?: string
  shipping?: Currency
  tax?: Currency
  transaction_id?: string
  value?: number
  event_label?: string
  event_category?: string
}

type Currency = string | number

/**
 * Interface of an item object used in lists for this event.
 *
 * Reference:
 * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events#view_item_item view_item_item}
 * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events#view_item_list_item view_item_list_item}
 * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events#select_item_item select_item_item}
 * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events#add_to_cart_item add_to_cart_item}
 * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events#view_cart_item view_cart_item}
 */
interface Item {
  item_id?: string
  item_name?: string
  affiliation?: string
  coupon?: string
  currency?: string
  creative_name?: string
  creative_slot?: string
  discount?: Currency
  index?: number
  item_brand?: string
  item_category?: string
  item_category2?: string
  item_category3?: string
  item_category4?: string
  item_category5?: string
  item_list_id?: string
  item_list_name?: string
  item_variant?: string
  location_id?: string
  price?: Currency
  promotion_id?: string
  promotion_name?: string
  quantity?: number
}

interface Promotion {
  creative_name?: string
  creative_slot?: string
  promotion_id?: string
  promotion_name?: string
}

type FieldNames = 'client_id' | 'session_id' | 'gclid'

type ConsentArg = 'default' | 'update'

/**
 * Reference:
 * @see {@link https://support.google.com/tagmanager/answer/10718549#consent-types consent-types}
 * @see {@link https://developers.google.com/tag-platform/security/guides/consent consent}
 */
interface ConsentParams {
  ad_personalization?: 'granted' | 'denied' | undefined
  ad_user_data?: 'granted' | 'denied' | undefined
  ad_storage?: 'granted' | 'denied'
  analytics_storage?: 'granted' | 'denied'
  functionality_storage?: 'granted' | 'denied'
  personalization_storage?: 'granted' | 'denied'
  security_storage?: 'granted' | 'denied'
  wait_for_update?: number
  region?: string[]
}
