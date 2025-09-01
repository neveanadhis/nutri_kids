export interface PaymentInitializationData {
  amount: number
  currency: string
  email: string
  phone_number?: string
  name: string
  tx_ref: string
  redirect_url: string
  customer: {
    email: string
    phone_number?: string
    name: string
  }
  customizations: {
    title: string
    description: string
    logo?: string
  }
  payment_plan?: string
}

export interface PaymentVerificationResponse {
  status: string
  message: string
  data: {
    id: number
    tx_ref: string
    flw_ref: string
    device_fingerprint: string
    amount: number
    currency: string
    charged_amount: number
    app_fee: number
    merchant_fee: number
    processor_response: string
    auth_model: string
    ip: string
    narration: string
    status: string
    payment_type: string
    created_at: string
    account_id: number
    customer: {
      id: number
      name: string
      phone_number: string
      email: string
      created_at: string
    }
  }
}

export interface WebhookPayload {
  event: string
  data: {
    id: number
    tx_ref: string
    flw_ref: string
    amount: number
    currency: string
    status: string
    customer: {
      email: string
      name: string
    }
  }
}
