import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/config/db';
import { verifyToken } from '@/lib/middleware/auth';
import User from '@/lib/models/userSchema';
import Enrollment from '@/lib/models/enrollmentSchema';

export async function GET(request) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Access denied. Admin only.' }, { status: 403 });
    }

    const students = await User.find({ role: 'STUDENT' }).sort({ createdAt: -1 });

    const studentIds = students.map(s => s._id);

    // Fetch all enrollments for all students in one query instead of N+1
    const allEnrollments = await Enrollment.find({ user: { $in: studentIds } })
      .populate('course', 'title');

    const enrollmentsByStudent = allEnrollments.reduce((map, e) => {
      const key = e.user.toString();
      if (!map[key]) map[key] = [];
      map[key].push({
        courseName: e.course?.title,
        status: e.status,
        enrolledAt: e.createdAt
      });
      return map;
    }, {});

    const studentsWithEnrollments = students.map(student => ({
      _id: student._id,
      name: student.firstName + ' ' + student.lastName,
      email: student.email,
      phone: student.phone,
      role: student.role,
      createdAt: student.createdAt,
      enrollments: enrollmentsByStudent[student._id.toString()] || []
    }));

    return NextResponse.json(studentsWithEnrollments);
  } catch (error) {
    if (error.message === 'Invalid or expired token' || error.message === 'No token provided') {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Error fetching students' }, { status: 500 });
  }
}