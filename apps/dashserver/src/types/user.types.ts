import { Types } from 'mongoose';
import { BaseDocument } from './mongodb.base.types';
import { UserRole } from '@schoola/types/src';

// User document for authentication and roles
export interface UserDocument extends BaseDocument {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  isVerified?: boolean;
  lastLogin?: Date;
  profilePhoto?: string;
  phone?: string;

  // Reference to specific role document
  studentId?: Types.ObjectId;
  teacherId?: Types.ObjectId;
  adminProfile?: {
    department: string;
    permissions: string[];
  };
}

// Input types for creating/updating user documents
export type UserCreateInput = Omit<UserDocument, keyof BaseDocument>;
export type UserUpdateInput = Partial<Omit<UserDocument, keyof BaseDocument>> & { _id: Types.ObjectId };
