import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import connectDB from '@/lib/mongodb';
import Course from '@/models/Course';
import Enrollment from '@/models/Enrollment';

export async function POST(request) {
  try {
    // Verify user is authenticated
    const user = await verifyToken(request);
    
    await connectDB();
    const body = await request.json();
    
    const { courseId, etransferEmail, amount } = body;
    
    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: user._id,
      course: courseId
    });
    
    if (existingEnrollment) {
      return NextResponse.json(
        { message: 'Already enrolled in this course' },
        { status: 400 }
      );
    }
    
    // Create enrollment with pending payment status
    const enrollment = await Enrollment.create({
      user: user._id,
      course: courseId,
      paymentMethod: 'etransfer',
      paymentStatus: 'pending',
      etransferEmail: etransferEmail,
      amount: amount,
      status: 'pending_payment'
    });
    
    // Send notification email to admin
    await sendAdminNotification({
      userName: user.name,
      userEmail: user.email,
      courseName: course.title,
      amount: amount,
      etransferEmail: etransferEmail,
      enrollmentId: enrollment._id
    });
    
    // Send confirmation email to user
    await sendUserConfirmation({
      userName: user.name,
      userEmail: user.email,
      courseName: course.title,
      amount: amount
    });
    
    return NextResponse.json({
      message: 'Enrollment request submitted successfully',
      enrollmentId: enrollment._id
    }, { status: 201 });
    
  } catch (error) {
    console.error('Enrollment error:', error);
    
    if (error.message === 'Invalid or expired token' || error.message === 'No token provided') {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { message: 'Error processing enrollment', error: error.message },
      { status: 500 }
    );
  }
}

// Helper function to send admin notification
async function sendAdminNotification(data) {
  // Implement your email sending logic here
  // Using Resend, SendGrid, Nodemailer, etc.
  console.log('Admin notification:', data);
}

// Helper function to send user confirmation
async function sendUserConfirmation(data) {
  // Implement your email sending logic here
  console.log('User confirmation:', data);
}