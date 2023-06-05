export interface CreatePaymentIntenteRequest {
  amount: number
  currency: string
  automatic_payment_methods?: AutomaticPaymentMethods
  confirm?: boolean
  payment_method: string
  customer: string
}

export interface AutomaticPaymentMethods {
  enabled: boolean
}

export interface CreatePaymentMethodRequest {
  type: 'card'
  card: Card
}

export interface Card {
  number: string
  exp_month: number
  exp_year: number
  cvc: string
}

export interface CreatePaymentMethodResponse {
  id: string
  object: string
  billing_details: BillingDetails
  card: CardStripe
  created: number
  customer: any
  livemode: boolean
  metadata: Metadata
  type: string
}

export interface BillingDetails {
  address: Address
  email: any
  name: any
  phone: any
}

export interface Address {
  city: any
  country: any
  line1: any
  line2: any
  postal_code: any
  state: any
}

export interface CardStripe {
  brand: string
  checks: Checks
  country: string
  exp_month: number
  exp_year: number
  fingerprint: string
  funding: string
  generated_from: any
  last4: string
  networks: Networks
  three_d_secure_usage: ThreeDSecureUsage
  wallet: any
}

export interface Checks {
  address_line1_check: any
  address_postal_code_check: any
  cvc_check: string
}

export interface Networks {
  available: string[]
  preferred: any
}

export interface ThreeDSecureUsage {
  supported: boolean
}

export interface Metadata {}

export interface CreateCustomerResponse {
  id: string
  object: string
  address: Address
  balance: number
  created: number
  currency: any
  default_currency: any
  default_source: any
  delinquent: boolean
  description: any
  discount: any
  email: string
  invoice_prefix: string
  invoice_settings: InvoiceSettings
  livemode: boolean
  metadata: Metadata
  name: string
  next_invoice_sequence: number
  phone: string
  preferred_locales: any[]
  shipping: any
  tax_exempt: string
  test_clock: any
}

export interface InvoiceSettings {
  custom_fields: any
  default_payment_method: any
  footer: any
  rendering_options: any
}
