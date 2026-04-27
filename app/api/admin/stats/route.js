import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/config/db';
import { verifyToken } from '@/lib/middleware/auth';
import User from '@/lib/models/userSchema';
import Course from '@/lib/models/courseSchema';
import Enrollment from '@/lib/models/enrollmentSchema';

export async function GET(request) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Access denied. Admin only.' }, { status: 403 });
    }
    
    const [totalStudents, totalCourses, activeEnrollments, pendingPayments, completedCourses, revenueResult] = await Promise.all([
      User.countDocuments({ role: 'STUDENT' }),
      Course.countDocuments({}),
      Enrollment.countDocuments({ status: 'active' }),
      Enrollment.countDocuments({ paymentStatus: 'pending' }),
      Enrollment.countDocuments({ status: 'completed' }),
      Enrollment.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    return NextResponse.json({
      totalStudents,
      totalCourses,
      totalRevenue,
      activeEnrollments,
      pendingPayments,
      completedCourses
    });
  } catch (error) {
    if (error.message === 'Invalid or expired token' || error.message === 'No token provided') {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Error fetching stats' }, { status: 500 });
  }
}