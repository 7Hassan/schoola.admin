import mongoose from 'mongoose';
import { paymentSchema, transactionSchema } from '../schemas/payment.schema';
import { PaymentDocument, TransactionDocument } from '../../../types';

export const PaymentModel = mongoose.model<PaymentDocument>('Payment', paymentSchema);
export const TransactionModel = mongoose.model<TransactionDocument>('Transaction', transactionSchema);

export default PaymentModel;
