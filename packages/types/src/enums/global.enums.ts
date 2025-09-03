export enum EmploymentType {
  FullTime = 'full_time',
  PartTime = 'part_time',
  Contract = 'contract',
  Freelance = 'freelance'
}

export enum PaymentStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
  Canceled = 'canceled',
  Refunded = 'refunded',
  PartiallyRefunded = 'partially_refunded',
  Disputed = 'disputed',
  Chargeback = 'chargeback',
  Expired = 'expired'
}

export enum PaymentMethod {
  CreditCard = 'credit_card',
  DebitCard = 'debit_card',
  BankTransfer = 'bank_transfer',
  MobileWallet = 'mobile_wallet',
  Cash = 'cash',
  Check = 'check',
  Installment = 'installment',
  Subscription = 'subscription'
}

export enum PaymentGateway {
  Stripe = 'stripe',
  PayPal = 'paypal',
  Fawry = 'fawry',
  Paymob = 'paymob',
  Vodafone = 'vodafone_cash',
  Orange = 'orange_money',
  Etisalat = 'etisalat_cash',
  BankMisr = 'bank_misr',
  NBE = 'nbe',
  CIB = 'cib'
}

export enum RefundReason {
  CustomerRequest = 'customer_request',
  ServiceNotProvided = 'service_not_provided',
  TechnicalError = 'technical_error',
  Duplicate = 'duplicate',
  Fraud = 'fraud',
  Other = 'other'
}

export enum TransactionType {
  Payment = 'payment',
  Refund = 'refund',
  PartialRefund = 'partial_refund',
  Fee = 'fee',
  Discount = 'discount',
  Adjustment = 'adjustment'
}

export enum Gender {
  Male = 'male',
  Female = 'female'
}

export enum MaterialType {
  PDF = 'pdf',
  Video = 'video',
  Document = 'document',
  Link = 'link',
  Image = 'image'
}

export enum Currency {
  EGP = 'egp',
  USD = 'usd',
  EUR = 'eur'
}

export enum UserRole {
  SuperAdmin = 'super-admin',
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer',
  Teacher = 'teacher',
  Student = 'student',
  Parent = 'parent',
  Authority = 'authority'
}

export enum EntityStatus {
  Active = 'active',
  Inactive = 'inactive',
  Draft = 'draft',
  Archived = 'archived',
  Suspended = 'suspended',
  Completed = 'completed',
  Canceled = 'canceled'
}

export enum GroupStatus {
  Active = EntityStatus.Active,
  Completed = EntityStatus.Completed,
  Canceled = EntityStatus.Canceled
}

export enum CourseLevel {
  Junior = 'junior',
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
  Expert = 'expert'
}

export enum SubscriptionType {
  Monthly = 'monthly',
  Yearly = 'yearly'
}

export enum SessionStatus {
  Scheduled = 'scheduled',
  InProgress = 'in_progress',
  Completed = 'completed',
  Canceled = 'canceled',
  Postponed = 'postponed'
}

export enum AttendanceStatus {
  Present = 'present',
  Absent = 'absent',
  Late = 'late',
  Excused = 'excused'
}

export enum InstallmentFrequency {
  Weekly = 'weekly',
  Monthly = 'monthly',
  Quarterly = 'quarterly'
}

export enum CardBrand {
  Visa = 'visa',
  Mastercard = 'mastercard',
  AmericanExpress = 'american_express',
  Discover = 'discover',
  Diners = 'diners',
  JCB = 'jcb',
  UnionPay = 'union_pay',
  Maestro = 'maestro'
}

export enum WalletProvider {
  VodafoneCash = 'vodafone_cash',
  OrangeMoney = 'orange_money',
  EtisalatCash = 'etisalat_cash',
  Fawry = 'fawry',
  ApplePay = 'apple_pay',
  GooglePay = 'google_pay',
  SamsungPay = 'samsung_pay',
  PayPal = 'paypal'
}

export enum BankName {
  NBE = 'national_bank_egypt',
  BankMisr = 'bank_misr',
  CIB = 'cib',
  AAIB = 'aaib',
  Banque = 'banque_du_caire',
  ADIB = 'adib',
  QNB = 'qnb',
  HSBC = 'hsbc',
  Barclays = 'barclays',
  Other = 'other'
}

export enum InvoiceStatus {
  Draft = 'draft',
  Sent = 'sent',
  Paid = 'paid',
  Overdue = 'overdue',
  Canceled = 'canceled'
}

export enum DiscountType {
  Percentage = 'percentage',
  FixedAmount = 'fixed_amount',
  BuyXGetY = 'buy_x_get_y'
}

export enum DiscountApplicableTo {
  All = 'all',
  Courses = 'courses',
  Subscriptions = 'subscriptions',
  Groups = 'groups'
}

export enum PaymentPlanStatus {
  Active = 'active',
  Completed = 'completed',
  Defaulted = 'defaulted',
  Canceled = 'canceled'
}

export enum InstallmentStatus {
  Pending = 'pending',
  Paid = 'paid',
  Overdue = 'overdue',
  Waived = 'waived'
}

export enum SubscriptionStatus {
  Active = 'active',
  Expired = 'expired',
  Suspended = 'suspended'
}

export enum GovernmentType {
  Federal = 'federal',
  State = 'state',
  Provincial = 'provincial',
  Regional = 'regional',
  Municipal = 'municipal',
  Local = 'local',
  National = 'national'
}

export enum SocialMediaPlatform {
  Facebook = 'facebook',
  Twitter = 'twitter',
  Instagram = 'instagram',
  LinkedIn = 'linkedin',
  YouTube = 'youtube',
  TikTok = 'tiktok',
  WhatsApp = 'whatsapp',
  Telegram = 'telegram',
  Website = 'website'
}

export enum Country {
  Egypt = 'egypt',
  UAE = 'uae',
  SaudiArabia = 'saudi_arabia',
  Kuwait = 'kuwait',
  Qatar = 'qatar',
  Bahrain = 'bahrain',
  Oman = 'oman',
  Jordan = 'jordan',
  Lebanon = 'lebanon',
  Syria = 'syria',
  Iraq = 'iraq',
  Palestine = 'palestine',
  Morocco = 'morocco',
  Tunisia = 'tunisia',
  Algeria = 'algeria',
  Libya = 'libya',
  Sudan = 'sudan',
  USA = 'usa',
  UK = 'uk',
  Germany = 'germany',
  France = 'france',
  Canada = 'canada',
  Australia = 'australia',
  Other = 'other'
}

export enum TeacherDepartment {
  ComputerScience = 'computer_science',
  SoftwareEngineering = 'software_engineering',
  DataScience = 'data_science',
  ArtificialIntelligence = 'artificial_intelligence',
  CyberSecurity = 'cyber_security',
  InformationTechnology = 'information_technology',
  WebDevelopment = 'web_development',
  MobileDevelopment = 'mobile_development',
  GameDevelopment = 'game_development',
  DevOps = 'devops',
  CloudComputing = 'cloud_computing',
  Other = 'other'
}

