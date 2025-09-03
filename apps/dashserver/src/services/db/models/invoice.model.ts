import mongoose from 'mongoose';
import { invoiceSchema } from '../schemas/invoice.schema';
import { InvoiceDocument } from '../../../types';

const InvoiceModel = mongoose.model<InvoiceDocument>('Invoice', invoiceSchema);

export default InvoiceModel;
