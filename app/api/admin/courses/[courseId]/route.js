// app/api/admin/courses/[courseId]/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/lib/config/db';
import Course from '@/lib/models/courseSchema';
import Quiz from '@/lib/models/quizSchema';
import QuizAttempt from '@/lib/models/quizAttemptSchema';
import CourseModule from '@/lib/models/courseModuleSchema';
import Enrollment from '@/lib/models/enrollmentSchema';
import User from '@/lib/models/userSchema';
import jwt from 'jsonwebtoken';

async function verifyAdmin(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    return user?.role === 'ADMIN' ? user : null;
  } catch (error) {
    return null;
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await params;

    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { message: 'Error fetching course', error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId } = await params;

    console.log('Updating course:', courseId, 'with data:', body);

    const course = await Course.findByIdAndUpdate(courseId, body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { message: 'Error updating course', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await params;

    console.log('Deleting course:', courseId);

    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    // Cascade delete related data
    console.log(`Starting cascade deletion for course ${courseId}`);

    // 1. Delete all quizzes for this course
    const quizzes = await Quiz.find({ course: courseId });
    const quizIds = quizzes.map(q => q._id);
    
    if (quizIds.length > 0) {
      // Delete all quiz attempts for these quizzes
      const attemptsResult = await QuizAttempt.deleteMany({ quiz: { $in: quizIds } });
      console.log(`Deleted ${attemptsResult.deletedCount} quiz attempts`);

      // Delete all quizzes
      const quizzesResult = await Quiz.deleteMany({ course: courseId });
      console.log(`Deleted ${quizzesResult.deletedCount} quizzes`);
    }

    // 2. Delete all course modules
    const modulesResult = await CourseModule.deleteMany({ courseId });
    console.log(`Deleted ${modulesResult.deletedCount} course modules`);

    // 3. Delete all enrollments
    const enrollmentsResult = await Enrollment.deleteMany({ course: courseId });
    console.log(`Deleted ${enrollmentsResult.deletedCount} enrollments`);

    // 4. Finally delete the course
    await Course.findByIdAndDelete(courseId);
    console.log(`Successfully deleted course ${courseId}`);

    return NextResponse.json({ 
      message: 'Course deleted successfully',
      details: {
        courseId,
        quizzesDeleted: quizzes.length,
        attemptsDeleted: quizIds.length > 0 ? 'multiple' : 0,
        modulesDeleted: modulesResult.deletedCount,
        enrollmentsDeleted: enrollmentsResult.deletedCount
      }
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { message: 'Error deleting course', error: error.message },
      { status: 500 }
    );
  }
}