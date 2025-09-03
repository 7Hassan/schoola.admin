import { Types } from 'mongoose';
import { Group as SharedGroup, GroupCourse, TeacherAssignment } from '@schoola/types/src';
import { BaseDocument } from './mongodb.base.types';

// MongoDB-compatible Group course subdocument
export interface GroupCourseDocument extends Omit<GroupCourse, 'courseId'> {
  courseId: Types.ObjectId;
}

// MongoDB-compatible Teacher assignment subdocument
export interface TeacherAssignmentDocument extends Omit<TeacherAssignment, 'teacherId' | 'courseId' | 'assignedSessions'> {
  teacherId: Types.ObjectId;
  courseId: Types.ObjectId;
  assignedSessions: Types.ObjectId[];
}

// MongoDB-compatible Group document type
export interface GroupDocument
  extends Omit<SharedGroup, 'id' | 'courses' | 'teacherAssignments' | 'studentIds' | 'locationId'>,
    BaseDocument {
  courses: GroupCourseDocument[];
  teacherAssignments: TeacherAssignmentDocument[];
  studentIds: Types.ObjectId[];
  locationId: Types.ObjectId;
}

// Input types for creating/updating group documents
export type GroupCreateInput = Omit<GroupDocument, keyof BaseDocument>;
export type GroupUpdateInput = Partial<Omit<GroupDocument, keyof BaseDocument>> & { _id: Types.ObjectId };
