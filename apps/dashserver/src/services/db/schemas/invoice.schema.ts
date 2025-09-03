import mongoose, { Schema } from 'mongoose';
import { InvoiceDocument, InvoiceItemDocument, InvoiceDiscountDocument, InvoiceTaxDocument } from '../../../types';
import { Currency, InvoiceStatus, DiscountType } from '@schoola/types/src';

// Invoice item subdocument schema
const invoiceItemSchema = new Schema<InvoiceItemDocument>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    description: { type: String, required: true, trim: true },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    quantity: { type: Number, required: true, min: 0, default: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: Object.values(Currency), required: true },
  },
  { _id: true },
);

// Invoice discount subdocument schema
const invoiceDiscountSchema = new Schema<InvoiceDiscountDocument>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    type: { type: String, enum: Object.values(DiscountType), required: true },
    value: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    appliedAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: Object.values(Currency), required: true },
  },
  { _id: true },
);

// Invoice tax subdocument schema
const invoiceTaxSchema = new Schema<InvoiceTaxDocument>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    name: { type: String, required: true, trim: true },
    rate: { type: Number, required: true, min: 0 }, // Percentage
    appliedAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: Object.values(Currency), required: true },
  },
  { _id: true },
);

// Invoice schema
export const invoiceSchema = new Schema<InvoiceDocument>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    invoiceNumber: {
      type: String,
      unique: true,
      trim: true,
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
    items: [invoiceItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    discounts: [invoiceDiscountSchema],
    totalDiscounts: { type: Number, required: true, min: 0, default: 0 },
    taxes: [invoiceTaxSchema],
    totalTaxes: { type: Number, required: true, min: 0, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: {
      type: String,
      enum: Object.values(Currency),
      default: Currency.EGP,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(InvoiceStatus),
      default: InvoiceStatus.Draft,
      required: true,
      index: true,
    },
    dueDate: {
      type: Date,
      required: true,
      index: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
      required: true,
      index: true,
    },
    paidAt: {
      type: Date,
      index: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for performance
invoiceSchema.index({ studentId: 1, status: 1 });
invoiceSchema.index({ dueDate: 1, status: 1 });
invoiceSchema.index({ issueDate: -1 });
invoiceSchema.index({ totalAmount: 1, currency: 1 });
invoiceSchema.index({ createdAt: -1, status: 1 });

// Virtual for checking if invoice is overdue
invoiceSchema.virtual('isOverdue').get(function (this: InvoiceDocument) {
  const now = new Date();
  return this.status === InvoiceStatus.Sent && this.dueDate < now && !this.paidAt;
});

// Virtual for days overdue
invoiceSchema.virtual('daysOverdue').get(function (this: InvoiceDocument) {
  const now = new Date();
  const isOverdue = this.status === InvoiceStatus.Sent && this.dueDate < now && !this.paidAt;
  if (!isOverdue) return 0;
  return Math.ceil((now.getTime() - this.dueDate.getTime()) / (1000 * 60 * 60 * 24));
});

// Virtual for formatted total amount
invoiceSchema.virtual('formattedTotal').get(function (this: InvoiceDocument) {
  return `${this.totalAmount.toFixed(2)} ${this.currency.toUpperCase()}`;
});

// Pre-save middleware to auto-generate invoice number
invoiceSchema.pre('save', async function (next) {
  // Generate invoice number if not provided
  if (!this.invoiceNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Invoice').countDocuments({
      invoiceNumber: new RegExp(`^${year}-`),
    });
    this.invoiceNumber = `${year}-${String(count + 1).padStart(6, '0')}`;
  }

  next();
});

// Pre-save middleware to calculate totals from sub-documents
invoiceSchema.pre('save', function (next) {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce((sum: number, item) => sum + item.totalPrice, 0);

  // Calculate total discounts
  this.totalDiscounts = this.discounts.reduce((sum: number, discount) => sum + discount.appliedAmount, 0);

  // Calculate total taxes
  this.totalTaxes = this.taxes.reduce((sum: number, tax) => sum + tax.appliedAmount, 0);

  // Calculate total amount
  this.totalAmount = this.subtotal + this.totalTaxes - this.totalDiscounts;

  // Ensure non-negative total
  if (this.totalAmount < 0) this.totalAmount = 0;

  next();
});

export const InvoiceModel = mongoose.model<InvoiceDocument>('Invoice', invoiceSchema);
