import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/config/db';
import Course from '@/lib/models/courseSchema';

export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find({}).sort({ createdAt: -1 });
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching courses', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const course = await Course.create(body);
    
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating course', error: error.message },
      { status: 500 }
    );
  }
}