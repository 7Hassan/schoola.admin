import mongoose from 'mongoose';
import { sessionSchema, attendanceSchema } from '../schemas/session.schema';
import { SessionDocument, AttendanceRecordDocument } from '../../../types';

export const SessionModel = mongoose.model<SessionDocument>('Session', sessionSchema);
export const AttendanceModel = mongoose.model<AttendanceRecordDocument>('Attendance', attendanceSchema);

export default SessionModel;
