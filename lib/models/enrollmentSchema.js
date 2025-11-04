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
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Index for faster queries
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);