'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Search, Filter, Clock, CheckCircle,
  AlertCircle, User, Mail, Calendar, Award, FileText,
  Loader, Eye, Users
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function GradeQuizPage() {
  const params = useParams();
  const router = useRouter();
  const { courseId, quizId } = params;

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (courseId && quizId) {
      fetchQuizAndAttempts();
    }
  }, [courseId, quizId]);

  const fetchQuizAndAttempts = async () => {
    try {
      // Fetch quiz details
      const quizResponse = await authClient.fetchWithAuth(
        `/api/admin/courses/${courseId}/quizzes/${quizId}`
      );

      if (quizResponse.ok) {
        const quizData = await quizResponse.json();
        setQuiz(quizData);
      }

      // Fetch all attempts
      const attemptsResponse = await authClient.fetchWithAuth(
        `/api/admin/courses/${courseId}/quizzes/${quizId}/attempts`
      );

      if (attemptsResponse.ok) {
        const attemptsData = await attemptsResponse.json();
        setAttempts(attemptsData);
      }
    } catch (error) {
      console.error('Error fetching quiz attempts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGradeColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-primary';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const filteredAttempts = attempts.filter(attempt => {
    // Add null checks for user data
    const userName = attempt.user?.name || '';
    const userEmail = attempt.user?.email || '';
    
    const matchesSearch = userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'needs_grading' && attempt.needsGrading) ||
      (filterStatus === 'graded' && !attempt.needsGrading);
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader className="animate-spin h-16 w-16 text-primary mx-auto mb-4" />
          <p className="text-foreground/60 font-semibold">Loading quiz attempts...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="text-error mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Not Found</h2>
          <Link
            href={`/admin/courses/${courseId}/quizzes`}
            className="text-primary hover:underline"
          >
            Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  const needsGradingCount = attempts.filter(a => a.needsGrading).length;
  const gradedCount = attempts.filter(a => !a.needsGrading && a.status === 'graded').length;

  return (
    <div className="min-h-screen bg-background py-8 px-4 mt-32">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/admin/courses/${courseId}/quizzes`}
            className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-4 font-bold group"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Quizzes
          </Link>

          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">
            Grade Quiz: {quiz.title}
          </h1>
          <p className="text-foreground/60 font-semibold">
            Review and grade student submissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border-2 border-foreground/10 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="text-primary" size={24} />
              </div>
              <div>
                <div className="text-sm text-foreground/60 font-bold">Total Submissions</div>
                <div className="text-2xl font-black text-foreground">{attempts.length}</div>
              </div>
            </div>
          </div>

          <div className="bg-card border-2 border-foreground/10 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="text-warning" size={24} />
              </div>
              <div>
                <div className="text-sm text-foreground/60 font-bold">Needs Grading</div>
                <div className="text-2xl font-black text-foreground">{needsGradingCount}</div>
              </div>
            </div>
          </div>

          <div className="bg-card border-2 border-foreground/10 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-success" size={24} />
              </div>
              <div>
                <div className="text-sm text-foreground/60 font-bold">Fully Graded</div>
                <div className="text-2xl font-black text-foreground">{gradedCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border-2 border-foreground/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
              <input
                type="text"
                placeholder="Search by student name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground placeholder:text-foreground/40 transition-all"
              />
            </div>

            <div className="relative md:w-64">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground appearance-none cursor-pointer transition-all font-bold"
              >
                <option value="all">All Attempts</option>
                <option value="needs_grading">Needs Grading</option>
                <option value="graded">Fully Graded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Attempts List */}
        <div className="bg-card border-2 border-foreground/10 rounded-2xl p-6">
          <h2 className="text-2xl font-black text-foreground mb-6 flex items-center gap-2">
            <FileText size={24} className="text-primary" />
            Student Attempts ({filteredAttempts.length})
          </h2>

          {filteredAttempts.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto text-foreground/20 mb-4" size={64} />
              <h3 className="text-xl font-bold text-foreground/60 mb-2">
                No attempts found
              </h3>
              <p className="text-foreground/40">
                {attempts.length === 0 
                  ? 'No students have submitted this quiz yet.'
                  : 'Try adjusting your search or filters.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAttempts.map((attempt) => (
                <div
                  key={attempt._id}
                  className="bg-background border-2 border-foreground/10 rounded-xl p-6 hover:border-primary/30 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-black ${
                        attempt.needsGrading 
                          ? 'bg-warning/10 text-warning' 
                          : 'bg-success/10 text-success'
                      }`}>
                        {attempt.needsGrading ? (
                          <Clock size={24} />
                        ) : (
                          <CheckCircle size={24} />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-foreground">
                            {attempt.user?.firstName || 'Unknown'} {attempt.user?.lastName || 'Student'}
                          </h3>
                          {attempt.needsGrading && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-warning/10 text-warning border-2 border-warning/30">
                              Needs Grading
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                          <span className="flex items-center gap-1">
                            <Mail size={14} />
                            {attempt.user?.email || 'No email'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(attempt.submittedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Award size={14} />
                            Attempt #{attempt.attemptNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-3xl font-black ${getGradeColor(attempt.scorePercentage || 0)}`}>
                          {attempt.scorePercentage || 0}%
                        </div>
                        <div className="text-sm text-foreground/60 font-semibold">
                          {attempt.totalPointsEarned || 0}/{attempt.totalPointsPossible} pts
                        </div>
                      </div>

                      <Link
                        href={`/admin/courses/${courseId}/quizzes/${quizId}/grade/${attempt._id}`}
                        className="px-6 py-3 bg-primary text-background rounded-xl font-bold hover:bg-accent transition-all flex items-center gap-2"
                      >
                        <Eye size={18} />
                        Grade
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}