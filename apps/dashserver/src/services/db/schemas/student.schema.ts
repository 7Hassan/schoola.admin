import { Schema } from 'mongoose';
import { StudentDocument, EntityStatus, Gender } from '../../../types';
import { addressSchema, emergencyContactSchema, phoneSchema } from './shared.schemas';
import { nanoid } from 'nanoid';

export const studentSchema = new Schema<StudentDocument>(
  {
    studentCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      index: true,
    },
    phone: phoneSchema,
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    address: addressSchema,
    emergencyContact: emergencyContactSchema,
    guardianName: {
      type: String,
      trim: true,
    },
    guardianPhone: phoneSchema,
    guardianEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    profilePhoto: {
      type: String,
    },
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
    groupIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        index: true,
      },
    ],
    authorityId: {
      type: Schema.Types.ObjectId,
      ref: 'Authority',
      index: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for performance
studentSchema.index({ firstName: 1, lastName: 1 });
studentSchema.index({ status: 1, createdAt: -1 });
studentSchema.index({ groupIds: 1, status: 1 });

// Virtual for full name if not provided
studentSchema.virtual('computedFullName').get(function (this: StudentDocument) {
  return this.fullName || `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to generate student code and full name
studentSchema.pre('save', async function (this: StudentDocument, next) {
  if (this.isNew && !this.studentCode) {
    this.studentCode = `STU-${nanoid()}`;
  }

  if (!this.fullName) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }

  next();
});
