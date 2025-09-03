import { Types } from 'mongoose';
import { Session as SharedSession, AttendanceRecord as SharedAttendanceRecord } from '@schoola/types/src';
import { BaseDocument } from './mongodb.base.types';

// MongoDB-compatible Attendance Record subdocument
export interface AttendanceRecordDocument extends Omit<SharedAttendanceRecord, 'studentId' | 'sessionId'> {
  studentId: Types.ObjectId;
  sessionId: Types.ObjectId;
}

// MongoDB-compatible Session document type
export interface SessionDocument
  extends Omit<SharedSession, 'id' | 'groupId' | 'courseId' | 'teacherId' | 'locationId' | 'attendanceRecords'>,
    BaseDocument {
  groupId: Types.ObjectId;
  courseId: Types.ObjectId;
  teacherId: Types.ObjectId;
  locationId: Types.ObjectId;
  attendanceRecords: AttendanceRecordDocument[];
}

// Input types for creating/updating session documents
export type SessionCreateInput = Omit<SessionDocument, keyof BaseDocument>;
export type SessionUpdateInput = Partial<Omit<SessionDocument, keyof BaseDocument>> & { _id: Types.ObjectId };
