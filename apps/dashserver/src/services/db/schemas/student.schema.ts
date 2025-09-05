import mongoose, { Schema } from 'mongoose';
import { StudentDocument, EntityStatus, Gender } from '../../../types';
import { addressSchema, emergencyContactSchema, phoneSchema, healthSchema } from './shared.schemas';
import { nanoid } from 'nanoid';

export const studentSchema = new Schema<StudentDocument>(
  {
  // canonical fullName only (derived from childName + parentName)
  fullName: { type: String, trim: true, index: true },

    // frontend convenience
    childName: { type: String, trim: true, index: true },
    parentName: { type: String, trim: true },

    // structured contacts
    contacts: {
      parent: {
        phone: phoneSchema,
        whatsapp: phoneSchema,
      },
      child: {
        phone: phoneSchema,
        whatsapp: phoneSchema,
      },
    },

    // consolidated student info
    info: {
      dateOfBirth: { type: Date },
      gender: { type: String, enum: Object.values(Gender) },
      address: addressSchema,
      profilePhoto: { type: String },
  emergencyContact: emergencyContactSchema,
  health: healthSchema,
    },

    paid: { type: Boolean, default: false },

    email: { type: String, lowercase: true, trim: true, sparse: true, index: true },

    status: {
      type: String,
      enum: Object.values(EntityStatus),
      default: EntityStatus.Active,
      required: true,
      index: true,
    },

    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        index: true,
      },
    ],

    // single group reference (allows no group by being null)
    group: { type: Schema.Types.ObjectId, ref: 'Group', index: true },

    authorityId: { type: Schema.Types.ObjectId, ref: 'Authority', index: true },

    notes: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for performance
studentSchema.index({ status: 1, createdAt: -1 });
studentSchema.index({ group: 1, status: 1 });

// Virtual for full name if not provided
studentSchema.virtual('computedFullName').get(function (this: StudentDocument) {
  // Use stored fullName if present; otherwise fallback to childName and parentName join
  if (this.fullName) return this.fullName;
  const parts: string[] = [];
  if (this.childName) parts.push(this.childName.trim());
  if (this.parentName) parts.push(this.parentName.trim());
  return parts.join(' - ');
});

// Pre-save middleware to generate student code and full name
studentSchema.pre('save', async function (this: StudentDocument, next) {
  if (this.isNew && !this.studentCode) {
    this.studentCode = `STU-${nanoid()}`;
  }

  // Build fullName from childName and parentName when provided
  if (!this.fullName) {
    const parts: string[] = [];
    if (this.childName) parts.push(this.childName.trim());
    if (this.parentName) parts.push(this.parentName.trim());
    if (parts.length) this.fullName = parts.join(' - ');
  }

  // Map parentName to guardianName field if present in legacy codepaths (non-blocking)
  if (this.parentName && !(this as any).guardianName) {
    (this as any).guardianName = this.parentName;
  }

  // If contacts.parent.phone exists and guardianPhone is missing, map it (legacy)
  const parentPhone = this.contacts && (this.contacts as any).parent && (this.contacts as any).parent.phone;
  if (parentPhone && !(this as any).guardianPhone) {
    (this as any).guardianPhone = parentPhone;
  }

  // Ensure parent whatsapp fallback: if not provided, use parent phone
  const parentWhatsapp = this.contacts && (this.contacts as any).parent && (this.contacts as any).parent.whatsapp;
  const parentPhoneForWhatsapp = this.contacts && (this.contacts as any).parent && (this.contacts as any).parent.phone;
  if ((
    !parentWhatsapp ||
    !Object.keys(parentWhatsapp.toObject ? parentWhatsapp.toObject() : parentWhatsapp).length
  ) && parentPhoneForWhatsapp) {
    this.contacts = this.contacts || {} as any;
    (this.contacts as any).parent = (this.contacts as any).parent || {};
    (this.contacts as any).parent.whatsapp = parentPhoneForWhatsapp;
  }

  // Keep hasWhatsapp in sync with presence of parent's whatsapp
  const finalParentWhatsapp = this.contacts && (this.contacts as any).parent && (this.contacts as any).parent.whatsapp;
  (this as any).hasWhatsapp = !!(finalParentWhatsapp && (finalParentWhatsapp.countryCode || finalParentWhatsapp.number || Object.keys(finalParentWhatsapp).length));

  next();
});

// Virtual age (in years) from info.dateOfBirth
studentSchema.virtual('age').get(function (this: StudentDocument) {
  const dob = this.info && (this.info as any).dateOfBirth;
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  return years;
});
