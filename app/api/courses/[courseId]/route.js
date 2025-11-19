// app/api/courses/[courseId]/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/config/db';
import Course from '@/lib/models/courseSchema';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { courseId } = await params;  // ← Changed from id to courseId
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
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