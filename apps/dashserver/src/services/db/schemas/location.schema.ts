import { Schema } from 'mongoose';
import { LocationDocument, EntityStatus } from '../../../types/index.js';
import { addressSchema } from './shared.schemas.js';

const locationSchema = new Schema<LocationDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    address: {
      type: addressSchema,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      index: true,
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: Object.values(EntityStatus),
      default: EntityStatus.Active,
      required: true,
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
locationSchema.index({ name: 1, status: 1 });
locationSchema.index({ 'address.city': 1, 'address.state': 1 });
locationSchema.index({ capacity: 1, status: 1 });

// Virtual for full address
locationSchema.virtual('fullAddress').get(function (this: LocationDocument) {
  const addr = this.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`;
});

export { locationSchema };
