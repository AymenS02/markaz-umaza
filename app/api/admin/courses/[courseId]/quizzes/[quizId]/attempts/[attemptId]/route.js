// app/api/admin/courses/[courseId]/quizzes/[quizId]/attempts/[attemptId]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/config/db';
import QuizAttempt from '@/lib/models/quizAttemptSchema';
import Quiz from '@/lib/models/quizSchema';
import User from '@/lib/models/userSchema';
import jwt from 'jsonwebtoken';

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

    const { attemptId } = await params;
    
    const attempt = await QuizAttempt.findById(attemptId)
      .populate('user', 'firstName lastName email')
      .populate('quiz');

    if (!attempt) {
      return NextResponse.json({ message: 'Attempt not found' }, { status: 404 });
    }

    return NextResponse.json(attempt, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching attempt:', error);
    return NextResponse.json(
      { message: 'Failed to fetch attempt', error: error.message },
      { status: 500 }
    );
  }
}