import { Types } from 'mongoose';
import { Payment as SharedPayment, Transaction as SharedTransaction, Refund } from '@schoola/types/src';
import { BaseDocument } from './mongodb.base.types';

// MongoDB-compatible Refund subdocument
export interface RefundDocument extends Omit<Refund, 'id' | 'originalTransactionId'> {
  _id: Types.ObjectId;
  originalTransactionId: Types.ObjectId;
}

// MongoDB-compatible Payment document type
export interface PaymentDocument extends Omit<SharedPayment, 'id' | 'refunds'>, BaseDocument {
  refunds?: RefundDocument[];
}

// MongoDB-compatible Transaction document type
export interface TransactionDocument
  extends Omit<
      SharedTransaction,
      | 'id'
      | 'studentId'
      | 'groupId'
      | 'subscriptionId'
      | 'sessionIds'
      | 'courseIds'
      | 'payment'
      | 'invoiceId'
      | 'createdBy'
      | 'processedBy'
    >,
    BaseDocument {
  studentId: Types.ObjectId;
  groupId: Types.ObjectId;
  subscriptionId?: Types.ObjectId;
  sessionIds?: Types.ObjectId[];
  courseIds?: Types.ObjectId[];
  payment: PaymentDocument;
  invoiceId?: Types.ObjectId;
  createdBy: Types.ObjectId;
  processedBy?: Types.ObjectId;
}

// Input types for creating/updating payment and transaction documents
export type PaymentCreateInput = Omit<PaymentDocument, keyof BaseDocument>;
export type TransactionCreateInput = Omit<TransactionDocument, keyof BaseDocument>;
export type TransactionUpdateInput = Partial<Omit<TransactionDocument, keyof BaseDocument>> & { _id: Types.ObjectId };
