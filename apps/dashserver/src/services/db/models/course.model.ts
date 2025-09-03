import { courseSchema } from '../schemas/course.schema';
import mongoose from 'mongoose';
import { CourseDocument } from '../../../types';

const Course = mongoose.model<CourseDocument>('Course', courseSchema);
export default Course;
