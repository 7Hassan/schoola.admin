import { Types } from 'mongoose';
import { Course as SharedCourse } from '@schoola/types/src';
import { BaseDocument } from './mongodb.base.types';

// MongoDB-compatible Course document type
export interface CourseDocument extends Omit<SharedCourse, 'id' | 'instructorIds'>, BaseDocument {
  instructorIds: Types.ObjectId[];
}

// Input types for creating/updating course documents
export type CourseCreateInput = Omit<CourseDocument, keyof BaseDocument>;
export type CourseUpdateInput = Partial<Omit<CourseDocument, keyof BaseDocument>> & { _id: Types.ObjectId };
