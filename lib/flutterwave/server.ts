interface FlutterwaveServerConfig {
  secretKey: string
  baseUrl: string
}

class FlutterwaveServer {
  private config: FlutterwaveServerConfig

  constructor() {
    this.config = {
      secretKey: process.env.FLUTTERWAVE_SECRET_KEY || "",
      baseUrl: "https://api.flutterwave.com/v3",
    }
  }

  async initializePayment(paymentData: {
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
  }) {
    const response = await fetch(`${this.config.baseUrl}/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    })

    return response.json()
  }

  async verifyPayment(transactionId: string) {
    const response = await fetch(`${this.config.baseUrl}/transactions/${transactionId}/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.config.secretKey}`,
        "Content-Type": "application/json",
      },
    })

    return response.json()
  }

  async createPaymentPlan(planData: {
    amount: number
    name: string
    interval: string
    duration?: number
  }) {
    const response = await fetch(`${this.config.baseUrl}/payment-plans`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planData),
    })

    return response.json()
  }
}

export const flutterwaveServer = new FlutterwaveServer()
