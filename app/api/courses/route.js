import { NextResponse } from 'next/server';
import connectDB from '../../../lib/config/db';
import Course from '@/lib/models/courseSchema';

export async function GET(request) {
  try {
    await connectDB();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // current, upcoming, past
    const level = searchParams.get('level'); // beginner, intermediate, advanced
    const limit = parseInt(searchParams.get('limit')) || 0; // Default: no limit
    const sort = searchParams.get('sort') || 'recent'; // recent, oldest, popular
    
    // Build query
    let query = {};
    if (status) {
      query.courseStatus = status;
    }
    if (level) {
      query.difficultyLevel = level;
    }
    
    // Build sort criteria
    let sortCriteria = {};
    switch (sort) {
      case 'recent':
        sortCriteria = { createdAt: -1 }; // Newest first
        break;
      case 'oldest':
        sortCriteria = { createdAt: 1 }; // Oldest first
        break;
      case 'popular':
        sortCriteria = { enrolledStudents: -1 }; // Most students first
        break;
      case 'price-low':
        sortCriteria = { price: 1 }; // Lowest price first
        break;
      case 'price-high':
        sortCriteria = { price: -1 }; // Highest price first
        break;
      default:
        sortCriteria = { createdAt: -1 };
    }
    
    // Fetch courses
    let coursesQuery = Course.find(query).sort(sortCriteria);
    
    // Apply limit if specified
    if (limit > 0) {
      coursesQuery = coursesQuery.limit(limit);
    }
    
    const courses = await coursesQuery.lean();
    
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { message: 'Error fetching courses', error: error.message },
      { status: 500 }
    );
  }
}