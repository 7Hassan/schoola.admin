import mongoose, { Schema } from 'mongoose';
import { SessionDocument, AttendanceRecordDocument, SessionStatus, AttendanceStatus } from '../../../types';
import { MaterialType } from '@schoola/types/src';

// SessionType enum (if not available in types package)
export enum SessionType {
  Regular = 'regular',
  Makeup = 'makeup',
  Trial = 'trial',
  Exam = 'exam',
  Review = 'review',
  Extracurricular = 'extracurricular',
}

// Session materials subdocument schema
const sessionMaterialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: Object.values(MaterialType), required: true },
    url: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    isRequired: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now },
    fileSize: { type: Number }, // in bytes
    duration: { type: Number }, // in minutes for videos/audio
    pageCount: { type: Number }, // for PDFs/documents
  },
  { _id: true, timestamps: true },
);

// Session schema
export const sessionSchema = new Schema<SessionDocument>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    sessionNumber: {
      type: Number,
      required: true,
      min: 1,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
      index: true,
    },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
      index: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
      index: true,
    },
    actualStartTime: {
      type: Date,
      index: true,
    },
    actualEndTime: {
      type: Date,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(SessionStatus),
      default: SessionStatus.Scheduled,
      required: true,
      index: true,
    },
    materialLinks: [sessionMaterialSchema],
    attendanceRecords: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Attendance',
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
    recordingUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Attendance schema
export const attendanceSchema = new Schema<AttendanceRecordDocument>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      required: true,
      index: true,
    },
    arrivalTime: {
      type: Date,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
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
sessionSchema.index({ groupId: 1, scheduledDate: 1 });
sessionSchema.index({ teacherId: 1, scheduledDate: 1 });
sessionSchema.index({ locationId: 1, scheduledDate: 1 });
sessionSchema.index({ status: 1, scheduledDate: 1 });
sessionSchema.index({ sessionNumber: 1, courseId: 1 });
sessionSchema.index({ createdAt: -1 });

attendanceSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });
attendanceSchema.index({ studentId: 1, recordedAt: -1 });
attendanceSchema.index({ status: 1, recordedAt: -1 });

// Virtual for actual session duration
sessionSchema.virtual('actualDuration').get(function (this: SessionDocument) {
  if (!this.actualStartTime || !this.actualEndTime) return null;
  return Math.round((this.actualEndTime.getTime() - this.actualStartTime.getTime()) / (1000 * 60)); // in minutes
});

// Virtual for session is in progress
sessionSchema.virtual('isInProgress').get(function (this: SessionDocument) {
  const now = new Date();
  return (
    this.status === SessionStatus.InProgress ||
    (this.status === SessionStatus.Scheduled && this.actualStartTime && this.actualStartTime <= now && !this.actualEndTime)
  );
});

// Virtual for session is overdue
sessionSchema.virtual('isOverdue').get(function (this: SessionDocument) {
  const now = new Date();
  return this.status === SessionStatus.Scheduled && this.scheduledDate < now;
});

// Virtual for is late attendance
attendanceSchema.virtual('isLate').get(function (this: AttendanceRecordDocument) {
  return this.status === AttendanceStatus.Late;
});

export const SessionModel = mongoose.model<SessionDocument>('Session', sessionSchema);
export const AttendanceModel = mongoose.model<AttendanceRecordDocument>('Attendance', attendanceSchema);
