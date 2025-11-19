// app/api/student/courses/[courseId]/quizzes/[quizId]/questions/route.js
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

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, quizId } = await params;
    const { searchParams } = new URL(request.url);
    const attemptId = searchParams.get('attemptId');

    if (!attemptId) {
      return NextResponse.json({ message: 'Attempt ID required' }, { status: 400 });
    }
    
    // Verify enrollment
    const enrollment = await Enrollment.findOne({
      user: user._id,
      course: courseId,
      status: 'active'
    });
    
    if (!enrollment) {
      return NextResponse.json({ message: 'Not enrolled' }, { status: 403 });
    }

    // Get attempt
    const attempt = await QuizAttempt.findOne({
      _id: attemptId,
      user: user._id,
      quiz: quizId
    });

    if (!attempt) {
      return NextResponse.json({ message: 'Attempt not found' }, { status: 404 });
    }

    if (attempt.status !== 'in_progress') {
      return NextResponse.json({ message: 'Attempt already submitted' }, { status: 403 });
    }

    // Get quiz with questions (hide correct answers and instructor notes)
    const quiz = await Quiz.findById(quizId);
    
    const questionsForStudent = quiz.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      questionType: q.questionType,
      order: q.order,
      pointsWorth: q.pointsWorth,
      options: q.questionType === 'multiple_choice' 
        ? q.options.map(opt => ({ text: opt.text })) // Don't send isCorrect
        : []
    }));

    return NextResponse.json({
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        totalPoints: quiz.totalPoints,
        questions: questionsForStudent
      },
      attempt: {
        _id: attempt._id,
        attemptNumber: attempt.attemptNumber,
        startedAt: attempt.startedAt,
        answers: attempt.answers
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json(
      { message: 'Failed to fetch questions', error: error.message },
      { status: 500 }
    );
  }
}