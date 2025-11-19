// app/api/admin/courses/[courseId]/quizzes/[quizId]/attempts/[attemptId]/grade/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/config/db';
import QuizAttempt from '@/lib/models/quizAttemptSchema';
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

// Grade a specific text answer
export async function PUT(request, { params }) {
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
    const body = await request.json();
    const { questionId, pointsEarned, feedback } = body;
    
    const attempt = await QuizAttempt.findById(attemptId);
    
    if (!attempt) {
      return NextResponse.json({ message: 'Attempt not found' }, { status: 404 });
    }
    
    // Use the schema method to grade the answer
    await attempt.gradeTextAnswer(questionId, pointsEarned, feedback, user._id);
    
    // Populate for response
    await attempt.populate('user', 'name email');
    await attempt.populate('quiz');
    
    return NextResponse.json(attempt, { status: 200 });
    
  } catch (error) {
    console.error('Error grading answer:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to grade answer' },
      { status: 500 }
    );
  }
}

// Add overall feedback
export async function POST(request, { params }) {
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
    const body = await request.json();
    const { overallFeedback } = body;
    
    const attempt = await QuizAttempt.findById(attemptId);
    
    if (!attempt) {
      return NextResponse.json({ message: 'Attempt not found' }, { status: 404 });
    }
    
    attempt.overallFeedback = overallFeedback;
    await attempt.save();
    
    await attempt.populate('user', 'name email');
    await attempt.populate('quiz');
    
    return NextResponse.json(attempt, { status: 200 });
    
  } catch (error) {
    console.error('Error adding feedback:', error);
    return NextResponse.json(
      { message: 'Failed to add feedback' },
      { status: 500 }
    );
  }
}