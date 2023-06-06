export interface CreatePaymentIntenteRequest {
  amount: number
  currency: string
  automatic_payment_methods?: AutomaticPaymentMethods
  confirm?: boolean
  payment_method: string
  customer: string | null
  transfer_group?: string
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

export interface MakeTransferRequest {
  amount: number
  currency: string
  destination: string
  transfer_groupd: string
}

export interface CancelPaymentIntentResponse {
  id:                          string;
  object:                      string;
  amount:                      number;
  amount_capturable:           number;
  amount_details:              AmountDetails;
  amount_received:             number;
  application:                 null;
  application_fee_amount:      null;
  automatic_payment_methods:   null;
  canceled_at:                 null;
  cancellation_reason:         null;
  capture_method:              string;
  client_secret:               string;
  confirmation_method:         string;
  created:                     number;
  currency:                    string;
  customer:                    null;
  description:                 string;
  invoice:                     null;
  last_payment_error:          null;
  latest_charge:               null;
  livemode:                    boolean;
  metadata:                    Metadata;
  next_action:                 null;
  on_behalf_of:                null;
  payment_method:              null;
  payment_method_options:      PaymentMethodOptions;
  payment_method_types:        string[];
  processing:                  null;
  receipt_email:               null;
  redaction:                   null;
  review:                      null;
  setup_future_usage:          null;
  shipping:                    null;
  statement_descriptor:        null;
  statement_descriptor_suffix: null;
  status:                      string;
  transfer_data:               null;
  transfer_group:              null;
}

export interface AmountDetails {
  tip: Metadata;
}

export interface Metadata {
}

export interface PaymentMethodOptions {
  card: Card;
}

export interface Card {
  installments:           null;
  mandate_options:        null;
  network:                null;
  request_three_d_secure: string;
}

export interface CreateRefundRequest {
  
}

export interface CreateRefundResponse {
  id:                       string;
  object:                   string;
  amount:                   number;
  balance_transaction:      null;
  charge:                   string;
  created:                  number;
  currency:                 string;
  metadata:                 Metadata;
  payment_intent:           null;
  reason:                   null;
  receipt_number:           null;
  source_transfer_reversal: null;
  status:                   string;
  transfer_reversal:        null;
}

export interface Metadata {
}
