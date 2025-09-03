import mongoose, { Schema } from 'mongoose';
import { TeacherDocument, EntityStatus, Gender, EmploymentType } from '../../../types';
import { addressSchema, emergencyContactSchema, salarySchema } from './shared.schemas';
import { TeacherDepartment } from '@schoola/types/src/enums/global.enums';

const teacherSchema = new Schema<TeacherDocument>(
  {
    employeeId: {
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
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    address: addressSchema,
    emergencyContact: emergencyContactSchema,
    profilePhoto: {
      type: String,
    },
    department: {
      type: String,
      enum: Object.values(TeacherDepartment),
      required: true,
      trim: true,
      index: true,
    },
    subjects: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    qualifications: [
      {
        type: String,
        trim: true,
      },
    ],
    experienceYears: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    hireDate: {
      type: Date,
      required: true,
      index: true,
    },
    employmentType: {
      type: String,
      enum: Object.values(EmploymentType),
      required: true,
      index: true,
    },
    salary: salarySchema,
    status: {
      type: String,
      enum: Object.values(EntityStatus),
      default: EntityStatus.Active,
      required: true,
      index: true,
    },
    assignedGroups: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        index: true,
      },
    ],
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
teacherSchema.index({ firstName: 1, lastName: 1 });
teacherSchema.index({ status: 1, department: 1 });
teacherSchema.index({ department: 1, employmentType: 1 });
teacherSchema.index({ experienceYears: -1 });

// Virtual for full name if not provided
teacherSchema.virtual('computedFullName').get(function (this: TeacherDocument) {
  return this.fullName || `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to generate employee ID and full name
teacherSchema.pre('save', async function (this: TeacherDocument, next) {
  if (this.isNew && !this.employeeId) {
    const count = await mongoose.model('Teacher').countDocuments();
    this.employeeId = `TCH${String(count + 1).padStart(6, '0')}`;
  }

  if (!this.fullName) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }

  next();
});

export const TeacherModel = mongoose.model<TeacherDocument>('Teacher', teacherSchema);
export { teacherSchema };
