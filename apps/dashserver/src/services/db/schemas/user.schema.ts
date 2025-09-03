import mongoose, { Schema } from 'mongoose';
import { UserDocument } from '../../../types';

// Admin profile subdocument schema
const adminProfileSchema = new Schema(
  {
    department: {
      type: String,
      required: true,
      trim: true,
    },
    permissions: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  { _id: false },
);

const userSchema = new Schema<UserDocument>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
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
    role: {
      type: String,
      required: true,
      enum: ['student', 'teacher', 'admin'],
      index: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
      index: true,
    },
    lastLogin: {
      type: Date,
      index: true,
    },
    profilePhoto: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      index: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      index: true,
    },
    adminProfile: {
      type: adminProfileSchema,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for performance
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ firstName: 1, lastName: 1 });
userSchema.index({ lastLogin: -1 });

// Virtual for computed full name
userSchema.virtual('computedFullName').get(function (this: UserDocument) {
  return this.fullName || `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to generate full name
userSchema.pre('save', async function (this: UserDocument, next) {
  // Generate full name if not provided
  if (!this.fullName || this.isModified('firstName') || this.isModified('lastName')) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }

  next();
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
export { userSchema };
