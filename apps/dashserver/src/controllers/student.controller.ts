import { Request, Response } from 'express';
import { faker } from '@faker-js/faker';

// Define types for better type safety
interface AuthenticatedRequest extends Request {
  user?: {
    name?: string;
    id?: string;
  };
}

interface StudentData {
  id?: string;
  name: string;
  studentCode: string;
  email: string;
  age: number;
  parentPhone: string;
  group?: string;
  source?: string;
  paid?: boolean;
  info?: string;
  note?: string;
  _modifiedBy?: string;
}

export const getAllStudents = async (req: Request, res: Response): Promise<Response> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = parseInt(req.query['limit'] as string) || 20;
    const skip = (page - 1) * limit;
    
    // Note: Student model needs to be properly imported
    // This is a placeholder until the model is available
    const students: any[] = []; // TODO: Replace with actual Student.find() query
    const total = 0; // TODO: Replace with actual Student.countDocuments()
    
    const data = students.map((student: any) => ({
      id: student._id,
      name: student.name,
      studentCode: student.studentCode,
      parentPhone: student.parentPhone,
      age: student.age,
      email: student.email,
      source: student.source,
      paid: student.paid,
      group: student.group,
      info: student.info,
      note: student.note,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    }));
    
    return res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        skip // Include skip for reference
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch students', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};


export const getStudentById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    // TODO: Replace with actual Student.findById() query
    // const student = await Student.findById(id).populate('group');
    const student = null; // Placeholder until model is available
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        error: 'Student not found',
        requestedId: id
      });
    }
    
    return res.json({
      success: true,
      data: student
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch student', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export const upsertStudent = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const { id, ...data } = req.body;
    
    if (id) {
      // TODO: Replace with actual Student.findById() query
      const student = null; // Placeholder until model is available
      
      if (student) {
        // TODO: Implement update logic
        return res.status(200).json({
          success: true,
          data: student,
          message: 'Student updated successfully'
        });
      }
      console.warn(`⚠️ Student with ID ${id} not found, creating new one`);
    }
    
    // TODO: Replace with actual Student.create() call
    const newStudent = { ...data, id: 'new-student-id' }; // Placeholder
    
    return res.status(201).json({
      success: true,
      data: newStudent,
      message: 'Student created successfully'
    });
  } catch (error) {
    console.error('❌ Error saving student (create/update):', error);
    return res.status(400).json({ 
      success: false,
      error: 'Failed to save student', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};



export const createStudent = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Remove hardcoded bulk creation for production
    const shouldCreateBulk = req.body.createBulk === true;

    if (shouldCreateBulk) {
      const students: StudentData[] = [];
      const count = parseInt(req.body.count as string) || 10; // Default to 10 instead of 100

      for (let i = 1; i <= count; i++) {
        const newStudentData: StudentData = {
          ...req.body,
          name: faker.person.fullName(),
          studentCode: faker.string.alphanumeric(8),
          email: faker.internet.email(),
          age: faker.number.int({ min: 6, max: 18 }),
          parentPhone: faker.phone.number(), // Fixed faker API call
        };

        // Remove any ID fields
        delete newStudentData.id;
        students.push(newStudentData);
      }

      // TODO: Replace with actual Student.insertMany() call
      // const inserted = await Student.insertMany(students, { ordered: true });

      return res.status(201).json({
        success: true,
        message: `✅ Created ${students.length} students successfully`,
        data: { insertedCount: students.length, students: students.slice(0, 5) } // Show first 5 for preview
      });
    }

    // Single student creation
    const studentData: StudentData = req.body;
    // TODO: Replace with actual Student.create() call
    const newStudent = { ...studentData, id: 'new-student-id' }; // Placeholder

    return res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: newStudent
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: 'Failed to create student',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};


export const updateStudent = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // TODO: Replace with actual Student.findById() query
    const student = null; // Placeholder until model is available

    if (!student) {
      return res.status(404).json({ 
        success: false,
        error: 'Student not found' 
      });
    }

    // TODO: Implement actual update logic
    // student._modifiedBy = req.user?.name || 'system';
    // Object.keys(updateData).forEach((key) => {
    //   student[key] = updateData[key];
    // });
    // await student.save();

    const updatedStudent = { ...updateData, id, _modifiedBy: req.user?.name || 'system' };

    return res.json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    console.error('Update student error:', error);
    return res.status(400).json({ 
      success: false,
      error: 'Failed to update student', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteStudent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    // TODO: Replace with actual Student.findByIdAndDelete() query
    // const deleted = await Student.findByIdAndDelete(id);
    const deleted = null; // Placeholder until model is available
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false,
        error: 'Student not found' 
      });
    }

    return res.json({ 
      success: true,
      message: 'Student deleted successfully',
      data: { deletedId: id }
    });
  } catch (error) {
    console.error('Delete student error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to delete student',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteAllStudents = async (_req: Request, res: Response): Promise<Response> => {
  try {
    // TODO: Replace with actual Student.deleteMany() query
    const result = { deletedCount: 0 }; // Placeholder until model is available

    return res.json({
      success: true,
      message: 'All students deleted successfully',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to delete all students',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const searchStudents = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = req.query['q'] as string;
    
    if (!query || query.trim().length < 2) {
      return res.json({
        success: true,
        data: [],
        message: 'Query too short - minimum 2 characters required'
      });
    }

    // TODO: Replace with actual Student.find() query with regex search
    // const regex = new RegExp(query, 'i');
    // const students = await Student.find({
    //   $or: [
    //     { name: { $regex: regex } },
    //     { parentPhone: { $regex: regex } },
    //   ],
    // })
    // .limit(10)
    // .populate({
    //   path: 'group',
    //   select: 'groupCode location schedule price',
    // }).lean();

    const students: any[] = []; // Placeholder until model is available

    return res.json({
      success: true,
      data: students,
      query: query.trim()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to search students',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};