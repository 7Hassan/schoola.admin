import { Types } from 'mongoose';
import { Authority as SharedAuthority } from '@schoola/types/src';
import { BaseDocument } from './mongodb.base.types';

// MongoDB-compatible Authority document type
export interface AuthorityDocument extends Omit<SharedAuthority, 'id' | 'studentIds'>, BaseDocument {
  studentIds: Types.ObjectId[];
}

// Input types for creating/updating authority documents
export type AuthorityCreateInput = Omit<AuthorityDocument, keyof BaseDocument>;
export type AuthorityUpdateInput = Partial<Omit<AuthorityDocument, keyof BaseDocument>> & { _id: Types.ObjectId };
