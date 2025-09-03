import { teacherSchema } from '../schemas/teacher.schema';
import mongoose from 'mongoose';
import { TeacherDocument } from '../../../types';

const Teacher = mongoose.model<TeacherDocument>('Teacher', teacherSchema);
export default Teacher;
