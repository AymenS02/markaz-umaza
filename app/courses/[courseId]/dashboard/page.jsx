// app/courses/[courseId]/dashboard/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, BookOpen, Trophy, Clock, CheckCircle,
  AlertCircle, Award, TrendingUp, Calendar, FileText,
  Target, Zap, Play, Lock, BarChart3, Star, User
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function StudentDashboard() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId;

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (courseId) {
      fetchDashboardData();
    }
  }, [courseId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await authClient.fetchWithAuth(
        `/api/student/courses/${courseId}/dashboard`
      );

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else if (response.status === 403) {
        router.push('/courses');
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      router.push('/courses');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getGradeColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-primary';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getLetterGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    if (score >= 55) return 'C-';
    if (score >= 50) return 'D';
    return 'F';
  };

  const isQuizAvailable = (quiz) => {
    const now = new Date();
    if (quiz.availableFrom && new Date(quiz.availableFrom) > now) return false;
    if (quiz.availableUntil && new Date(quiz.availableUntil) < now) return false;
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { course, enrollment, modules, stats, availableQuizzes, grades } = dashboardData;

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:mt-32">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-4 font-bold group"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Courses
          </Link>

          <div className="bg-card border-2 border-foreground/10 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">
                  {course.title}
                </h1>
                <p className="text-foreground/60 font-semibold flex items-center gap-2">
                  <User size={18} />
                  {course.instructor}
                </p>
              </div>

              {/* <div className="flex flex-col items-start md:items-end gap-2">
                <div className="text-sm text-foreground/60 font-bold">Overall Progress</div>
                <div className="text-4xl font-black text-primary">
                  {enrollment.progress || 0}%
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border-2 border-foreground/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="text-primary" size={24} />
              </div>
              <div>
                <div className="text-sm text-foreground/60 font-bold">Total Quizzes</div>
                <div className="text-2xl font-black text-foreground">{stats.totalQuizzes}</div>
              </div>
            </div>
          </div>

          <div className="bg-card border-2 border-foreground/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-success" size={24} />
              </div>
              <div>
                <div className="text-sm text-foreground/60 font-bold">Completed</div>
                <div className="text-2xl font-black text-foreground">{stats.completedQuizzes}</div>
              </div>
            </div>
          </div>

          <div className="bg-card border-2 border-foreground/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-accent" size={24} />
              </div>
              <div>
                <div className="text-sm text-foreground/60 font-bold">Avg Score</div>
                <div className={`text-2xl font-black ${getGradeColor(stats.averageScore)}`}>
                  {stats.averageScore}%
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border-2 border-foreground/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Award className="text-secondary" size={24} />
              </div>
              <div>
                <div className="text-sm text-foreground/60 font-bold">Total Points</div>
                <div className="text-2xl font-black text-foreground">
                  {stats.totalPoints}/{stats.possiblePoints}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-primary text-background'
                : 'bg-card border-2 border-foreground/10 text-foreground/70 hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'quizzes'
                ? 'bg-primary text-background'
                : 'bg-card border-2 border-foreground/10 text-foreground/70 hover:text-foreground'
            }`}
          >
            Available Quizzes ({availableQuizzes.length})
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'grades'
                ? 'bg-primary text-background'
                : 'bg-card border-2 border-foreground/10 text-foreground/70 hover:text-foreground'
            }`}
          >
            Grades ({grades.length})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Course Description */}
            <div className="bg-card border-2 border-foreground/10 rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground mb-6 flex items-center gap-2">
                <BookOpen size={24} className="text-primary" />
                Course Description
              </h2>

              <div className="space-y-4">
                <p className="text-foreground leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border-2 border-foreground/10 rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground mb-6 flex items-center gap-2">
                <Clock size={24} className="text-secondary" />
                Recent Activity
              </h2>

              {grades.length === 0 ? (
                <div className="text-center py-8 text-foreground/60">
                  No quiz attempts yet
                </div>
              ) : (
                <div className="space-y-3">
                  {grades.slice(0, 5).map((grade, index) => (
                    <div
                      key={`${grade.quizId}-${index}`}
                      className="flex items-center justify-between p-4 bg-background rounded-lg border border-foreground/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black ${
                          grade.passed ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                        }`}>
                          {grade.passed ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">{grade.quizTitle}</div>
                          <div className="text-sm text-foreground/60">
                            {formatDate(grade.submittedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-black ${getGradeColor(grade.score)}`}>
                          {grade.score}%
                        </div>
                        <div className="text-sm text-foreground/60">
                          {grade.pointsEarned}/{grade.totalPoints} pts
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Available Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <div className="space-y-6">
            <div className="bg-card border-2 border-foreground/10 rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground mb-6 flex items-center gap-2">
                <Target size={24} className="text-primary" />
                Available Quizzes
              </h2>

              {availableQuizzes.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="mx-auto text-foreground/20 mb-4" size={64} />
                  <h3 className="text-xl font-bold text-foreground/60 mb-2">
                    All caught up!
                  </h3>
                  <p className="text-foreground/40">
                    You&apos;ve completed all available quizzes for this course.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableQuizzes.map(quiz => {
                    const available = isQuizAvailable(quiz);
                    return (
                      <div
                        key={quiz._id}
                        className="bg-background border-2 border-foreground/10 rounded-xl p-6 hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-foreground">{quiz.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                quiz.quizType === 'practice' ? 'bg-secondary/10 text-secondary' :
                                quiz.quizType === 'graded' ? 'bg-primary/10 text-primary' :
                                quiz.quizType === 'midterm' ? 'bg-accent/10 text-accent' :
                                'bg-error/10 text-error'
                              }`}>
                                {quiz.quizType}
                              </span>
                            </div>
                            {quiz.description && (
                              <p className="text-sm text-foreground/60 mb-3">{quiz.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-foreground/10">
                          <div className="text-sm">
                            <span className="text-foreground/60">Questions:</span>
                            <span className="font-bold text-foreground ml-2">{quiz.questionsCount}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-foreground/60">Points:</span>
                            <span className="font-bold text-foreground ml-2">{quiz.totalPoints}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-foreground/60">Time Limit:</span>
                            <span className="font-bold text-foreground ml-2">
                              {quiz.timeLimit > 0 ? `${quiz.timeLimit} min` : 'No limit'}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-foreground/60">Pass:</span>
                            <span className="font-bold text-foreground ml-2">{quiz.passingScore}%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm text-foreground/60">
                            Attempts: <span className="font-bold text-foreground">
                              {quiz.attemptsUsed}/{quiz.maxAttempts}
                            </span>
                          </div>
                          {quiz.lastAttemptScore !== null && (
                            <div className={`text-sm font-bold ${getGradeColor(quiz.lastAttemptScore)}`}>
                              Last: {quiz.lastAttemptScore}%
                            </div>
                          )}
                        </div>

                        {!available ? (
                          <button
                            disabled
                            className="w-full px-6 py-3 bg-foreground/5 text-foreground/40 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2 border-2 border-foreground/10"
                          >
                            <Lock size={18} />
                            {quiz.availableFrom && new Date(quiz.availableFrom) > new Date()
                              ? `Available ${formatDate(quiz.availableFrom)}`
                              : 'No longer available'}
                          </button>
                        ) : (
                          <Link
                            href={`/courses/${courseId}/quizzes/${quiz._id}/take`}
                            className="w-full px-6 py-3 bg-primary text-background rounded-xl font-bold hover:bg-accent transition-all flex items-center justify-center gap-2"
                          >
                            <Play size={18} />
                            Start Quiz
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Grades Tab */}
        {activeTab === 'grades' && (
          <div className="space-y-6">
            <div className="bg-card border-2 border-foreground/10 rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground mb-6 flex items-center gap-2">
                <BarChart3 size={24} className="text-accent" />
                Your Grades
              </h2>

              {grades.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto text-foreground/20 mb-4" size={64} />
                  <h3 className="text-xl font-bold text-foreground/60 mb-2">
                    No grades yet
                  </h3>
                  <p className="text-foreground/40">
                    Complete a quiz to see your grades here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {grades.map((grade, index) => (
                    <div
                      key={`${grade.quizId}-${index}`}
                      className="bg-background border-2 border-foreground/10 rounded-xl p-6 hover:border-primary/30 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center font-black border-2 ${
                            grade.passed 
                              ? 'bg-success/10 text-success border-success/30' 
                              : 'bg-error/10 text-error border-error/30'
                          }`}>
                            <div className="text-2xl">{getLetterGrade(grade.score)}</div>
                            <div className="text-xs">{grade.score}%</div>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground mb-1">
                              {grade.quizTitle}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-foreground/60">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {formatDate(grade.submittedAt)}
                              </span>
                              <span>Attempt #{grade.attemptNumber}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-3xl font-black text-primary mb-1">
                            {grade.pointsEarned}/{grade.totalPoints}
                          </div>
                          <div className="text-sm text-foreground/60 font-semibold">points</div>
                        </div>
                      </div>

                      {grade.feedback && (
                        <div className="mt-4 pt-4 border-t border-foreground/10">
                          <div className="flex items-start gap-2">
                            <Star className="text-accent flex-shrink-0 mt-1" size={18} />
                            <div>
                              <div className="text-sm font-bold text-foreground mb-1">
                                Instructor Feedback:
                              </div>
                              <p className="text-sm text-foreground/70 leading-relaxed">
                                {grade.feedback}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex gap-3">
                        <Link
                          href={`/courses/${courseId}/quizzes/${grade.quizId}/results?attemptId=${grade.attemptId}`}
                          className="flex-1 px-4 py-2 bg-secondary/10 text-secondary border-2 border-secondary/30 rounded-lg font-bold hover:bg-secondary/20 transition-all text-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}