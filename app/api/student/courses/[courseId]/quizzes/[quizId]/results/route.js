// app/api/student/courses/[courseId]/quizzes/[quizId]/results/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/config/db';
import Enrollment from '@/lib/models/enrollmentSchema';
import Quiz from '@/lib/models/quizSchema';
import QuizAttempt from '@/lib/models/quizAttemptSchema';
import User from '@/lib/models/userSchema';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

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

    console.log('Results API - Params:', { courseId, quizId, attemptId, userId: user._id });

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
      console.error('Results API - Not enrolled:', { userId: user._id, courseId });
      return NextResponse.json({ message: 'Not enrolled' }, { status: 403 });
    }

    // Get attempt - FIXED: Don't filter by quiz in the initial query
    // First try with just attemptId and user
    let attempt = await QuizAttempt.findOne({
      _id: attemptId,
      user: user._id
    });

    console.log('Results API - Attempt lookup result:', {
      found: !!attempt,
      attemptId,
      userId: user._id.toString(),
      attemptUserId: attempt?.user?.toString(),
      attemptQuizId: attempt?.quiz?.toString(),
      quizIdFromParams: quizId
    });

    if (!attempt) {
      console.error('Results API - Attempt not found with just ID and user');
      return NextResponse.json({ message: 'Attempt not found' }, { status: 404 });
    }

    // Verify the quiz matches (after we found the attempt)
    if (attempt.quiz.toString() !== quizId) {
      console.error('Results API - Quiz mismatch:', {
        attemptQuizId: attempt.quiz.toString(),
        requestedQuizId: quizId
      });
      return NextResponse.json({ message: 'Attempt does not belong to this quiz' }, { status: 403 });
    }

    console.log('Results API - Attempt found:', {
      attemptId: attempt._id,
      status: attempt.status,
      score: attempt.scorePercentage,
      needsGrading: attempt.needsGrading
    });

    // Get quiz with questions
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      console.error('Results API - Quiz not found:', { quizId });
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    // Prepare questions with correct answers for review
    const questionsForReview = quiz.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      questionType: q.questionType,
      order: q.order,
      pointsWorth: q.pointsWorth,
      options: q.options || [],
      sampleAnswer: q.sampleAnswer || ''
    }));

    // Check if any questions still need grading
    const needsGrading = attempt.answers.some(a => a.needsGrading);

    // Calculate passed status if not already set
    let passed = attempt.passed;
    if (passed === undefined || passed === null) {
      if (!needsGrading && attempt.fullyGraded) {
        passed = attempt.scorePercentage >= quiz.passingScore;
        
        attempt.passed = passed;
        await attempt.save();
      }
    }

    console.log('Results API - Sending response:', {
      attemptId: attempt._id,
      scorePercentage: attempt.scorePercentage,
      passingScore: quiz.passingScore,
      passed: passed,
      fullyGraded: attempt.fullyGraded,
      needsGrading: needsGrading,
      answersCount: attempt.answers.length,
      questionsCount: questionsForReview.length
    });

    return NextResponse.json({
      attempt: {
        _id: attempt._id,
        attemptNumber: attempt.attemptNumber,
        status: attempt.status,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
        timeSpent: attempt.timeSpent,
        totalPointsEarned: attempt.totalPointsEarned,
        totalPointsPossible: attempt.totalPointsPossible,
        scorePercentage: attempt.scorePercentage,
        passed: passed,
        overallFeedback: attempt.overallFeedback,
        answers: attempt.answers.map(a => ({
          questionId: a.questionId,
          questionType: a.questionType,
          pointsWorth: a.pointsWorth,
          selectedOptionIndex: a.selectedOptionIndex,
          textAnswer: a.textAnswer || '',
          pointsEarned: a.pointsEarned,
          feedback: a.feedback || '',
          needsGrading: a.needsGrading,
          isAutoGraded: a.isAutoGraded
        }))
      },
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        passingScore: quiz.passingScore,
        maxAttempts: quiz.maxAttempts,
        questions: questionsForReview
      },
      needsGrading,
      fullyGraded: attempt.fullyGraded
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { message: 'Failed to fetch results', error: error.message },
      { status: 500 }
    );
  }
}