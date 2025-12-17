// app/api/admin/courses/[courseId]/quizzes/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/config/db';
import Quiz from '@/lib/models/quizSchema';
import Course from '@/lib/models/courseSchema';
import CourseModule from '@/lib/models/courseModuleSchema';
import User from '@/lib/models/userSchema';
import jwt from 'jsonwebtoken';

// Helper function to verify token and get user
async function verifyAuth(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Auth verification failed: No authorization header');
      }
      return null;
    }
    if (!authHeader.startsWith('Bearer ')) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Auth verification failed: Invalid authorization header format');
      }
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    await dbConnect();
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Auth verification failed: User not found for decoded userId');
      }
      return null;
    }
    
    return user;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Auth verification error:', error.message);
    }
    return null;
  }
}

// GET - Fetch all quizzes for a course
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    // Verify admin authentication
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Await params in Next.js 15
    const { courseId } = await params;
    
    // Fetch all quizzes for this course
    const quizzes = await Quiz.find({ course: courseId })
      .populate('module', 'title order')
      .sort({ order: 1 });

    return NextResponse.json(quizzes, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { message: 'Failed to fetch quizzes', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new quiz
export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    // Verify admin authentication
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Await params in Next.js 15
    const { courseId } = await params;
    const body = await request.json();
    
    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }
    
    // If module is specified, verify it exists and belongs to this course
    if (body.module) {
      const courseModule = await CourseModule.findOne({ 
        _id: body.module, 
        courseId: courseId 
      });
      
      if (!courseModule) {
        return NextResponse.json({ 
          message: 'Module not found or does not belong to this course' 
        }, { status: 404 });
      }
    }
    
    // Validate questions
    if (!body.questions || body.questions.length === 0) {
      return NextResponse.json({ 
        message: 'Quiz must have at least one question' 
      }, { status: 400 });
    }
    
    // Validate each question
    for (let i = 0; i < body.questions.length; i++) {
      const q = body.questions[i];
      
      if (!q.questionText || q.questionText.trim() === '') {
        return NextResponse.json({ 
          message: `Question ${i + 1} must have question text` 
        }, { status: 400 });
      }
      
      if (!q.questionType || !['multiple_choice', 'text_answer'].includes(q.questionType)) {
        return NextResponse.json({ 
          message: `Question ${i + 1} must have a valid question type` 
        }, { status: 400 });
      }
      
      if (!q.pointsWorth || q.pointsWorth <= 0) {
        return NextResponse.json({ 
          message: `Question ${i + 1} must have points worth greater than 0` 
        }, { status: 400 });
      }
      
      // Validate multiple choice questions have options
      if (q.questionType === 'multiple_choice') {
        if (!q.options || q.options.length < 2) {
          return NextResponse.json({ 
            message: `Question ${i + 1} must have at least 2 options` 
          }, { status: 400 });
        }
        
        const hasCorrectAnswer = q.options.some(opt => opt.isCorrect);
        if (!hasCorrectAnswer) {
          return NextResponse.json({ 
            message: `Question ${i + 1} must have at least one correct answer` 
          }, { status: 400 });
        }
      }
    }
    
    // Create quiz
    const quiz = await Quiz.create({
      title: body.title,
      description: body.description,
      course: courseId,
      module: body.module || null,
      quizType: body.quizType || 'graded',
      timeLimit: body.timeLimit || 0,
      passingScore: body.passingScore || 70,
      maxAttempts: body.maxAttempts || 1,
      questions: body.questions.map((q, index) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        order: index + 1,
        pointsWorth: q.pointsWorth,
        options: q.questionType === 'multiple_choice' ? q.options : [],
        instructorNotes: q.instructorNotes || '',
        sampleAnswer: q.sampleAnswer || ''
      })),
      availableFrom: body.availableFrom || null,
      availableUntil: body.availableUntil || null,
      isPublished: body.isPublished || false,
      order: body.order || 0,
      createdBy: user._id
    });
    
    // If module specified, add quiz to module's quiz array
    if (body.module) {
      await CourseModule.findByIdAndUpdate(
        body.module,
        { $push: { quizzes: quiz._id } }
      );
    }
    
    return NextResponse.json(quiz, { status: 201 });
    
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { message: 'Failed to create quiz', error: error.message },
      { status: 500 }
    );
  }
}