import { studentSchema } from '../schemas/student.schema';
import mongoose from 'mongoose';

const Student = mongoose.model('Student', studentSchema);
export default Student;
