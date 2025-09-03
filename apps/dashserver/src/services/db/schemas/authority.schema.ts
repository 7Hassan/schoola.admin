import mongoose, { Schema } from 'mongoose';
import { AuthorityDocument, EntityStatus, GovernmentType, Country } from '../../../types';
import { addressSchema, contactInfoSchema } from './shared.schemas';

const authoritySchema = new Schema<AuthorityDocument>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      alias: 'id',
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    country: {
      type: String,
      enum: Object.values(Country),
      required: true,
      index: true,
    },
    government: {
      type: String,
      enum: Object.values(GovernmentType),
      required: true,
      index: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    address: {
      type: addressSchema,
      required: true,
    },
    contacts: {
      type: contactInfoSchema,
      required: true,
    },
    studentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        index: true,
      },
    ],
    status: {
      type: String,
      enum: Object.values(EntityStatus),
      default: EntityStatus.Active,
      required: true,
      index: true,
    },
    establishedDate: {
      type: Date,
      index: true,
    },
    website: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    certifications: [
      {
        type: String,
        trim: true,
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
authoritySchema.index({ name: 1, country: 1 });
authoritySchema.index({ government: 1, city: 1 });
authoritySchema.index({ status: 1, country: 1 });

// Virtual for student count
authoritySchema.virtual('studentCount').get(function (this: AuthorityDocument) {
  return this.studentIds.length;
});

export { authoritySchema };
