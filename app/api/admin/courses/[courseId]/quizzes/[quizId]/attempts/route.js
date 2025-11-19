// app/api/admin/courses/[courseId]/quizzes/[quizId]/attempts/route.js
import { NextResponse } from 'next/server';  // ← ADD THIS LINE
import dbConnect from '@/lib/config/db';
import QuizAttempt from '@/lib/models/quizAttemptSchema';
import Quiz from '@/lib/models/quizSchema';
import User from '@/lib/models/userSchema';
import jwt from 'jsonwebtoken';

// Helper function to verify token and get user
async function verifyAuth(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    await dbConnect();
    const user = await User.findById(decoded.userId);
    
    return user;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { quizId } = await params;
    const { searchParams } = new URL(request.url);
    const needsGrading = searchParams.get('needsGrading');
    
    let query = { quiz: quizId, status: { $in: ['submitted', 'graded'] } };
    
    if (needsGrading === 'true') {
      query.needsGrading = true;
    }
    
    const attempts = await QuizAttempt.find(query)
      .populate('user', 'firstName lastName email')
      .populate('enrollment')
      .sort({ submittedAt: -1 });

    return NextResponse.json(attempts, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return NextResponse.json(
      { message: 'Failed to fetch attempts', error: error.message },
      { status: 500 }
    );
  }
}