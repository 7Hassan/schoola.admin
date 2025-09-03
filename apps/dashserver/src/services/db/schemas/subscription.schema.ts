import mongoose, { Schema } from 'mongoose';
import { SubscriptionDocument } from '../../../types';
import { SubscriptionType } from '@schoola/types/src';
import { costSchema } from './shared.schemas';

const subscriptionSchema = new Schema<SubscriptionDocument>(
  {
    type: {
      type: String,
      enum: Object.values(SubscriptionType),
      required: true,
      index: true,
    },
    cost: {
      type: costSchema,
      required: true,
    },
    numberOfLecturesIncluded: {
      type: Number,
      required: true,
      min: 1,
    },
    studentsEnrolled: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
      index: true,
    },
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for performance
subscriptionSchema.index({ type: 1, isActive: 1 });
subscriptionSchema.index({ validFrom: 1, validUntil: 1 });
subscriptionSchema.index({ isActive: 1, studentsEnrolled: -1 });

export const SubscriptionModel = mongoose.model<SubscriptionDocument>('Subscription', subscriptionSchema);
export { subscriptionSchema };
