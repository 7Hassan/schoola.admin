import { Types, Document } from 'mongoose';

// Base document interface for all MongoDB documents
export interface BaseDocument extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Common shared imports from @schoola/types that are used across multiple entities
export {
  // Enums
  EntityStatus,
  Gender,
  EmploymentType,
  CourseLevel,
  GroupStatus,
  SessionStatus,
  AttendanceStatus,
  MaterialType,
  SubscriptionType,
  PaymentStatus,
  TransactionType,
  InvoiceStatus,
  PaymentPlanStatus,
  InstallmentStatus,
  SubscriptionStatus,
  GovernmentType,
  Country,
  DiscountType,
  DiscountApplicableTo,
  PaymentMethod,
  PaymentGateway,
  InstallmentFrequency,
  CardBrand,
  WalletProvider,
  BankName,
  RefundReason,
  SocialMediaPlatform,

  // Global types
  Address,
  EmergencyContact,
  Phone,
  ContactInfo,
  SocialMediaContact,
  PaymentDetails,
  PaymentFees,
  Refund,
  Cost,
  Salary,
  AgeRange,
} from '@schoola/types/src';
