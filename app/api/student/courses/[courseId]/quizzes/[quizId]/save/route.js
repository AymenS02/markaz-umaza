// app/api/student/courses/[courseId]/quizzes/[quizId]/save/route.js
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

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { quizId } = await params;
    const body = await request.json();
    const { attemptId, answers } = body;

    const attempt = await QuizAttempt.findOne({
      _id: attemptId,
      user: user._id,
      quiz: quizId,
      status: 'in_progress'
    });

    if (!attempt) {
      return NextResponse.json({ message: 'Attempt not found' }, { status: 404 });
    }

    // Update answers
    answers.forEach(answer => {
      const existingAnswer = attempt.answers.find(
        a => a.questionId.toString() === answer.questionId
      );
      
      if (existingAnswer) {
        if (answer.questionType === 'multiple_choice') {
          existingAnswer.selectedOptionIndex = answer.selectedOptionIndex;
        } else if (answer.questionType === 'text_answer') {
          existingAnswer.textAnswer = answer.textAnswer;
        }
      }
    });

    await attempt.save();

    return NextResponse.json({ message: 'Answers saved' }, { status: 200 });
    
  } catch (error) {
    console.error('Error saving answers:', error);
    return NextResponse.json(
      { message: 'Failed to save answers', error: error.message },
      { status: 500 }
    );
  }
}