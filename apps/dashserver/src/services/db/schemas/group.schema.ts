import mongoose, { Schema } from 'mongoose';
import { GroupDocument, GroupCourseDocument, TeacherAssignmentDocument } from '../../../types';
import { SubscriptionType, GroupStatus, Currency } from '@schoola/types/src';
import { nanoid } from 'nanoid';

// Session time subdocument schema
const sessionTimeSchema = new Schema(
  {
    day: { type: String, required: true, trim: true },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
  },
  { _id: false },
);

// Group course subdocument schema
const groupCourseSchema = new Schema<GroupCourseDocument>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    lecturesCompleted: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, required: true, default: true },
  },
  { _id: false },
);

// Cost subdocument schema
const costSchema = new Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: Object.values(Currency), required: true },
  },
  { _id: false },
);

// Group subscription subdocument schema
const groupSubscriptionSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    type: { type: String, enum: Object.values(SubscriptionType), required: true },
    cost: costSchema,
    numberOfLecturesIncluded: { type: Number, required: true, min: 1 },
    studentsEnrolled: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, required: true, default: true },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
  },
  { _id: true },
);

// Teacher assignment subdocument schema
const teacherAssignmentSchema = new Schema<TeacherAssignmentDocument>(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    assignedSessions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Session',
      },
    ],
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isActive: { type: Boolean, required: true, default: true },
  },
  { _id: false },
);

const groupSchema = new mongoose.Schema<GroupDocument>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, unique: true, index: true },
    courses: [groupCourseSchema],
    teacherAssignments: [teacherAssignmentSchema],
    studentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    locationId: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
      index: true,
    },
    sessionTimes: [sessionTimeSchema],
    capacity: { type: Number, required: true, min: 1 },
    currentEnrollment: { type: Number, required: true, min: 0, default: 0 },
    subscriptions: [groupSubscriptionSchema],
    status: { type: String, enum: Object.values(GroupStatus), default: GroupStatus.Active, index: true },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, index: true },
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for performance
groupSchema.index({ locationId: 1, status: 1 });
groupSchema.index({ startDate: 1, endDate: 1 });
groupSchema.index({ status: 1, createdAt: -1 });
groupSchema.index({ 'courses.courseId': 1 });
groupSchema.index({ 'teacherAssignments.teacherId': 1 });

// Virtual for checking if group has started
groupSchema.virtual('hasStarted').get(function (this: GroupDocument) {
  return this.startDate <= new Date();
});

// Virtual for checking if group is completed
groupSchema.virtual('isCompleted').get(function (this: GroupDocument) {
  return this.endDate && this.endDate <= new Date();
});

// Virtual for enrollment status
groupSchema.virtual('enrollmentStatus').get(function (this: GroupDocument) {
  const percentage = this.capacity > 0 ? Math.round((this.currentEnrollment / this.capacity) * 100) : 0;
  return {
    enrolled: this.currentEnrollment,
    capacity: this.capacity,
    percentage: percentage,
    isFull: this.currentEnrollment >= this.capacity,
  };
});

// Pre-save middleware for group code generation
groupSchema.pre('save', function (next) {
  // Generate group code if not provided
  if (this.isNew && !this.code) {
    this.code = `GRP-${nanoid()}`;
  }

  // Validate currentEnrollment doesn't exceed capacity
  if (this.currentEnrollment > this.capacity) {
    const error = new Error('Current enrollment cannot exceed capacity');
    return next(error);
  }

  next();
});

export const GroupModel = mongoose.model<GroupDocument>('Group', groupSchema);
export { groupSchema };
