import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import connectDB from '../../../../../../lib/config/db';
import Enrollment from '@/lib/models/enrollmentSchema';

export async function POST(request, { params }) {
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
    const { id } = await params;
    
    // Find and delete enrollment
    const enrollment = await Enrollment.findById(id)
      .populate('user', 'firstName lastName email')
      .populate('course', 'title');
    
    if (!enrollment) {
      return NextResponse.json(
        { message: 'Payment not found' },
        { status: 404 }
      );
    }
    
    // Delete the enrollment
    await Enrollment.findByIdAndDelete(id);
    
    // TODO: Send rejection email to student
    // await sendPaymentRejection({
    //   userName: enrollment.user.name,
    //   userEmail: enrollment.user.email,
    //   courseName: enrollment.course.title,
    //   reason: 'Payment could not be verified'
    // });
    
    return NextResponse.json({
      message: 'Payment rejected and enrollment deleted'
    });
  } catch (error) {
    console.error('Error rejecting payment:', error);
    return NextResponse.json(
      { message: 'Error rejecting payment', error: error.message },
      { status: 500 }
    );
  }
}