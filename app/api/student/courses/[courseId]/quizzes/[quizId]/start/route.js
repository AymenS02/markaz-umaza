// app/api/student/courses/[courseId]/quizzes/[quizId]/start/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/config/db';
import Enrollment from '@/lib/models/enrollmentSchema';
import Quiz from '@/lib/models/quizSchema';
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
    console.error('Auth verification error:', error);
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

    const { courseId, quizId } = await params;
    
    // Check enrollment
    const enrollment = await Enrollment.findOne({
      user: user._id,
      course: courseId,
      status: 'active'
    });
    
    if (!enrollment) {
      return NextResponse.json(
        { message: 'Not enrolled in this course' },
        { status: 403 }
      );
    }

    // Get quiz
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz || !quiz.isPublished) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    // Check if quiz is available
    const now = new Date();
    if (quiz.availableFrom && new Date(quiz.availableFrom) > now) {
      return NextResponse.json(
        { message: 'Quiz not yet available' },
        { status: 403 }
      );
    }
    
    if (quiz.availableUntil && new Date(quiz.availableUntil) < now) {
      return NextResponse.json(
        { message: 'Quiz no longer available' },
        { status: 403 }
      );
    }

    // Check existing attempts
    const existingAttempts = await QuizAttempt.find({
      quiz: quizId,
      user: user._id,
      enrollment: enrollment._id
    }).sort({ attemptNumber: 1 });

    // Check for in-progress attempt first
    const inProgressAttempt = existingAttempts.find(a => a.status === 'in_progress');
    if (inProgressAttempt) {
      return NextResponse.json({
        message: 'Attempt already in progress',
        attempt: {
          _id: inProgressAttempt._id,
          attemptNumber: inProgressAttempt.attemptNumber,
          startedAt: inProgressAttempt.startedAt
        }
      }, { status: 200 });
    }

    // Check if max attempts reached (only count completed/submitted attempts)
    const completedAttempts = existingAttempts.filter(
      a => a.status === 'submitted' || a.status === 'graded'
    );

    if (completedAttempts.length >= quiz.maxAttempts) {
      return NextResponse.json(
        { message: 'Maximum attempts reached' },
        { status: 403 }
      );
    }

    // Calculate next attempt number
    const attemptNumber = existingAttempts.length > 0 
      ? Math.max(...existingAttempts.map(a => a.attemptNumber)) + 1
      : 1;
    
    // Create new attempt
    const newAttempt = await QuizAttempt.create({
      quiz: quizId,
      user: user._id,
      enrollment: enrollment._id,
      attemptNumber,
      status: 'in_progress',
      totalPointsPossible: quiz.totalPoints,
      answers: quiz.questions.map(q => ({
        questionId: q._id,
        questionType: q.questionType,
        pointsWorth: q.pointsWorth,
        needsGrading: q.questionType === 'text_answer'
      }))
    });

    return NextResponse.json({
      message: 'Quiz attempt started',
      attempt: {
        _id: newAttempt._id,
        attemptNumber: newAttempt.attemptNumber,
        startedAt: newAttempt.startedAt
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error starting quiz:', error);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      // Try to find the existing in-progress attempt
      try {
        const { courseId, quizId } = await params;
        const authHeader = request.headers.get('authorization');
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        const enrollment = await Enrollment.findOne({
          user: user._id,
          course: courseId,
          status: 'active'
        });

        const existingAttempt = await QuizAttempt.findOne({
          quiz: quizId,
          user: user._id,
          enrollment: enrollment._id,
          status: 'in_progress'
        });

        if (existingAttempt) {
          return NextResponse.json({
            message: 'Resuming existing attempt',
            attempt: {
              _id: existingAttempt._id,
              attemptNumber: existingAttempt.attemptNumber,
              startedAt: existingAttempt.startedAt
            }
          }, { status: 200 });
        }
      } catch (innerError) {
        console.error('Error finding existing attempt:', innerError);
      }

      return NextResponse.json(
        { message: 'An attempt already exists. Please refresh the page.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to start quiz', error: error.message },
      { status: 500 }
    );
  }
}