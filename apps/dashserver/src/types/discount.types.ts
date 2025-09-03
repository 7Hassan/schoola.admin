import { Types } from 'mongoose';
import { Discount as SharedDiscount, DiscountUserUsage, DiscountUsage } from '@schoola/types/src';
import { BaseDocument } from './mongodb.base.types';

// MongoDB-compatible Discount User Usage subdocument
export interface DiscountUserUsageDocument extends Omit<DiscountUserUsage, 'userId' | 'transactionIds'> {
  userId: Types.ObjectId;
  transactionIds: Types.ObjectId[];
}

// MongoDB-compatible Discount Usage document type
export interface DiscountUsageDocument
  extends Omit<DiscountUsage, 'id' | 'discountId' | 'studentId' | 'transactionId'>,
    BaseDocument {
  discountId: Types.ObjectId;
  studentId: Types.ObjectId;
  transactionId: Types.ObjectId;
}

// MongoDB-compatible Discount document type
export interface DiscountDocument
  extends Omit<SharedDiscount, 'id' | 'applicableIds' | 'createdBy' | 'usedByUsers'>,
    BaseDocument {
  applicableIds?: Types.ObjectId[];
  createdBy: Types.ObjectId;
  usedByUsers: DiscountUserUsageDocument[];
}

// Input types for creating/updating discount documents
export type DiscountCreateInput = Omit<DiscountDocument, keyof BaseDocument>;
export type DiscountUpdateInput = Partial<Omit<DiscountDocument, keyof BaseDocument>> & { _id: Types.ObjectId };
