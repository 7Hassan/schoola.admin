import { authoritySchema } from '../schemas/authority.schema';
import mongoose from 'mongoose';
import { AuthorityDocument } from '../../../types';

const Authority = mongoose.model<AuthorityDocument>('Authority', authoritySchema);
export default Authority;
