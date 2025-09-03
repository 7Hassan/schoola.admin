import mongoose from 'mongoose';
import { groupSchema } from '../schemas/group.schema';
import { GroupDocument } from '../../../types';

const GroupModel = mongoose.model<GroupDocument>('Group', groupSchema);

export default GroupModel;
