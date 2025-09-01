interface FlutterwaveClientConfig {
  publicKey: string
  baseUrl: string
}

class FlutterwaveClient {
  private config: FlutterwaveClientConfig

  constructor(publicKey?: string) {
    this.config = {
      publicKey: publicKey || "",
      baseUrl: "https://api.flutterwave.com/v3",
    }
  }

  // Client-side method to get public key for frontend integrations
  getPublicKey(): string {
    return this.config.publicKey
  }

  // Client-side method to generate transaction reference
  generateTxRef(): string {
    return `nutrikids_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  setPublicKey(publicKey: string): void {
    this.config.publicKey = publicKey
  }
}

export { FlutterwaveClient }
export const flutterwaveClient = new FlutterwaveClient()
