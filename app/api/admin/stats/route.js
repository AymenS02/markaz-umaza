import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/config/db';
import User from '@/lib/models/userSchema';
import Course from '@/lib/models/courseSchema';
import Enrollment from '@/lib/models/enrollmentSchema';

export async function GET() {
  try {
    await connectDB();
    
    const [totalStudents, courses, enrollments] = await Promise.all([
      User.countDocuments({ role: 'STUDENT' }),
      Course.find({}),
      Enrollment.find({}).populate('course')
    ]);

    const activeEnrollments = enrollments.filter(e => e.status === 'active').length;
    const pendingPayments = enrollments.filter(e => e.paymentStatus === 'pending').length;
    const completedCourses = enrollments.filter(e => e.status === 'completed').length;
    const totalRevenue = enrollments
      .filter(e => e.paymentStatus === 'completed')
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    return NextResponse.json({
      totalStudents,
      totalCourses: courses.length,
      totalRevenue,
      activeEnrollments,
      pendingPayments,
      completedCourses
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}