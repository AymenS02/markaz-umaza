// lib/models/quizAttemptSchema.js
import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  
  // Attempt info
  attemptNumber: {
    type: Number,
    required: true,
    default: 1
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: Date,
  
  // Status tracking
  status: {
    type: String,
    enum: ['in_progress', 'submitted', 'graded'],
    default: 'in_progress'
  },
  
  // Answers
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    questionType: {
      type: String,
      enum: ['multiple_choice', 'text_answer'],
      required: true
    },
    
    // Points this question is worth (copied from quiz for reference)
    pointsWorth: {
      type: Number,
      required: true
    },
    
    // Student's answer
    selectedOptionIndex: Number, // For multiple choice (0-based index)
    textAnswer: String,          // For text answer questions
    
    // Grading
    pointsEarned: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Auto-graded (for multiple choice)
    isAutoGraded: {
      type: Boolean,
      default: false
    },
    
    // Manual grading info (for text answers or admin review)
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    gradedAt: Date,
    feedback: String, // Admin's feedback on this specific answer
    
    // Flag for questions needing grading
    needsGrading: {
      type: Boolean,
      default: false
    }
  }],
  
  // Overall scoring
  totalPointsEarned: {
    type: Number,
    default: 0
  },
  totalPointsPossible: {
    type: Number,
    required: true
  },
  scorePercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  passed: Boolean,
  
  // Grading status
  needsGrading: {
    type: Boolean,
    default: false
  },
  fullyGraded: {
    type: Boolean,
    default: false
  },
  
  // Time tracking
  timeSpent: Number, // in seconds
  
  // Overall admin feedback
  overallFeedback: String,
  
  // Final graded by
  finalGradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  finalGradedAt: Date

}, {
  timestamps: true
});

// Indexes for efficient queries
quizAttemptSchema.index({ user: 1, quiz: 1 });
quizAttemptSchema.index({ enrollment: 1 });
quizAttemptSchema.index({ status: 1 });
quizAttemptSchema.index({ needsGrading: 1, status: 1 });
quizAttemptSchema.index({ quiz: 1, user: 1, attemptNumber: 1 }, { unique: true });

// Static method to find or create attempt
quizAttemptSchema.statics.findOrCreateAttempt = async function(quizId, userId, enrollmentId, quizData) {
  // Check for in-progress attempt
  let attempt = await this.findOne({
    quiz: quizId,
    user: userId,
    enrollment: enrollmentId,
    status: 'in_progress'
  });

  if (attempt) {
    return { attempt, isNew: false };
  }

  // Get all existing attempts to calculate next attempt number
  const existingAttempts = await this.find({
    quiz: quizId,
    user: userId,
    enrollment: enrollmentId
  }).sort({ attemptNumber: 1 });

  const attemptNumber = existingAttempts.length > 0 
    ? Math.max(...existingAttempts.map(a => a.attemptNumber)) + 1
    : 1;

  // Create new attempt
  attempt = await this.create({
    quiz: quizId,
    user: userId,
    enrollment: enrollmentId,
    attemptNumber,
    status: 'in_progress',
    totalPointsPossible: quizData.totalPoints,
    answers: quizData.questions.map(q => ({
      questionId: q._id,
      questionType: q.questionType,
      pointsWorth: q.pointsWorth,
      needsGrading: q.questionType === 'text_answer'
    }))
  });

  return { attempt, isNew: true };
};

// Method to auto-grade multiple choice questions
quizAttemptSchema.methods.autoGradeMultipleChoice = async function() {
  const Quiz = mongoose.model('Quiz');
  const quiz = await Quiz.findById(this.quiz);
  
  if (!quiz) return;
  
  let hasTextAnswers = false;
  
  this.answers.forEach((answer) => {
    const question = quiz.questions.find(q => q._id.toString() === answer.questionId.toString());
    
    if (!question) return;
    
    if (answer.questionType === 'multiple_choice') {
      // Auto-grade multiple choice
      const selectedOption = question.options[answer.selectedOptionIndex];
      if (selectedOption && selectedOption.isCorrect) {
        answer.pointsEarned = answer.pointsWorth;
      } else {
        answer.pointsEarned = 0;
      }
      answer.isAutoGraded = true;
      answer.needsGrading = false;
    } else if (answer.questionType === 'text_answer') {
      // Text answers need manual grading
      answer.needsGrading = true;
      answer.isAutoGraded = false;
      hasTextAnswers = true;
    }
  });
  
  this.needsGrading = hasTextAnswers;
  this.calculateScore();
  
  if (!hasTextAnswers) {
    this.status = 'graded';
    this.fullyGraded = true;
    
    // Check if passed - NOW WITH THE QUIZ DATA
    this.passed = this.scorePercentage >= quiz.passingScore;
  }
};

// Method to calculate overall score
quizAttemptSchema.methods.calculateScore = function() {
  const totalEarned = this.answers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
  this.totalPointsEarned = totalEarned;
  
  if (this.totalPointsPossible > 0) {
    this.scorePercentage = Math.round((totalEarned / this.totalPointsPossible) * 100);
  } else {
    this.scorePercentage = 0;
  }
  
  // Check if all questions are graded
  const allGraded = this.answers.every(a => {
    if (a.questionType === 'multiple_choice') return true;
    return !a.needsGrading;
  });
  
  this.fullyGraded = allGraded;
  this.needsGrading = !allGraded;
  
  return this.scorePercentage;
};

// Method for admin to grade a text answer
quizAttemptSchema.methods.gradeTextAnswer = async function(questionId, pointsEarned, feedback, gradedByUserId) {
  const answer = this.answers.find(a => a.questionId.toString() === questionId.toString());
  
  if (!answer || answer.questionType !== 'text_answer') {
    throw new Error('Invalid question or not a text answer');
  }
  
  // Validate points don't exceed maximum
  if (pointsEarned > answer.pointsWorth) {
    throw new Error(`Points earned (${pointsEarned}) cannot exceed points worth (${answer.pointsWorth})`);
  }
  
  if (pointsEarned < 0) {
    throw new Error('Points earned cannot be negative');
  }
  
  answer.pointsEarned = pointsEarned;
  answer.feedback = feedback;
  answer.gradedBy = gradedByUserId;
  answer.gradedAt = new Date();
  answer.needsGrading = false;
  
  // Recalculate score
  this.calculateScore();
  
  // If all questions are now graded, mark as complete
  if (this.fullyGraded) {
    this.status = 'graded';
    this.finalGradedBy = gradedByUserId;
    this.finalGradedAt = new Date();
    
    // Check if student passed
    const Quiz = mongoose.model('Quiz');
    const quiz = await Quiz.findById(this.quiz);
    if (quiz) {
      this.passed = this.scorePercentage >= quiz.passingScore;
    }
  }
  
  await this.save();
  return this;
};

// Auto-calculate score before saving
quizAttemptSchema.pre('save', async function(next) {
  if (this.isModified('answers') || this.isModified('status')) {
    this.calculateScore();
    
    // If fully graded and passed is not set, check it
    if (this.fullyGraded && this.passed === undefined) {
      const Quiz = mongoose.model('Quiz');
      const quiz = await Quiz.findById(this.quiz);
      if (quiz) {
        this.passed = this.scorePercentage >= quiz.passingScore;
      }
    }
  }
  next();
});

export default mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', quizAttemptSchema);