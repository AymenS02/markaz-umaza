// app/admin/courses/[courseId]/quizzes/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, Edit2, Trash2, Eye, EyeOff, Search, Filter,
  FileText, Clock, Users, Award, ArrowLeft, AlertCircle,
  CheckCircle, Calendar
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function QuizzesListPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId;

  const [quizzes, setQuizzes] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPublished, setFilterPublished] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ show: false, quizId: null, quizTitle: '' });

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch course info
      const courseResponse = await authClient.fetchWithAuth(`/api/courses/${courseId}`);
      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        setCourse(courseData);
      }

      // Fetch quizzes
      const quizzesResponse = await authClient.fetchWithAuth(
        `/api/admin/courses/${courseId}/quizzes`
      );
      
      if (quizzesResponse.ok) {
        const data = await quizzesResponse.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await authClient.fetchWithAuth(
        `/api/admin/courses/${courseId}/quizzes/${deleteModal.quizId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        setQuizzes(quizzes.filter(q => q._id !== deleteModal.quizId));
        setDeleteModal({ show: false, quizId: null, quizTitle: '' });
      } else {
        alert('Failed to delete quiz');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Error deleting quiz');
    }
  };

  const togglePublish = async (quizId, currentStatus) => {
    try {
      const response = await authClient.fetchWithAuth(
        `/api/admin/courses/${courseId}/quizzes/${quizId}`,
        {
          method: 'PUT',
          body: JSON.stringify({ isPublished: !currentStatus })
        }
      );

      if (response.ok) {
        const updatedQuiz = await response.json();
        setQuizzes(quizzes.map(q => q._id === quizId ? updatedQuiz : q));
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  // Filter quizzes
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || quiz.quizType === filterType;
    
    const matchesPublished = filterPublished === 'all' || 
                            (filterPublished === 'published' && quiz.isPublished) ||
                            (filterPublished === 'draft' && !quiz.isPublished);
    
    return matchesSearch && matchesType && matchesPublished;
  });

  const getQuizTypeColor = (type) => {
    switch(type) {
      case 'practice': return 'bg-secondary/10 text-secondary border-secondary/30';
      case 'graded': return 'bg-primary/10 text-primary border-primary/30';
      default: return 'bg-foreground/10 text-foreground border-foreground/30';
    }
  };

  const getQuizTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60 font-semibold">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-4 font-bold"
          >
            <ArrowLeft size={20} />
            Back to Courses
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-foreground mb-2">
                {course?.title || 'Course'} - Quizzes
              </h1>
              <p className="text-foreground/60">Manage quizzes and assessments for this course</p>
            </div>
            
            <Link
              href={`/admin/courses/${courseId}/quizzes/create`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-background rounded-xl font-bold hover:bg-accent hover:scale-105 transition-all shadow-lg"
            >
              <Plus size={20} />
              Create Quiz
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border-2 border-foreground/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="text-primary" size={20} />
              <span className="text-sm text-foreground/60 font-bold">Total Quizzes</span>
            </div>
            <div className="text-3xl font-black text-foreground">{quizzes.length}</div>
          </div>

          <div className="bg-card border-2 border-foreground/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="text-success" size={20} />
              <span className="text-sm text-foreground/60 font-bold">Published</span>
            </div>
            <div className="text-3xl font-black text-foreground">
              {quizzes.filter(q => q.isPublished).length}
            </div>
          </div>

          <div className="bg-card border-2 border-foreground/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <EyeOff className="text-foreground/40" size={20} />
              <span className="text-sm text-foreground/60 font-bold">Drafts</span>
            </div>
            <div className="text-3xl font-black text-foreground">
              {quizzes.filter(q => !q.isPublished).length}
            </div>
          </div>

          {/* <div className="bg-card border-2 border-foreground/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Award className="text-accent" size={20} />
              <span className="text-sm text-foreground/60 font-bold">Quizzes Worth Marks</span>
            </div>
            <div className="text-3xl font-black text-foreground">
              {quizzes.filter(q => q.quizType === 'graded').length}
            </div>
          </div> */}
        </div>

        {/* Filters */}
        <div className="bg-card border-2 border-foreground/10 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-background border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
            >
              <option value="all">All Types</option>
              <option value="practice">Practice</option>
              <option value="graded">Quizzes Worth Marks</option>
            </select>

            {/* Published Filter */}
            <select
              value={filterPublished}
              onChange={(e) => setFilterPublished(e.target.value)}
              className="px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>

        {/* Quiz List */}
        {filteredQuizzes.length === 0 ? (
          <div className="bg-card border-2 border-foreground/10 rounded-xl p-12 text-center">
            <FileText className="mx-auto text-foreground/20 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-foreground/60 mb-2">
              {searchQuery || filterType !== 'all' || filterPublished !== 'all' 
                ? 'No quizzes match your filters' 
                : 'No quizzes yet'}
            </h3>
            <p className="text-foreground/40 mb-6">
              {searchQuery || filterType !== 'all' || filterPublished !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first quiz'}
            </p>
            {!searchQuery && filterType === 'all' && filterPublished === 'all' && (
              <Link
                href={`/admin/courses/${courseId}/quizzes/create`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-xl font-bold hover:bg-accent transition-all"
              >
                <Plus size={20} />
                Create First Quiz
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-card border-2 border-foreground/10 rounded-xl p-6 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Quiz Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h3 className="text-xl font-bold text-foreground">{quiz.title}</h3>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getQuizTypeColor(quiz.quizType)}`}>
                        {getQuizTypeLabel(quiz.quizType)}
                      </span>
                      
                      {quiz.isPublished ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-success/10 text-success border-2 border-success/30 flex items-center gap-1">
                          <Eye size={12} />
                          Published
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-foreground/10 text-foreground/60 border-2 border-foreground/20 flex items-center gap-1">
                          <EyeOff size={12} />
                          Draft
                        </span>
                      )}
                    </div>

                    {quiz.description && (
                      <p className="text-foreground/70 mb-3 line-clamp-2">{quiz.description}</p>
                    )}

                    {quiz.module && (
                      <div className="text-sm text-foreground/60 font-semibold mb-3">
                        📚 Module {quiz.module.order}: {quiz.module.title}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                      <div className="flex items-center gap-1.5">
                        <FileText size={16} />
                        <span className="font-semibold">{quiz.questions.length} question(s)</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <Award size={16} />
                        <span className="font-semibold">{quiz.totalPoints} point(s)</span>
                      </div>
                      
                      {quiz.timeLimit > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} />
                          <span className="font-semibold">{quiz.timeLimit} min(s)</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1.5">
                        <CheckCircle size={16} />
                        <span className="font-semibold">{quiz.passingScore}% to pass</span>
                      </div>

                      {quiz.availableFrom && (
                        <div className="flex items-center gap-1.5">
                          <Calendar size={16} />
                          <span className="font-semibold">
                            Available: {new Date(quiz.availableFrom).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap lg:flex-col gap-2">
                    <button
                      onClick={() => togglePublish(quiz._id, quiz.isPublished)}
                      className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                        quiz.isPublished
                          ? 'bg-foreground/10 text-foreground/70 hover:bg-foreground/20'
                          : 'bg-success/10 text-success hover:bg-success/20 border-2 border-success/30'
                      }`}
                      title={quiz.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {quiz.isPublished ? <EyeOff size={18} /> : <Eye size={18} />}
                      {quiz.isPublished ? 'Unpublish' : 'Publish'}
                    </button>

                    <Link
                      href={quiz.isPublished ? "#" : `/admin/courses/${courseId}/quizzes/${quiz._id}/edit`}
                      onClick={(e) => quiz.isPublished && e.preventDefault()}
                      className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 border-2 
                        ${quiz.isPublished 
                          ? "bg-secondary/5 text-foreground/40 border-secondary/10 cursor-not-allowed opacity-50" 
                          : "bg-secondary/10 text-secondary hover:bg-secondary/20 border-secondary/30"
                        }`
                      }
                      aria-disabled={quiz.isPublished}
                    >
                      <Edit2 size={18} />
                      Edit
                    </Link>

                    <Link
                      href={`/admin/courses/${courseId}/quizzes/${quiz._id}/grade`}
                      className="px-4 py-2 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg font-bold transition-all flex items-center justify-center gap-2 border-2 border-accent/30"
                    >
                      <Award size={18} />
                      Grade
                    </Link>

                    <button
                      onClick={() => setDeleteModal({ show: true, quizId: quiz._id, quizTitle: quiz.title })}
                      className="px-4 py-2 bg-error/10 text-error hover:bg-error/20 rounded-lg font-bold transition-all flex items-center justify-center gap-2 border-2 border-error/30"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border-2 border-foreground/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
                <AlertCircle className="text-error" size={24} />
              </div>
              <h3 className="text-2xl font-black text-foreground">Delete Quiz?</h3>
            </div>
            
            <p className="text-foreground/70 mb-6">
              Are you sure you want to delete <strong>"{deleteModal.quizTitle}"</strong>? 
              This action cannot be undone and will also delete all student attempts.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 bg-error text-background rounded-xl font-bold hover:bg-error/90 transition-all"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteModal({ show: false, quizId: null, quizTitle: '' })}
                className="flex-1 px-6 py-3 bg-background border-2 border-foreground/20 text-foreground rounded-xl font-bold hover:border-foreground/40 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}