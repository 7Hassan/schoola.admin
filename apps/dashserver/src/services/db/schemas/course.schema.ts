import mongoose, { Schema } from 'mongoose';
import { nanoid } from 'nanoid';
import { CourseDocument, EntityStatus, CourseLevel, MaterialType } from '../../../types/index.js';
import { Currency } from '@schoola/types/src';

// Age range subdocument schema
const ageRangeSchema = new Schema(
  {
    minAge: { type: Number, required: true, min: 0 },
    maxAge: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

// Material link subdocument schema
const materialLinkSchema = new Schema({
  _id: { type: String, default: () => nanoid() },
  title: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  type: { type: String, enum: Object.values(MaterialType), required: true },
  isRequired: { type: Boolean, default: false },
  description: { type: String, trim: true },
  uploadedAt: { type: Date, default: Date.now },
});

const courseSchema = new Schema<CourseDocument>(
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
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: Object.values(CourseLevel),
      required: true,
      index: true,
    },
    totalLectures: {
      type: Number,
      required: true,
      min: 1,
      index: true,
    },
    lecturesPerWeek: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(EntityStatus),
      default: EntityStatus.Draft,
      required: true,
      index: true,
    },
    validAgeRange: {
      type: ageRangeSchema,
      required: true,
    },
    learningObjectives: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    prerequisites: [
      {
        type: String,
        trim: true,
      },
    ],
    materialLinks: [materialLinkSchema],
    instructorIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        index: true,
      },
    ],
    coverImage: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      enum: Object.values(Currency),
      default: Currency.EGP,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for performance
courseSchema.index({ name: 'text', description: 'text' }); // Text search
courseSchema.index({ status: 1, level: 1 });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ price: 1, currency: 1 });
courseSchema.index({ 'validAgeRange.minAge': 1, 'validAgeRange.maxAge': 1 });

// Virtual for duration in weeks based on lectures
courseSchema.virtual('estimatedDurationWeeks').get(function (this: CourseDocument) {
  return Math.ceil(this.totalLectures / this.lecturesPerWeek);
});

// Pre-save middleware to auto-generate course code if not provided
courseSchema.pre('save', async function (next) {
  if (this.isNew && !this.code) {
    const categoryPrefix = this.category.substring(0, 3).toUpperCase();
    const levelPrefix = this.level.substring(0, 1).toUpperCase();
    const count = await mongoose.model('Course').countDocuments({ category: this.category });
    this.code = `${categoryPrefix}${levelPrefix}${String(count + 1).padStart(3, '0')}`;
  }

  next();
});

export { courseSchema };
