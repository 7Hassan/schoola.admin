import { Types } from 'mongoose';
import { Student as SharedStudent } from '@schoola/types/src';
import { BaseDocument } from './mongodb.base.types';

// MongoDB-compatible Student document type
export interface StudentDocument
  extends Omit<SharedStudent, 'id' | 'enrolledCourses' | 'groupIds' | 'authorityId'>,
    BaseDocument {
  enrolledCourses: Types.ObjectId[];
  groupIds: Types.ObjectId[];
  authorityId?: Types.ObjectId;
  // Frontend-friendly optional fields
  childName?: string;
  parentName?: string;
  parentPhone?: any;
  whatsappPhone?: any;
  hasWhatsapp?: boolean;
  contacts?: {
    parent?: { phone?: any; whatsapp?: any };
    child?: { phone?: any; whatsapp?: any };
  };
  info?: {
    dateOfBirth?: Date;
    gender?: string;
    address?: any;
    profilePhoto?: string;
  emergencyContact?: any;
  health?: { hasDisease?: boolean; diseaseDetails?: string };
  };
  group?: any;
  paid?: boolean;
}

// Input types for creating/updating student documents
export type StudentCreateInput = Omit<StudentDocument, keyof BaseDocument | 'studentCode' | 'fullName'>;
export type StudentUpdateInput = Partial<Omit<StudentDocument, keyof BaseDocument>> & { _id: Types.ObjectId };
