// models/Quiz.js
import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  
  // Link to course and module
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseModule'
  },
  
  // Quiz settings
  quizType: {
    type: String,
    enum: ['practice', 'graded', 'midterm', 'final'],
    default: 'graded'
  },
  timeLimit: {
    type: Number, // in minutes (0 = no limit)
    default: 0
  },
  passingScore: {
    type: Number,
    default: 70,
    min: 0,
    max: 100
  },
  maxAttempts: {
    type: Number,
    default: 1 // Typically 1 for graded quizzes
  },
  
  // Questions
  questions: [{
    questionText: {
      type: String,
      required: true
    },
    questionType: {
      type: String,
      enum: ['multiple_choice', 'text_answer'],
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    
    // Points this question is worth
    pointsWorth: {
      type: Number,
      required: true,
      min: 0
    },
    
    // For multiple choice only
    options: [{
      text: {
        type: String,
        required: true
      },
      isCorrect: {
        type: Boolean,
        default: false
      }
    }],
    
    // Optional: For instructor reference (not shown to students)
    instructorNotes: String,
    
    // Optional: Sample/suggested answer for text questions
    sampleAnswer: String
  }],
  
  // Availability
  availableFrom: Date,
  availableUntil: Date,
  isPublished: {
    type: Boolean,
    default: false
  },
  
  // Total points (calculated)
  totalPoints: {
    type: Number,
    default: 0
  },
  
  // Order in course
  order: {
    type: Number,
    default: 0
  },
  
  // Created by
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, {
  timestamps: true
});

// Calculate total points before saving
quizSchema.pre('save', function(next) {
  this.totalPoints = this.questions.reduce((sum, q) => sum + (q.pointsWorth || 0), 0);
  next();
});

// Virtual to check if quiz has text answers requiring grading
quizSchema.virtual('hasTextAnswers').get(function() {
  return this.questions.some(q => q.questionType === 'text_answer');
});

export default mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);