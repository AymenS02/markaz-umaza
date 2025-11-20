'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, Plus, Save, X, Upload, Calendar, DollarSign, 
  Users, Clock, Award, FileText, Sparkles, AlertCircle,
  CheckCircle, Trash2, Edit, Eye, ArrowLeft, Layers
} from 'lucide-react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client'; // ← ADD THIS IMPORT

const AdminCourseCreator = () => {
  const router = useRouter();
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    instructor: '',
    thumbnailUrl: '',
    category: '',
    difficultyLevel: 'beginner',
    price: 0,
    durationWeeks: 0,
    totalLessons: 0,
    maxStudents: 0,
    startDate: '',
    endDate: '',
    nextLessonTitle: '',
    nextLessonDate: '',
    courseStatus: 'upcoming',
    requirements: '',
    learningOutcomes: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (showCreateModal && formRef.current) {
      gsap.fromTo(formRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power3.out" }
      );
    }
  }, [showCreateModal]);

  const fetchCourses = async () => {
    try {
      // ✅ UPDATED: Use authClient
      const response = await authClient.fetchWithAuth('/api/admin/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else if (response.status === 401) {
        alert('Session expired. Please log in again.');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const url = isEditing 
        ? `/api/admin/courses/${editingId}`
        : '/api/admin/courses';
      
      const method = isEditing ? 'PATCH' : 'POST';

      // ✅ UPDATED: Use authClient
      const response = await authClient.fetchWithAuth(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowSuccess(true);
        fetchCourses();
        resetForm();
        setShowCreateModal(false);
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else if (response.status === 401) {
        alert('Session expired. Please log in again.');
        router.push('/login');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to save course'}`);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert('An error occurred while saving the course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (course) => {
    setIsEditing(true);
    setEditingId(course._id);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      code: course.code || '',
      instructor: course.instructor || '',
      thumbnailUrl: course.thumbnailUrl || '',
      category: course.category || '',
      difficultyLevel: course.difficultyLevel || 'beginner',
      price: course.price || 0,
      durationWeeks: course.durationWeeks || 0,
      totalLessons: course.totalLessons || 0,
      maxStudents: course.maxStudents || 0,
      startDate: course.startDate ? new Date(course.startDate).toISOString().split('T')[0] : '',
      endDate: course.endDate ? new Date(course.endDate).toISOString().split('T')[0] : '',
      nextLessonTitle: course.nextLessonTitle || '',
      nextLessonDate: course.nextLessonDate ? new Date(course.nextLessonDate).toISOString().split('T')[0] : '',
      courseStatus: course.courseStatus || 'upcoming',
      requirements: course.requirements || '',
      learningOutcomes: course.learningOutcomes || ''
    });
    
    setShowCreateModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course? This will also delete all related quizzes, modules, and enrollments.')) return;

    try {
      // ✅ UPDATED: Use authClient
      const response = await authClient.fetchWithAuth(`/api/admin/courses/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const result = await response.json();
        fetchCourses();
        alert(result.message || 'Course deleted successfully');
      } else if (response.status === 401) {
        alert('Session expired. Please log in again.');
        router.push('/login');
      } else {
        const error = await response.json();
        alert(`Failed to delete course: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('An error occurred while deleting the course');
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      code: '',
      instructor: '',
      thumbnailUrl: '',
      category: '',
      difficultyLevel: 'beginner',
      price: 0,
      durationWeeks: 0,
      totalLessons: 0,
      maxStudents: 0,
      startDate: '',
      endDate: '',
      nextLessonTitle: '',
      nextLessonDate: '',
      courseStatus: 'upcoming',
      requirements: '',
      learningOutcomes: ''
    });
  };

  const getDifficultyColor = (level) => {
    switch(level) {
      case 'beginner': return 'bg-primary/10 text-primary border-primary/20';
      case 'intermediate': return 'bg-accent/10 text-accent border-accent/20';
      case 'advanced': return 'bg-secondary/10 text-secondary border-secondary/20';
      default: return 'bg-foreground/5 text-foreground/60 border-foreground/10';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'current': return 'bg-primary/10 text-primary border-primary/20';
      case 'upcoming': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'past': return 'bg-foreground/10 text-foreground/60 border-foreground/20';
      default: return 'bg-foreground/5 text-foreground/60 border-foreground/10';
    }
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4 md:mt-42">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-24 right-4 z-50 bg-primary text-background px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in">
          <CheckCircle size={24} />
          <span className="font-semibold">Course {isEditing ? 'updated' : 'created'} successfully!</span>
        </div>
      )}

      <div className="container mx-auto max-w-7xl">
        {/* Back Button */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8 group font-bold"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          Back to Admin Dashboard
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="text-primary" size={24} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Course Management
              </h1>
            </div>
            
            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="px-6 py-3 bg-primary text-background rounded-xl font-bold hover:bg-accent hover:scale-105 transition-all shadow-lg flex items-center gap-2"
            >
              <Plus size={20} />
              Create Course
            </button>
          </div>
          <p className="text-xl text-foreground/70">
            Create, edit, and manage your courses
          </p>
        </div>

        {/* Existing Courses List */}
        <div className="bg-card border-2 border-foreground/10 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <BookOpen size={28} />
            All Courses ({courses.length})
          </h2>

          {courses.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto text-foreground/20 mb-4" size={64} />
              <p className="text-xl text-foreground/60 mb-4">No courses yet. Create your first course!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-primary text-background rounded-xl font-bold hover:bg-accent transition-all"
              >
                Create First Course
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course._id} className="bg-background rounded-2xl border-2 border-foreground/10 overflow-hidden hover:border-primary/30 transition-all duration-300 group">
                  <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Award className="text-primary" size={48} />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border-2 ${getDifficultyColor(course.difficultyLevel)}`}>
                        {course.difficultyLevel}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(course.courseStatus)}`}>
                        {course.courseStatus}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-foreground/60 mb-1 font-semibold">{course.instructor}</p>
                    <p className="text-sm text-foreground/60 mb-4 font-semibold">Code: {course.code}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm text-foreground/70 mb-4 font-semibold">
                      <div>💰 ${course.price}</div>
                      <div>📚 {course.totalLessons} lessons</div>
                      <div>⏱️ {course.durationWeeks} weeks</div>
                      <div>👥 {course.enrolledStudents || 0}/{course.maxStudents || '∞'}</div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/admin/courses/${course._id}/quizzes`}
                        className="flex-1 px-4 py-2 bg-accent/10 text-accent rounded-lg font-bold hover:bg-accent/20 transition-all duration-300 flex items-center justify-center gap-2 border-2 border-accent/30"
                      >
                        <Layers size={16} />
                        Modules
                      </Link>
                      <button
                        onClick={() => handleEdit(course)}
                        className="flex-1 px-4 py-2 bg-secondary/10 text-secondary rounded-lg font-bold hover:bg-secondary/20 transition-all duration-300 flex items-center justify-center gap-2 border-2 border-secondary/30"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="px-4 py-2 bg-error/10 text-error rounded-lg font-bold hover:bg-error/20 transition-all duration-300 flex items-center justify-center border-2 border-error/30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div 
            ref={formRef}
            className="bg-card border-2 border-foreground/10 rounded-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-card border-b-2 border-foreground/10 p-6 flex items-center justify-between z-10">
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                {isEditing ? <Edit size={28} /> : <Plus size={28} />}
                {isEditing ? 'Edit Course' : 'Create New Course'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-foreground/10 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <BookOpen size={20} />
                    Basic Information
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Arabic Fundamentals"
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground placeholder:text-foreground/40 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g., ARB-101"
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground placeholder:text-foreground/40 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Instructor *
                  </label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    placeholder="e.g., Ustadh Umair"
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground placeholder:text-foreground/40 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Language Learning"
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground placeholder:text-foreground/40 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief course description..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground placeholder:text-foreground/40 transition-all resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Thumbnail URL
                  </label>
                  <div className="flex gap-3 max-md:flex-col">
                    <input
                      type="url"
                      name="thumbnailUrl"
                      value={formData.thumbnailUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground placeholder:text-foreground/40 transition-all"
                    />
                    <button className="px-6 py-3 bg-secondary/10 text-secondary rounded-xl font-semibold hover:bg-secondary/20 transition-all duration-300 flex items-center gap-2 border-2 border-secondary/20">
                      <Upload size={18} />
                      Upload
                    </button>
                  </div>
                </div>

                {/* Course Details */}
                <div className="md:col-span-2 mt-6">
                  <h3 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                    <FileText size={20} />
                    Course Details
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Difficulty Level
                  </label>
                  <select
                    name="difficultyLevel"
                    value={formData.difficultyLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground transition-all appearance-none cursor-pointer font-bold"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Course Status
                  </label>
                  <select
                    name="courseStatus"
                    value={formData.courseStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground transition-all appearance-none cursor-pointer font-bold"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="current">Current</option>
                    <option value="past">Past</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <DollarSign size={16} />
                    Price (CAD)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="99"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground placeholder:text-foreground/40 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Clock size={16} />
                    Duration (Weeks)
                  </label>
                  <input
                    type="number"
                    name="durationWeeks"
                    value={formData.durationWeeks}
                    onChange={handleInputChange}
                    placeholder="12"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground placeholder:text-foreground/40 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <BookOpen size={16} />
                    Total Lessons
                  </label>
                  <input
                    type="number"
                    name="totalLessons"
                    value={formData.totalLessons}
                    onChange={handleInputChange}
                    placeholder="48"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground placeholder:text-foreground/40 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Users size={16} />
                    Max Students
                  </label>
                  <input
                    type="number"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={handleInputChange}
                    placeholder="50"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground placeholder:text-foreground/40 transition-all"
                  />
                </div>

                {/* Scheduling */}
                <div className="md:col-span-2 mt-6">
                  <h3 className="text-xl font-bold text-accent mb-4 flex items-center gap-2">
                    <Calendar size={20} />
                    Scheduling
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Next Lesson Title
                  </label>
                  <input
                    type="text"
                    name="nextLessonTitle"
                    value={formData.nextLessonTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Lesson 12: Past Tense Verbs"
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground placeholder:text-foreground/40 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Next Lesson Date
                  </label>
                  <input
                    type="date"
                    name="nextLessonDate"
                    value={formData.nextLessonDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground transition-all"
                  />
                </div>

                {/* Educational Content */}
                <div className="md:col-span-2 mt-6">
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <Award size={20} />
                    Educational Content
                  </h3>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Requirements
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="Prerequisites or requirements for this course..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground placeholder:text-foreground/40 transition-all resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Learning Outcomes
                  </label>
                  <textarea
                    name="learningOutcomes"
                    value={formData.learningOutcomes}
                    onChange={handleInputChange}
                    placeholder="What students will learn from this course..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground placeholder:text-foreground/40 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.title || !formData.code || !formData.instructor}
                  className="flex-1 px-8 py-4 bg-primary text-background rounded-xl font-bold text-lg hover:bg-accent hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-background"></div>
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      {isEditing ? 'Update Course' : 'Create Course'}
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-8 py-4 border-2 border-foreground/20 text-foreground rounded-xl font-bold text-lg hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-3"
                >
                  <X size={20} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminCourseCreator;