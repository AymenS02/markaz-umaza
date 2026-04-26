import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/config/db';
import { verifyToken } from '@/lib/middleware/auth';
import Enrollment from '@/lib/models/enrollmentSchema';
import { formatDistanceToNow } from 'date-fns';

export async function GET(request) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Access denied. Admin only.' }, { status: 403 });
    }

    const recentEnrollments = await Enrollment.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'firstName lastName email')
      .populate('course', 'title');

    const activity = recentEnrollments.map(e => ({
      type: e.paymentStatus === 'pending' ? 'payment' : 'enrollment',
      message: `${e.user?.firstName || 'User'} ${e.user?.lastName || ''} enrolled in ${e.course?.title || 'Course'}`,
      timestamp: formatDistanceToNow(new Date(e.createdAt), { addSuffix: true })
    }));

    return NextResponse.json(activity);
  } catch (error) {
    if (error.message === 'Invalid or expired token' || error.message === 'No token provided') {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Error fetching activity' }, { status: 500 });
  }
}
