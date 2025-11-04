import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/config/db';
import Enrollment from '@/lib/models/enrollmentSchema';

export async function GET() {
  try {
    await connectDB();
    
    const recentEnrollments = await Enrollment.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .populate('course', 'title');

    const activity = recentEnrollments.map(e => ({
      type: e.paymentStatus === 'pending' ? 'payment' : 'enrollment',
      message: `${e.user?.name || 'User'} enrolled in ${e.course?.title || 'Course'}`,
      timestamp: new Date(e.createdAt).toRelativeString() // You'll need to add this helper
    }));

    return NextResponse.json(activity);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}