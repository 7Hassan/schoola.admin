import { Types } from 'mongoose';
import { Student as SharedStudent } from '@schoola/types/src';
import { BaseDocument } from './mongodb.base.types';

// MongoDB-compatible Student document type
export interface StudentDocument
  extends Omit<SharedStudent, 'id' | 'enrolledCourses' | 'groupIds' | 'authorityId'>,
    BaseDocument {
  studentCode: string;
  enrolledCourses: Types.ObjectId[];
  groupIds: Types.ObjectId[];
  authorityId?: Types.ObjectId;
}

// Input types for creating/updating student documents
export type StudentCreateInput = Omit<StudentDocument, keyof BaseDocument | 'studentCode' | 'fullName'>;
export type StudentUpdateInput = Partial<Omit<StudentDocument, keyof BaseDocument>> & { _id: Types.ObjectId };
