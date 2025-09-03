import { Types } from 'mongoose';
import { PaymentPlan as SharedPaymentPlan, PaymentInstallment, GroupSubscription } from '@schoola/types/src';
import { BaseDocument } from './mongodb.base.types';

// MongoDB-compatible Payment Installment subdocument
export interface PaymentInstallmentDocument extends Omit<PaymentInstallment, 'id' | 'paymentPlanId' | 'paymentId'> {
  _id: Types.ObjectId;
  paymentPlanId: Types.ObjectId;
  paymentId?: Types.ObjectId;
}

// MongoDB-compatible Payment Plan document type
export interface PaymentPlanDocument
  extends Omit<SharedPaymentPlan, 'id' | 'studentId' | 'groupId' | 'subscriptionId' | 'installments'>,
    BaseDocument {
  studentId: Types.ObjectId;
  groupId: Types.ObjectId;
  subscriptionId?: Types.ObjectId;
  installments: PaymentInstallmentDocument[];
}

// MongoDB-compatible Subscription subdocument for groups
export interface SubscriptionDocument extends Omit<GroupSubscription, 'id'> {
  _id: Types.ObjectId;
}

// Input types for creating/updating payment plan documents
export type PaymentPlanCreateInput = Omit<PaymentPlanDocument, keyof BaseDocument>;
export type PaymentPlanUpdateInput = Partial<Omit<PaymentPlanDocument, keyof BaseDocument>> & { _id: Types.ObjectId };
