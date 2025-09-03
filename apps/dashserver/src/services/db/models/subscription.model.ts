import { subscriptionSchema } from '../schemas/subscription.schema';
import mongoose from 'mongoose';
import { SubscriptionDocument } from '../../../types';

const Subscription = mongoose.model<SubscriptionDocument>('Subscription', subscriptionSchema);
export default Subscription;
