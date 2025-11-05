import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import connectDB from '../../../../../../lib/config/db';
import Enrollment from '@/lib/models/enrollmentSchema';
import Course from '@/lib/models/courseSchema';

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
    
    // Find enrollment
    const enrollment = await Enrollment.findById(id)
      .populate('user', 'firstName lastName email')
      .populate('course', 'title code');
    
    if (!enrollment) {
      return NextResponse.json(
        { message: 'Payment not found' },
        { status: 404 }
      );
    }
    
    // Update payment status
    enrollment.paymentStatus = 'completed';
    enrollment.status = 'active';
    enrollment.enrolledAt = new Date();
    await enrollment.save();
    
    // Update course enrolled students count
    await Course.findByIdAndUpdate(
      enrollment.course._id,
      { $inc: { enrolledStudents: 1 } }
    );
    
    // TODO: Send confirmation email to student
    // await sendEnrollmentConfirmation({
    //   userName: enrollment.user.name,
    //   userEmail: enrollment.user.email,
    //   courseName: enrollment.course.title,
    //   whatsappLink: enrollment.course.whatsappLink,
    //   telegramLink: enrollment.course.telegramLink
    // });
    
    return NextResponse.json({
      message: 'Payment approved successfully',
      enrollment
    });
  } catch (error) {
    console.error('Error approving payment:', error);
    return NextResponse.json(
      { message: 'Error approving payment', error: error.message },
      { status: 500 }
    );
  }
}