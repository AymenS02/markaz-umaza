// app/api/student/courses/[courseId]/quizzes/[quizId]/submit/route.js
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
    return null;
  }
}

export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { quizId } = await params;
    const body = await request.json();
    const { attemptId, timeSpent } = body;

    const attempt = await QuizAttempt.findOne({
      _id: attemptId,
      user: user._id,
      quiz: quizId,
      status: 'in_progress'
    });

    if (!attempt) {
      return NextResponse.json({ message: 'Attempt not found' }, { status: 404 });
    }

    // Mark as submitted
    attempt.status = 'submitted';
    attempt.submittedAt = new Date();
    attempt.timeSpent = timeSpent;

    // Auto-grade multiple choice questions
    await attempt.autoGradeMultipleChoice();
    
    await attempt.save();

    return NextResponse.json({
      message: 'Quiz submitted successfully',
      attempt: {
        _id: attempt._id,
        status: attempt.status,
        scorePercentage: attempt.scorePercentage,
        needsGrading: attempt.needsGrading
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { message: 'Failed to submit quiz', error: error.message },
      { status: 500 }
    );
  }
}