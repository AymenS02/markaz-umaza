// models/CourseModule.js
import mongoose from 'mongoose';

const courseModuleSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  order: {
    type: Number,
    required: true
  },
  
  // Associated quizzes
  quizzes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  
  // Module settings
  isPublished: {
    type: Boolean,
    default: false
  },
  unlockDate: Date,
  
  // Prerequisites (students must complete these modules first)
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseModule'
  }]

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for quiz count
courseModuleSchema.virtual('quizCount', {
  ref: 'Quiz',
  localField: '_id',
  foreignField: 'module',
  count: true
});

// Index for efficient queries
courseModuleSchema.index({ courseId: 1, order: 1 });

// Method to check if module is accessible to student
courseModuleSchema.methods.isAccessibleTo = async function(enrollmentId) {
  // Check if published
  if (!this.isPublished) return false;
  
  // Check unlock date
  if (this.unlockDate && new Date() < this.unlockDate) return false;
  
  // Check prerequisites
  if (this.prerequisites && this.prerequisites.length > 0) {
    const Enrollment = mongoose.model('Enrollment');
    const enrollment = await Enrollment.findById(enrollmentId);
    
    if (!enrollment) return false;
    
    // Check if all prerequisite modules are completed
    for (const prereqId of this.prerequisites) {
      const prereqProgress = enrollment.moduleProgress.find(
        mp => mp.module.toString() === prereqId.toString()
      );
      
      if (!prereqProgress || prereqProgress.status !== 'completed') {
        return false;
      }
    }
  }
  
  return true;
};

export default mongoose.models.CourseModule || mongoose.model('CourseModule', courseModuleSchema);