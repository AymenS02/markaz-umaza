import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/config/db';
import Course from '@/lib/models/courseSchema';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const course = await Course.findById(id);
    
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