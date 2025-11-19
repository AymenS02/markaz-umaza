// models/Enrollment.js
import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['etransfer', 'stripe', 'free'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  etransferEmail: {
    type: String,
    required: function() { return this.paymentMethod === 'etransfer'; }
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending_payment', 'active', 'completed', 'suspended'],
    default: 'pending_payment'
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  // progress: {
  //   type: Number,
  //   default: 0,
  //   min: 0,
  //   max: 100
  // },
  
  // NEW: Module Progress Tracking
  // moduleProgress: [{
  //   module: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'CourseModule'
  //   },
  //   status: {
  //     type: String,
  //     enum: ['not_started', 'in_progress', 'completed'],
  //     default: 'not_started'
  //   },
  //   startedAt: Date,
  //   completedAt: Date,
  //   lessonsCompleted: [{ 
  //     type: mongoose.Schema.Types.ObjectId 
  //   }]
  // }],

  // NEW: Overall grade tracking
  finalGrade: {
    type: Number,
    min: 0,
    max: 100
  },
  letterGrade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F']
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateIssuedAt: Date

}, {
  timestamps: true
});

// Index for faster queries
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ user: 1, status: 1 });

// // Method to calculate overall progress
// enrollmentSchema.methods.calculateProgress = async function() {
//   const totalModules = this.moduleProgress.length;
//   if (totalModules === 0) return 0;
  
//   const completedModules = this.moduleProgress.filter(m => m.status === 'completed').length;
//   return Math.round((completedModules / totalModules) * 100);
// };

export default mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);