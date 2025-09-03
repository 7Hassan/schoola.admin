import { userSchema } from '../schemas/user.schema';
import mongoose from 'mongoose';
import { UserDocument } from '../../../types';

const User = mongoose.model<UserDocument>('User', userSchema);
export default User;
