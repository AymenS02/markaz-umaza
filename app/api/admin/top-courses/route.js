import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/config/db';
import { verifyToken } from '@/lib/middleware/auth';
import Course from '@/lib/models/courseSchema';

export async function GET(request) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Access denied. Admin only.' }, { status: 403 });
    }

    const courses = await Course.find({})
      .sort({ enrolledStudents: -1 })
      .limit(5);

    const topCourses = courses.map(c => ({
      title: c.title,
      enrolledStudents: c.enrolledStudents || 0,
      revenue: (c.enrolledStudents || 0) * (c.price || 0)
    }));

    return NextResponse.json(topCourses);
  } catch (error) {
    if (error.message === 'Invalid or expired token' || error.message === 'No token provided') {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Error fetching top courses' }, { status: 500 });
  }
}