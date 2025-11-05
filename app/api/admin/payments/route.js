import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import connectDB from '../../../../lib/config/db';
import Enrollment from '@/lib/models/enrollmentSchema';

export async function GET(request) {
  try {
    // Verify admin access
    const user = await verifyToken(request);
    
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Access denied. Admin only.' },
        { status: 403 }
      );
    }
    
    await connectDB();
    
    // Fetch all enrollments with payment info, populate user and course
    const payments = await Enrollment.find({
      paymentMethod: { $exists: true }
    })
      .populate('user', 'firstName lastName email phone')
      .populate('course', 'title code instructor price')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    
    if (error.message === 'Invalid or expired token' || error.message === 'No token provided') {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { message: 'Error fetching payments', error: error.message },
      { status: 500 }
    );
  }
}