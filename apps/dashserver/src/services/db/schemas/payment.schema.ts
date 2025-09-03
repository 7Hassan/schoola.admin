import mongoose, { Schema } from 'mongoose';
import {
  PaymentDocument,
  TransactionDocument,
  PaymentStatus,
  PaymentMethod,
  PaymentGateway,
  TransactionType,
  InstallmentFrequency,
  CardBrand,
  WalletProvider,
} from '../../../types';
import { paymentFeesSchema, refundSchema } from './shared.schemas';
import { Currency, BankName } from '@schoola/types/src/enums/global.enums';

// Installment plan subdocument schema
const installmentPlanSchema = new Schema(
  {
    totalInstallments: { type: Number, required: true, min: 1 },
    installmentAmount: { type: Number, required: true, min: 0 },
    currentInstallment: { type: Number, default: 1, min: 1 },
    frequency: { type: String, enum: Object.values(InstallmentFrequency), required: true },
    nextDueDate: { type: Date },
  },
  { _id: false },
);

// Payment details subdocument schema
const paymentDetailsSchema = new Schema(
  {
    method: { type: String, enum: Object.values(PaymentMethod), required: true },
    gateway: { type: String, enum: Object.values(PaymentGateway) },
    gatewayTransactionId: { type: String, trim: true },
    cardLast4: { type: String, trim: true, maxlength: 4 },
    cardBrand: { type: String, enum: Object.values(CardBrand) },
    walletProvider: { type: String, enum: Object.values(WalletProvider) },
    bankName: { type: String, enum: Object.values(BankName) },
    checkNumber: { type: String, trim: true },
    installmentPlan: installmentPlanSchema,
  },
  { _id: false },
);

// Payment schema
export const paymentSchema = new Schema<PaymentDocument>(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    currency: {
      type: String,
      enum: Object.values(Currency),
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.Pending,
      required: true,
      index: true,
    },
    paymentDetails: {
      type: paymentDetailsSchema,
      required: true,
    },
    fees: paymentFeesSchema,
    refunds: [refundSchema],
    description: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    failureReason: {
      type: String,
      trim: true,
    },
    processedAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Transaction schema
export const transactionSchema = new Schema<TransactionDocument>(
  {
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
      index: true,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      index: true,
    },
    sessionIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Session',
        index: true,
      },
    ],
    courseIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        index: true,
      },
    ],
    description: {
      type: String,
      required: true,
      trim: true,
    },
    payment: {
      type: paymentSchema,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
      index: true,
    },
    dueDate: {
      type: Date,
      index: true,
    },
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
      index: true,
    },
    receiptUrl: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for performance
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ 'paymentDetails.method': 1, status: 1 });
paymentSchema.index({ amount: 1, currency: 1 });

transactionSchema.index({ studentId: 1, status: 1 });
transactionSchema.index({ groupId: 1, type: 1 });
transactionSchema.index({ createdAt: -1, status: 1 });
transactionSchema.index({ dueDate: 1, status: 1 });

// Virtual for payment amount with currency
paymentSchema.virtual('formattedAmount').get(function (this: PaymentDocument) {
  return `${this.amount} ${this.currency.toUpperCase()}`;
});

// Virtual for transaction total with fees
transactionSchema.virtual('totalWithFees').get(function (this: TransactionDocument) {
  const paymentFees = this.payment.fees;
  return paymentFees ? this.payment.amount + paymentFees.totalFees : this.payment.amount;
});

export const PaymentModel = mongoose.model<PaymentDocument>('Payment', paymentSchema);
export const TransactionModel = mongoose.model<TransactionDocument>('Transaction', transactionSchema);
