import { Types } from 'mongoose';
import { Teacher as SharedTeacher } from '@schoola/types/src';
import { BaseDocument } from './mongodb.base.types';

// MongoDB-compatible Teacher document type
export interface TeacherDocument extends Omit<SharedTeacher, 'id' | 'assignedGroups'>, BaseDocument {
  employeeId: string;
  assignedGroups: Types.ObjectId[];
}

// Input types for creating/updating teacher documents
export type TeacherCreateInput = Omit<TeacherDocument, keyof BaseDocument | 'employeeId' | 'fullName'>;
export type TeacherUpdateInput = Partial<Omit<TeacherDocument, keyof BaseDocument>> & { _id: Types.ObjectId };
