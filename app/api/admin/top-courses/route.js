import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/config/db';
import Course from '@/lib/models//courseSchema';

export async function GET() {
  try {
    await connectDB();
    
    const courses = await Course.find({})
      .sort({ enrolledStudents: -1 })
      .limit(5);

    const topCourses = courses.map(c => ({
      title: c.title,
      enrolledStudents: c.enrolledStudents || 0,
      revenue: (c.enrolledStudents || 0) * (c.price || 0)
    }));

    return NextResponse.json(topCourses);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}