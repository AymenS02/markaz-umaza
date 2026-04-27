// app/api/enrollments/my-enrollments/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/config/db';
import Enrollment from '@/lib/models/enrollmentSchema';
import { verifyToken } from '@/lib/middleware/auth';

export async function GET(request) {
  try {
    await connectDB();
    
    const user = await verifyToken(request);

    const enrollments = await Enrollment.find({ user: user._id })
      .populate('course', 'title instructor price difficultyLevel')
      .sort({ enrolledAt: -1 });

    return NextResponse.json(enrollments, { status: 200 });
    
  } catch (error) {
    if (error.message === 'Invalid or expired token' || error.message === 'No token provided') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { message: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}