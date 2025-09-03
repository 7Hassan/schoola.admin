import mongoose from 'mongoose';
import { discountSchema } from '../schemas/discount.schema';
import { DiscountDocument } from '../../../types';

const DiscountModel = mongoose.model<DiscountDocument>('Discount', discountSchema);

export default DiscountModel;
