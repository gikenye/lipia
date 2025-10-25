export interface WalletBalance {
  kes: number
  cusd: number
}

export interface ExchangeRate {
  rate: number
  from: string
  to: string
}

export interface Transaction {
  id: string
  type: "send" | "buy" | "paybill"
  amount: number
  recipient: string
  status: "pending" | "completed" | "failed"
  timestamp: Date
}

export interface FormErrors {
  [key: string]: string
}
