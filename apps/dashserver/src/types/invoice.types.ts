import { Types } from 'mongoose';
import { Invoice as SharedInvoice, InvoiceItem, InvoiceDiscount, InvoiceTax } from '@schoola/types/src';
import { BaseDocument } from './mongodb.base.types';

// MongoDB-compatible Invoice Item subdocument
export interface InvoiceItemDocument extends Omit<InvoiceItem, 'id' | 'courseId' | 'sessionId' | 'subscriptionId'> {
  _id: Types.ObjectId;
  courseId?: Types.ObjectId;
  sessionId?: Types.ObjectId;
  subscriptionId?: Types.ObjectId;
}

// MongoDB-compatible Invoice Discount subdocument
export interface InvoiceDiscountDocument extends Omit<InvoiceDiscount, 'id'> {
  _id: Types.ObjectId;
}

// MongoDB-compatible Invoice Tax subdocument
export interface InvoiceTaxDocument extends Omit<InvoiceTax, 'id'> {
  _id: Types.ObjectId;
}

// MongoDB-compatible Invoice document type
export interface InvoiceDocument
  extends Omit<
      SharedInvoice,
      'id' | 'studentId' | 'groupId' | 'subscriptionId' | 'items' | 'discounts' | 'taxes' | 'paymentId'
    >,
    BaseDocument {
  studentId: Types.ObjectId;
  groupId: Types.ObjectId;
  subscriptionId?: Types.ObjectId;
  items: InvoiceItemDocument[];
  discounts: InvoiceDiscountDocument[];
  taxes: InvoiceTaxDocument[];
  paymentId?: Types.ObjectId;
}

// Input types for creating/updating invoice documents
export type InvoiceCreateInput = Omit<InvoiceDocument, keyof BaseDocument>;
export type InvoiceUpdateInput = Partial<Omit<InvoiceDocument, keyof BaseDocument>> & { _id: Types.ObjectId };
