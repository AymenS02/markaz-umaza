import { NextResponse } from 'next/server';
import connectDB from '../../../lib/config/db';
import Course from '@/lib/models/courseSchema';

export async function GET(request) {
  try {
    await connectDB();
    
    // Get query parameters if you want to add filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // current, upcoming, past
    const level = searchParams.get('level'); // beginner, intermediate, advanced
    
    // Build query
    let query = {};
    if (status) {
      query.courseStatus = status;
    }
    if (level) {
      query.difficultyLevel = level;
    }
    
    // Fetch courses sorted by start date (newest first)
    const courses = await Course.find(query)
      .sort({ startDate: -1 })
      .lean(); // Use lean() for better performance
    
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { message: 'Error fetching courses', error: error.message },
      { status: 500 }
    );
  }
}