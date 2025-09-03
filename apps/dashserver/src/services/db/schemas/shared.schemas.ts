import mongoose, { Schema } from 'mongoose';
import { PaymentStatus, RefundDocument, SocialMediaPlatform } from '../../../types';
import { Currency, RefundReason } from '@schoola/types/src';
// Local enums that might not be in the types package

// Address subdocument schema - Used in student, teacher, authority, location, invoice
export const addressSchema = new Schema(
  {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, required: true, trim: true },
  },
  { _id: false },
);

// Phone subdocument schema - Used in student, teacher, emergency contacts
export const phoneSchema = new Schema(
  {
    countryCode: { type: String, required: true, trim: true },
    number: { type: String, required: true, trim: true },
  },
  { _id: false },
);

// Emergency contact subdocument schema - Used in student and teacher
export const emergencyContactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: phoneSchema,
    relationship: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
  },
  { _id: false },
);

// Guardian contact subdocument schema - Used in student schema for guardian info
export const guardianContactSchema = new Schema(
  {
    name: { type: String, trim: true },
    phone: phoneSchema,
    email: { type: String, lowercase: true, trim: true },
  },
  { _id: false },
);

// Salary subdocument schema - Used in teacher and instructor
export const salarySchema = new Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: Object.values(Currency), required: true },
  },
  { _id: false },
);

// Cost subdocument schema - Used in subscription, group, and other pricing entities
export const costSchema = new Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: Object.values(Currency), required: true },
  },
  { _id: false },
);

// Social media contact subdocument schema - Used in authority, potentially others
export const socialMediaContactSchema = new Schema(
  {
    platform: { type: String, enum: Object.values(SocialMediaPlatform), required: true },
    handle: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false },
);

// Contact info subdocument schema - Used in authority, potentially others
export const contactInfoSchema = new Schema(
  {
    phone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    socialMedia: [socialMediaContactSchema],
  },
  { _id: false },
);

// Payment fees subdocument schema - Used in payment transactions
export const paymentFeesSchema = new Schema(
  {
    processingFee: { type: Number, default: 0, min: 0 },
    platformFee: { type: Number, default: 0, min: 0 },
    gatewayFee: { type: Number, default: 0, min: 0 },
    totalFees: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: Object.values(Currency), required: true },
  },
  { _id: false },
);

// Refund subdocument schema - Used in payment transactions
export const refundSchema = new Schema<RefundDocument>(
  {
    _id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    originalTransactionId: { type: Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: Object.values(Currency), required: true },
    reason: { type: String, enum: Object.values(RefundReason), required: true },
    reasonNote: { type: String, trim: true },
    processedAt: { type: Date },
    refundTransactionId: { type: String, trim: true },
    status: { type: String, enum: Object.values(PaymentStatus), required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

export const teachingDepartment = new Schema({
  name: { type: String, required: true, trim: true },
  head: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  contact: contactInfoSchema,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
