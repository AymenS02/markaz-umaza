import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/config/db';
import User from '@/lib/models/userSchema';
import Enrollment from '@/lib/models/enrollmentSchema';

export async function GET() {
  try {
    await connectDB();
    
    const students = await User.find({ role: 'USER' }).sort({ createdAt: -1 });
    
    // Attach enrollments to each student
    const studentsWithEnrollments = await Promise.all(
      students.map(async (student) => {
        const enrollments = await Enrollment.find({ user: student._id })
          .populate('course', 'title');
        
        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          role: student.role,
          status: student.status || 'active',
          createdAt: student.createdAt,
          enrollments: enrollments.map(e => ({
            courseName: e.course?.title,
            status: e.status,
            enrolledAt: e.createdAt
          }))
        };
      })
    );

    return NextResponse.json(studentsWithEnrollments);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}