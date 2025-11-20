// app/admin/courses/[courseId]/quizzes/[quizId]/grade/[attemptId]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, User, Mail, Calendar, Clock, Award,
  CheckCircle, XCircle, Save, Send, AlertCircle,
  FileText, MessageSquare, Loader, TrendingUp, Target
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function GradeAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const { courseId, quizId, attemptId } = params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [attempt, setAttempt] = useState(null);
  const [grades, setGrades] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [overallFeedback, setOverallFeedback] = useState('');

  useEffect(() => {
    if (attemptId) {
      fetchAttempt();
    }
  }, [attemptId]);

  const fetchAttempt = async () => {
    try {
      const response = await authClient.fetchWithAuth(
        `/api/admin/courses/${courseId}/quizzes/${quizId}/attempts/${attemptId}`
      );

      if (response.ok) {
        const data = await response.json();
        setAttempt(data);
        setOverallFeedback(data.overallFeedback || '');

        // Initialize grades and feedbacks from existing data
        const initialGrades = {};
        const initialFeedbacks = {};

        data.answers.forEach(answer => {
          initialGrades[answer.questionId] = answer.pointsEarned || 0;
          initialFeedbacks[answer.questionId] = answer.feedback || '';
        });

        setGrades(initialGrades);
        setFeedbacks(initialFeedbacks);
      }
    } catch (error) {
      console.error('Error fetching attempt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (questionId, value) => {
    setGrades(prev => ({
      ...prev,
      [questionId]: parseFloat(value) || 0
    }));
  };

  const handleFeedbackChange = (questionId, value) => {
    setFeedbacks(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const saveGrade = async (questionId) => {
    setSaving(true);
    try {
      const response = await authClient.fetchWithAuth(
        `/api/admin/courses/${courseId}/quizzes/${quizId}/attempts/${attemptId}/grade`,
        {
          method: 'PUT',
          body: JSON.stringify({
            questionId,
            pointsEarned: grades[questionId],
            feedback: feedbacks[questionId]
          })
        }
      );

      if (response.ok) {
        const updatedAttempt = await response.json();
        setAttempt(updatedAttempt);
        alert('Grade saved successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save grade');
      }
    } catch (error) {
      console.error('Error saving grade:', error);
      alert('Failed to save grade');
    } finally {
      setSaving(false);
    }
  };

  const saveOverallFeedback = async () => {
    setSaving(true);
    try {
      const response = await authClient.fetchWithAuth(
        `/api/admin/courses/${courseId}/quizzes/${quizId}/attempts/${attemptId}/grade`,
        {
          method: 'POST',
          body: JSON.stringify({ overallFeedback })
        }
      );

      if (response.ok) {
        alert('Overall feedback saved!');
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
      alert('Failed to save feedback');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader className="animate-spin h-16 w-16 text-primary mx-auto mb-4" />
          <p className="text-foreground/60 font-semibold">Loading attempt...</p>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="text-error mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-foreground mb-2">Attempt Not Found</h2>
          <Link
            href={`/admin/courses/${courseId}/quizzes/${quizId}/grade`}
            className="text-primary hover:underline"
          >
            Back to Attempts
          </Link>
        </div>
      </div>
    );
  }

  const quiz = attempt.quiz;
  const score = attempt.scorePercentage || 0;
  const isPassed = attempt.passed;

  return (
    <div className="min-h-screen bg-background py-8 px-4 mt-32">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/admin/courses/${courseId}/quizzes/${quizId}/grade`}
            className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-4 font-bold group"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            Back to All Attempts
          </Link>

          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">
            Grading: {quiz.title}
          </h1>
          <p className="text-foreground/60 font-semibold">
            Review and grade student submission
          </p>
        </div>

        {/* Student & Attempt Info */}
        <div className="bg-card border-2 border-foreground/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Student Info */}
            <div className="flex-1">
              <h3 className="text-sm font-bold text-foreground/60 mb-3 uppercase tracking-wider">
                Student Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground">
                  <User size={18} className="text-primary" />
                  <span className="font-bold">{attempt.user?.firstName + ' ' + attempt.user?.lastName}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70">
                  <Mail size={18} className="text-secondary" />
                  <span>{attempt.user?.email}</span>
                </div>
              </div>
            </div>

            {/* Attempt Info */}
            <div className="flex-1">
              <h3 className="text-sm font-bold text-foreground/60 mb-3 uppercase tracking-wider">
                Attempt Details
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground/70">
                  <Calendar size={18} className="text-accent" />
                  <span>Submitted: {formatDate(attempt.submittedAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70">
                  <Award size={18} className="text-primary" />
                  <span>Attempt #{attempt.attemptNumber}</span>
                </div>
                {attempt.timeSpent && (
                  <div className="flex items-center gap-2 text-foreground/70">
                    <Clock size={18} className="text-secondary" />
                    <span>Time: {Math.floor(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s</span>
                  </div>
                )}
              </div>
            </div>

            {/* Current Score */}
            <div className="flex-1">
              <h3 className="text-sm font-bold text-foreground/60 mb-3 uppercase tracking-wider">
                Current Score
              </h3>
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center font-black border-4 ${
                  attempt.needsGrading 
                    ? 'bg-warning/10 text-warning border-warning/30'
                    : isPassed 
                    ? 'bg-success/10 text-success border-success/30' 
                    : 'bg-error/10 text-error border-error/30'
                }`}>
                  <div className="text-3xl">{getLetterGrade(score)}</div>
                  <div className="text-xs">{score}%</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-foreground">
                    {attempt.totalPointsEarned}/{attempt.totalPointsPossible}
                  </div>
                  <div className="text-sm text-foreground/60">points</div>
                  {attempt.needsGrading && (
                    <div className="text-xs text-warning font-bold mt-1">
                      ⚠️ Incomplete
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grading Status Alert */}
        {attempt.needsGrading && (
          <div className="bg-warning/10 border-2 border-warning/30 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-warning flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">
                  Action Required
                </h3>
                <p className="text-foreground/70">
                  This quiz contains text answer questions that require manual grading. 
                  Please review and grade all pending questions below.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Questions & Grading */}
        <div className="space-y-6 mb-8">
          {quiz.questions.map((question, index) => {
            const answer = attempt.answers.find(a => 
              a.questionId.toString() === question._id.toString()
            );

            if (!answer) return null;

            const isCorrect = answer.pointsEarned === answer.pointsWorth;
            const isIncorrect = answer.pointsEarned === 0 && !answer.needsGrading;
            const isPending = answer.needsGrading;
            const isPartial = answer.pointsEarned > 0 && answer.pointsEarned < answer.pointsWorth;

            return (
              <div 
                key={question._id}
                className={`bg-card border-2 rounded-2xl p-6 ${
                  isPending ? 'border-warning/30' :
                  isCorrect ? 'border-success/30' :
                  isPartial ? 'border-primary/30' :
                  'border-error/30'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${
                      isPending ? 'bg-warning/10 text-warning' :
                      isCorrect ? 'bg-success/10 text-success' :
                      isPartial ? 'bg-primary/10 text-primary' :
                      'bg-error/10 text-error'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
                          question.questionType === 'multiple_choice'
                            ? 'bg-secondary/10 text-secondary border-secondary/30'
                            : 'bg-accent/10 text-accent border-accent/30'
                        }`}>
                          {question.questionType === 'multiple_choice' ? 'Multiple Choice' : 'Text Answer'}
                        </span>
                        {isPending && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-warning/10 text-warning border-2 border-warning/30">
                            Needs Grading
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-foreground">
                        {question.questionText}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <div className={`text-2xl font-black ${
                      isPending ? 'text-warning' :
                      isCorrect ? 'text-success' :
                      isPartial ? 'text-primary' :
                      'text-error'
                    }`}>
                      {answer.pointsEarned} / {answer.pointsWorth}
                    </div>
                    <div className="text-xs text-foreground/60 font-semibold">points</div>
                  </div>
                </div>

                {/* Multiple Choice Review */}
                {question.questionType === 'multiple_choice' && (
                  <div className="space-y-3 mb-4">
                    {question.options.map((option, oIndex) => {
                      const isStudentAnswer = answer.selectedOptionIndex === oIndex;
                      const isCorrectAnswer = option.isCorrect;

                      return (
                        <div
                          key={oIndex}
                          className={`p-4 rounded-xl border-2 ${
                            isStudentAnswer && isCorrectAnswer
                              ? 'border-success bg-success/5'
                              : isStudentAnswer && !isCorrectAnswer
                              ? 'border-error bg-error/5'
                              : isCorrectAnswer
                              ? 'border-success/50 bg-success/5'
                              : 'border-foreground/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {isCorrectAnswer ? (
                              <CheckCircle className="text-success" size={20} />
                            ) : isStudentAnswer ? (
                              <XCircle className="text-error" size={20} />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-foreground/30"></div>
                            )}
                            <span className={`flex-1 ${
                              isStudentAnswer ? 'font-bold text-foreground' : 'text-foreground/70'
                            }`}>
                              {option.text}
                            </span>
                            {isStudentAnswer && (
                              <span className="text-xs font-bold text-foreground/60 bg-foreground/5 px-3 py-1 rounded-full">
                                Student&apos;s Answer
                              </span>
                            )}
                            {isCorrectAnswer && !isStudentAnswer && (
                              <span className="text-xs font-bold text-success bg-success/10 px-3 py-1 rounded-full">
                                Correct Answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Text Answer Review & Grading */}
                {question.questionType === 'text_answer' && (
                  <div className="space-y-4">
                    {/* Student's Answer */}
                    <div>
                      <div className="text-sm font-bold text-foreground mb-2">Student&apos;s Answer:</div>
                      <div className="bg-background rounded-xl p-4 border-2 border-foreground/10">
                        <p className="text-foreground whitespace-pre-wrap">
                          {answer.textAnswer || <em className="text-foreground/40">No answer provided</em>}
                        </p>
                      </div>
                    </div>

                    {/* Sample Answer */}
                    {question.sampleAnswer && (
                      <div>
                        <div className="text-sm font-bold text-accent mb-2">Sample Answer:</div>
                        <div className="bg-accent/5 rounded-xl p-4 border-2 border-accent/20">
                          <p className="text-foreground/70 whitespace-pre-wrap text-sm">
                            {question.sampleAnswer}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Instructor Notes */}
                    {question.instructorNotes && (
                      <div>
                        <div className="text-sm font-bold text-primary mb-2">Instructor Notes:</div>
                        <div className="bg-primary/5 rounded-xl p-4 border-2 border-primary/20">
                          <p className="text-foreground/70 text-sm">
                            {question.instructorNotes}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Grading Interface */}
                    <div className="bg-background rounded-xl p-4 border-2 border-primary/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-bold text-foreground mb-2">
                            Points Earned (Max: {answer.pointsWorth})
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={answer.pointsWorth}
                            step="0.5"
                            value={grades[answer.questionId] || 0}
                            onChange={(e) => handleGradeChange(answer.questionId, e.target.value)}
                            className="w-full px-4 py-3 bg-card border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none font-bold text-lg"
                          />
                        </div>
                        <div className="flex items-end">
                          <div className="text-center w-full">
                            <div className="text-sm text-foreground/60 mb-1">Percentage</div>
                            <div className={`text-3xl font-black ${getGradeColor((grades[answer.questionId] / answer.pointsWorth) * 100)}`}>
                              {Math.round((grades[answer.questionId] / answer.pointsWorth) * 100)}%
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-bold text-foreground mb-2">
                          Feedback for Student
                        </label>
                        <textarea
                          value={feedbacks[answer.questionId] || ''}
                          onChange={(e) => handleFeedbackChange(answer.questionId, e.target.value)}
                          rows={3}
                          placeholder="Provide feedback on this answer..."
                          className="w-full px-4 py-3 bg-card border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none resize-none"
                        />
                      </div>

                      <button
                        onClick={() => saveGrade(answer.questionId)}
                        disabled={saving}
                        className="w-full px-6 py-3 bg-primary text-background rounded-xl font-bold hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <Loader className="animate-spin" size={18} />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Save Grade for This Question
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Existing Feedback Display */}
                {answer.feedback && !isPending && (
                  <div className="mt-4 bg-primary/5 rounded-xl p-4 border-2 border-primary/20">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="text-primary flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <div className="text-sm font-bold text-primary mb-1">Your Feedback:</div>
                        <p className="text-foreground/80 text-sm">{answer.feedback}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Overall Feedback */}
        <div className="bg-card border-2 border-foreground/10 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <MessageSquare size={24} className="text-primary" />
            Overall Feedback
          </h3>
          <p className="text-sm text-foreground/60 mb-4">
            Provide general feedback or comments on the entire quiz attempt.
          </p>
          <textarea
            value={overallFeedback}
            onChange={(e) => setOverallFeedback(e.target.value)}
            rows={4}
            placeholder="Enter overall feedback for the student..."
            className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none resize-none mb-4"
          />
          <div className="flex items-center gap-6">
          <button
            onClick={saveOverallFeedback}
            disabled={saving}
            className="px-6 py-3 bg-secondary text-background rounded-xl font-bold hover:bg-secondary/90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader className="animate-spin" size={18} />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Overall Feedback
              </>
            )}
          </button>
          
          <div>
            <ArrowLeft size={16} className="inline-block ml-2 transform" />
            <span className="text-xs text-foreground/60 ml-1">Don&apos;t forget to save before completing the grading!</span>
          </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href={`/admin/courses/${courseId}/quizzes/${quizId}/grade`}
            className="flex-1 px-8 py-4 bg-card border-2 border-foreground/20 text-foreground rounded-xl font-bold hover:border-foreground/40 transition-all text-center"
          >
            Back to All Attempts
          </Link>
          <button
            onClick={() => {
              alert('All grades have been saved! Students will be notified.');
              router.push(`/admin/courses/${courseId}/quizzes/${quizId}/grade`);
            }}
            className="flex-1 px-8 py-4 bg-success text-background rounded-xl font-bold hover:bg-success/90 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} />
            Complete Grading
          </button>
        </div>
      </div>
    </div>
  );
}