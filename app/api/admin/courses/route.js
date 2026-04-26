import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/config/db';
import { verifyToken } from '@/lib/middleware/auth';
import Course from '@/lib/models/courseSchema';

export async function GET(request) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Access denied. Admin only.' }, { status: 403 });
    }

    const courses = await Course.find({}).sort({ createdAt: -1 });
    return NextResponse.json(courses);
  } catch (error) {
    if (error.message === 'Invalid or expired token' || error.message === 'No token provided') {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json(
      { message: 'Error fetching courses' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Access denied. Admin only.' }, { status: 403 });
    }

    const body = await request.json();
    const course = await Course.create(body);
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    if (error.message === 'Invalid or expired token' || error.message === 'No token provided') {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json(
      { message: 'Error creating course' },
      { status: 500 }
    );
  }
}