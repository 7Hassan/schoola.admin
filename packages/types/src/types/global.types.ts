import {
  Currency,
  PaymentStatus,
  PaymentMethod,
  PaymentGateway,
  RefundReason,
  TransactionType,
  InstallmentFrequency,
  CardBrand,
  WalletProvider,
  BankName,
  SocialMediaPlatform
} from '../enums/global.enums'

export type Address = {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export type Salary = {
  amount: number
  currency: Currency
}

export type Cost = {
  amount: number
  currency: Currency
}

// Enhanced payment types
export type PaymentDetails = {
  method: PaymentMethod
  gateway?: PaymentGateway
  gatewayTransactionId?: string
  cardLast4?: string
  cardBrand?: CardBrand
  walletProvider?: WalletProvider
  bankName?: BankName
  checkNumber?: string
  installmentPlan?: InstallmentPlan
}

export type InstallmentPlan = {
  totalInstallments: number
  installmentAmount: number
  currentInstallment: number
  frequency: InstallmentFrequency
  nextDueDate?: Date
}

export type PaymentFees = {
  processingFee: number
  platformFee: number
  gatewayFee: number
  totalFees: number
  currency: Currency
}

export type Refund = {
  id: string
  originalTransactionId: string
  amount: number
  currency: Currency
  reason: RefundReason
  reasonNote?: string
  processedAt?: Date
  refundTransactionId?: string
  status: PaymentStatus
  createdAt: Date
}

export type Payment = {
  id: string
  amount: number
  currency: Currency
  status: PaymentStatus
  paymentDetails: PaymentDetails
  fees?: PaymentFees
  refunds?: Refund[]
  description?: string
  metadata?: Record<string, any>
  failureReason?: string
  processedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export type TransactionPayment = Payment & {
  transactionId: string
}

export type Phone = {
  countryCode: string
  number: string
}

export type EmergencyContact = {
  name: string
  phone: Phone
  relationship: string
  email: string
}

export type Duration = {
  seconds: number
  minutes: number
  hours: number
  days: number
}

export type TimeSlot = {
  startTime: string // Format: "HH:MM"
  endTime: string // Format: "HH:MM"
  dayOfWeek: number // 0-6 (Sunday = 0)
}

export type DateRange = {
  startDate: Date
  endDate: Date
}

export type AgeRange = {
  minAge: number
  maxAge: number
}

export type AuthTokens = {
  access: {
    token: string
    expires: Date
  }
  refresh: {
    token: string
    expires: Date
  }
}

export type LoginCredentials = {
  email: string
  password: string
}

export type RegisterData = LoginCredentials & {
  firstName: string
  lastName: string
  confirmPassword: string
}

export type SocialMediaContact = {
  platform: SocialMediaPlatform
  handle: string
  url: string
}

export type ContactInfo = {
  phone?: string
  email?: string
  socialMedia?: SocialMediaContact[]
}

