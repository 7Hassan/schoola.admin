import mongoose, { Schema } from 'mongoose';
import { DiscountDocument, DiscountUserUsageDocument } from '../../../types';
import { DiscountType, DiscountApplicableTo } from '@schoola/types/src';

// Discount User Usage subdocument schema
const discountUserUsageSchema = new Schema<DiscountUserUsageDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userPhone: {
      type: String,
      required: true,
      trim: true,
    },
    cardLast4: {
      type: String,
      trim: true,
    },
    cardFingerprint: {
      type: String,
      trim: true,
    },
    usageCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    firstUsedAt: {
      type: Date,
      required: true,
    },
    lastUsedAt: {
      type: Date,
      required: true,
    },
    transactionIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
        required: true,
      },
    ],
  },
  { _id: false, timestamps: false },
);

// Discount schema
export const discountSchema = new Schema<DiscountDocument>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(DiscountType),
      required: true,
      index: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    maxUsage: {
      type: Number,
      min: 1,
    },
    currentUsage: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    maxUsagePerUser: {
      type: Number,
      min: 1,
    },
    minOrderAmount: {
      type: Number,
      min: 0,
    },
    maxDiscountAmount: {
      type: Number,
      min: 0,
    },
    applicableTo: {
      type: String,
      enum: Object.values(DiscountApplicableTo),
      required: true,
      index: true,
    },
    applicableIds: [
      {
        type: Schema.Types.ObjectId,
        refPath: function (this: DiscountDocument) {
          switch (this.applicableTo) {
            case DiscountApplicableTo.Courses:
              return 'Course';
            case DiscountApplicableTo.Groups:
              return 'Group';
            case DiscountApplicableTo.Subscriptions:
              return 'Subscription';
            default:
              return 'Course';
          }
        },
      },
    ],
    validFrom: {
      type: Date,
      required: true,
      index: true,
    },
    validUntil: {
      type: Date,
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    usedByUsers: [discountUserUsageSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for performance
discountSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });
discountSchema.index({ type: 1, isActive: 1 });
discountSchema.index({ code: 1, isActive: 1 });
discountSchema.index({ applicableTo: 1, applicableIds: 1 });
discountSchema.index({ currentUsage: 1, maxUsage: 1 });
discountSchema.index({ createdAt: -1 });

// Virtual for checking if discount is currently valid
discountSchema.virtual('isValid').get(function (this: DiscountDocument) {
  const now = new Date();
  return this.isActive && this.validFrom <= now && this.validUntil >= now;
});

// Virtual for checking if usage limit is reached
discountSchema.virtual('isUsageLimitReached').get(function (this: DiscountDocument) {
  if (!this.maxUsage) return false;
  return this.currentUsage >= this.maxUsage;
});

// Virtual for remaining usage count
discountSchema.virtual('remainingUsage').get(function (this: DiscountDocument) {
  if (!this.maxUsage) return null;
  return Math.max(0, this.maxUsage - this.currentUsage);
});

// Virtual for formatted discount value
discountSchema.virtual('formattedValue').get(function (this: DiscountDocument) {
  switch (this.type) {
    case DiscountType.Percentage:
      return `${this.value}%`;
    case DiscountType.FixedAmount:
      return `${this.value}`;
    case DiscountType.BuyXGetY:
      return `Buy ${this.value} Get Y`;
    default:
      return String(this.value);
  }
});

// Pre-save middleware to update status based on dates and usage
discountSchema.pre('save', function (next) {
  const now = new Date();

  // Auto-deactivate if past valid date
  if (this.validUntil < now && this.isActive) {
    this.isActive = false;
  }

  // Auto-deactivate if usage limit reached
  if (this.maxUsage && this.currentUsage >= this.maxUsage && this.isActive) {
    this.isActive = false;
  }

  next();
});

// Methods for discount calculations
discountSchema.methods['calculateDiscountAmount'] = function (this: DiscountDocument, originalAmount: number): number {
  const now = new Date();
  const isValid = this.isActive && this.validFrom <= now && this.validUntil >= now;
  const isUsageLimitReached = this.maxUsage ? this.currentUsage >= this.maxUsage : false;

  if (!isValid || isUsageLimitReached) {
    return 0;
  }

  let discountAmount = 0;

  switch (this.type) {
    case DiscountType.FixedAmount:
      discountAmount = this.value;
      break;
    case DiscountType.Percentage:
      discountAmount = (originalAmount * this.value) / 100;
      break;
    case DiscountType.BuyXGetY:
      // This requires special handling in business logic
      discountAmount = 0;
      break;
    default:
      discountAmount = 0;
  }

  // Apply maximum discount limit if set
  if (this.maxDiscountAmount) {
    discountAmount = Math.min(discountAmount, this.maxDiscountAmount);
  }

  return Math.round(discountAmount * 100) / 100; // Round to 2 decimal places
};

export const DiscountModel = mongoose.model<DiscountDocument>('Discount', discountSchema);
