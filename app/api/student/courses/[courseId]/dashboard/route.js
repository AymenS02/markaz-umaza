// app/api/student/courses/[courseId]/dashboard/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/config/db';
import Enrollment from '@/lib/models/enrollmentSchema';
import CourseModule from '@/lib/models/courseModuleSchema';
import Quiz from '@/lib/models/quizSchema';
import QuizAttempt from '@/lib/models/quizAttemptSchema';
import Course from '@/lib/models/courseSchema';
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

    const { courseId } = await params;
    
    // Check if user is enrolled in this course
    const enrollment = await Enrollment.findOne({
      user: user._id,
      course: courseId,
      status: 'active'
    }).populate('course');
    
    if (!enrollment) {
      return NextResponse.json(
        { message: 'You are not enrolled in this course' },
        { status: 403 }
      );
    }

    // Get course details
    const course = await Course.findById(courseId);
    
    // Get all modules for this course
    const modules = await CourseModule.find({ courseId })
      .populate({
        path: 'quizzes',
        match: { isPublished: true },
        options: { sort: { order: 1 } }
      })
      .sort({ order: 1 });

    // Get all quizzes for this course
    const allQuizzes = await Quiz.find({
      course: courseId,
      isPublished: true
    }).sort({ order: 1 });

    // Get all quiz attempts by this user for this course
    const attempts = await QuizAttempt.find({
      user: user._id,
      enrollment: enrollment._id
    }).populate('quiz', 'title totalPoints passingScore');

    // Calculate progress
    const totalQuizzes = allQuizzes.length;
    const completedQuizzes = attempts.filter(a => a.status === 'graded').length;
    const averageScore = attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + (a.scorePercentage || 0), 0) / attempts.length)
      : 0;

    // Get grades for completed quizzes - FIXED: Include attemptId
    const grades = attempts
      .filter(a => a.status === 'graded' || a.status === 'submitted')
      .map(attempt => ({
        attemptId: attempt._id,  // ← ADDED THIS
        quizId: attempt.quiz._id,
        quizTitle: attempt.quiz.title,
        score: attempt.scorePercentage,
        pointsEarned: attempt.totalPointsEarned,
        totalPoints: attempt.totalPointsPossible,
        passed: attempt.passed,
        submittedAt: attempt.submittedAt,
        feedback: attempt.overallFeedback,
        attemptNumber: attempt.attemptNumber
      }))
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    // Get available quizzes (not yet attempted or can retry)
    const availableQuizzes = [];
    for (const quiz of allQuizzes) {
      const userAttempts = attempts.filter(a => a.quiz._id.toString() === quiz._id.toString());
      const canAttempt = userAttempts.length < quiz.maxAttempts;
      const lastAttempt = userAttempts.length > 0 ? userAttempts[userAttempts.length - 1] : null;
      
      if (canAttempt) {
        availableQuizzes.push({
          _id: quiz._id,
          title: quiz.title,
          description: quiz.description,
          quizType: quiz.quizType,
          totalPoints: quiz.totalPoints,
          passingScore: quiz.passingScore,
          timeLimit: quiz.timeLimit,
          questionsCount: quiz.questions.length,
          attemptsUsed: userAttempts.length,
          maxAttempts: quiz.maxAttempts,
          lastAttemptScore: lastAttempt ? lastAttempt.scorePercentage : null,
          availableFrom: quiz.availableFrom,
          availableUntil: quiz.availableUntil
        });
      }
    }

    return NextResponse.json({
      course: {
        _id: course._id,
        title: course.title,
        instructor: course.instructor,
        description: course.description
      },
      enrollment: {
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress,
        finalGrade: enrollment.finalGrade,
        letterGrade: enrollment.letterGrade
      },
      modules,
      stats: {
        totalQuizzes,
        completedQuizzes,
        averageScore,
        totalPoints: attempts.reduce((sum, a) => sum + (a.totalPointsEarned || 0), 0),
        possiblePoints: attempts.reduce((sum, a) => sum + (a.totalPointsPossible || 0), 0)
      },
      availableQuizzes,
      grades
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { message: 'Failed to fetch dashboard data', error: error.message },
      { status: 500 }
    );
  }
}