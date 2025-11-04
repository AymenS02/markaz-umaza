// models/Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  // Basic Info
  title: { type: String, required: true },
  description: { type: String },
  code: { type: String, required: true, unique: true },
  instructor: { type: String, required: true },
  thumbnailUrl: { type: String },

  // Categorization
  category: { type: String },
  difficultyLevel: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    default: 'beginner' 
  },

  // Course Details
  price: { type: Number, default: 0 },
  durationWeeks: { type: Number }, // e.g. 12
  totalLessons: { type: Number },  // e.g. 48
  maxStudents: { type: Number },
  enrolledStudents: { type: Number, default: 0 }, // dynamic count (e.g. 234)

  // Scheduling
  startDate: { type: Date },
  endDate: { type: Date },

  // Lesson Progress Info
  nextLessonTitle: { type: String }, // e.g. "Lesson 12: Past Tense Verbs"
  nextLessonDate: { type: Date },

  // Course Type
  courseStatus: { 
    type: String, 
    enum: ['current', 'upcoming', 'past'], 
    default: 'upcoming' 
  },

  // Educational Objectives
  requirements: { type: String },
  learningOutcomes: { type: String },

}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for modules
courseSchema.virtual('modules', {
  ref: 'CourseModule',
  localField: '_id',
  foreignField: 'courseId',
  justOne: false
});

// Virtual for enrollments
courseSchema.virtual("enrollments", {
  ref: "Enrollment",
  localField: "_id",
  foreignField: "course",
  justOne: false
});

// Auto-delete associated modules when a course is removed
courseSchema.pre('remove', async function(next) {
  try {
    await mongoose.model('CourseModule').deleteMany({ courseId: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.models.Course || mongoose.model('Course', courseSchema);
