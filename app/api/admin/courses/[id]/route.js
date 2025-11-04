// /api/admin/courses/[id]/route.js

import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/config/db';
import Course from '@/lib/models/courseSchema';

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = await params;

    const course = await Course.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating course', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting course', error: error.message },
      { status: 500 }
    );
  }
}
