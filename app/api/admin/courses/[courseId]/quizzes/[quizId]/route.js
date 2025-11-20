// app/api/admin/courses/[courseId]/quizzes/[quizId]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/config/db';
import Quiz from '@/lib/models/quizSchema';
import QuizAttempt from '@/lib/models/quizAttemptSchema';
import CourseModule from '@/lib/models/courseModuleSchema';
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

// GET - Fetch single quiz
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
    
    const quiz = await Quiz.findById(quizId)
      .populate('module', 'title')
      .populate('course', 'title');

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json(quiz, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { message: 'Failed to fetch quiz', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update quiz
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

    const { quizId, courseId } = await params;
    const body = await request.json();
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }
    
    // Update quiz fields
    if (body.title) quiz.title = body.title;
    if (body.description !== undefined) quiz.description = body.description;
    if (body.quizType) quiz.quizType = body.quizType;
    if (body.timeLimit !== undefined) quiz.timeLimit = body.timeLimit;
    if (body.passingScore !== undefined) quiz.passingScore = body.passingScore;
    if (body.maxAttempts !== undefined) quiz.maxAttempts = body.maxAttempts;
    if (body.availableFrom !== undefined) quiz.availableFrom = body.availableFrom;
    if (body.availableUntil !== undefined) quiz.availableUntil = body.availableUntil;
    if (body.isPublished !== undefined) quiz.isPublished = body.isPublished;
    if (body.order !== undefined) quiz.order = body.order;
    
    // Update module if changed
    if (body.module !== undefined && body.module !== quiz.module?.toString()) {
      // Remove from old module
      if (quiz.module) {
        await CourseModule.findByIdAndUpdate(
          quiz.module,
          { $pull: { quizzes: quiz._id } }
        );
      }
      
      // Add to new module
      if (body.module) {
        await CourseModule.findByIdAndUpdate(
          body.module,
          { $push: { quizzes: quiz._id } }
        );
      }
      
      quiz.module = body.module;
    }
    
    // Update questions if provided
    if (body.questions) {
      quiz.questions = body.questions.map((q, index) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        order: index + 1,
        pointsWorth: q.pointsWorth,
        options: q.questionType === 'multiple_choice' ? q.options : [],
        instructorNotes: q.instructorNotes || '',
        sampleAnswer: q.sampleAnswer || ''
      }));
    }
    
    await quiz.save();
    
    return NextResponse.json(quiz, { status: 200 });
    
  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json(
      { message: 'Failed to update quiz', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete quiz with cascade deletion
export async function DELETE(request, { params }) {
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
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }
    
    console.log(`Starting cascade deletion for quiz ${quizId}`);
    
    // 1. Delete all quiz attempts related to this quiz
    const attemptsResult = await QuizAttempt.deleteMany({ quiz: quizId });
    console.log(`Deleted ${attemptsResult.deletedCount} quiz attempts for quiz ${quizId}`);
    
    // 2. Remove quiz from its module
    if (quiz.module) {
      await CourseModule.findByIdAndUpdate(
        quiz.module,
        { $pull: { quizzes: quiz._id } }
      );
      console.log(`Removed quiz ${quizId} from module ${quiz.module}`);
    }
    
    // 3. Remove quiz from any other modules that might reference it
    const modulesResult = await CourseModule.updateMany(
      { quizzes: quizId },
      { $pull: { quizzes: quizId } }
    );
    console.log(`Removed quiz ${quizId} from ${modulesResult.modifiedCount} additional module(s)`);
    
    // 4. Finally delete the quiz
    await Quiz.findByIdAndDelete(quizId);
    console.log(`Successfully deleted quiz ${quizId}`);
    
    return NextResponse.json({ 
      message: 'Quiz deleted successfully',
      details: {
        quizId,
        attemptsDeleted: attemptsResult.deletedCount,
        modulesUpdated: modulesResult.modifiedCount + (quiz.module ? 1 : 0)
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json(
      { message: 'Failed to delete quiz', error: error.message },
      { status: 500 }
    );
  }
}