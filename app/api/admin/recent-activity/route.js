import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/config/db';
import Enrollment from '@/lib/models/enrollmentSchema';
import { formatDistanceToNow } from 'date-fns';

export async function GET() {
  try {
    await connectDB();

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
