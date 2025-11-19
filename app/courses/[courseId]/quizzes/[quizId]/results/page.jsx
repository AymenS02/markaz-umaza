// app/courses/[courseId]/quizzes/[quizId]/results/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, CheckCircle, XCircle, Clock, Award,
  AlertCircle, Star, TrendingUp, FileText, MessageSquare,
  Loader, Trophy, Target, BarChart3
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function QuizResultsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { courseId, quizId } = params;
  const attemptId = searchParams.get('attemptId');

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (courseId && quizId && attemptId) {
      fetchResults();
    }
  }, [courseId, quizId, attemptId]);

  const fetchResults = async () => {
    try {
      const response = await authClient.fetchWithAuth(
        `/api/student/courses/${courseId}/quizzes/${quizId}/results?attemptId=${attemptId}`
      );

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        router.push(`/courses/${courseId}/dashboard`);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      router.push(`/courses/${courseId}/dashboard`);
    } finally {
      setLoading(false);
    }
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader className="animate-spin h-16 w-16 text-primary mx-auto mb-4" />
          <p className="text-foreground/60 font-semibold">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const { attempt, quiz, needsGrading } = results;
  const isPassed = attempt.passed;
  const score = attempt.scorePercentage || 0;

  return (
    <div className="min-h-screen bg-background py-8 px-4 mt-32">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/courses/${courseId}/dashboard`}
            className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-4 font-bold group"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Dashboard
          </Link>

          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">
            {quiz.title}
          </h1>
          <p className="text-foreground/60 font-semibold">
            Attempt #{attempt.attemptNumber} Results
          </p>
        </div>

        {/* Pending Grading Notice */}
        {needsGrading && (
          <div className="bg-warning/10 border-2 border-warning/30 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="text-warning" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Awaiting Instructor Review
                </h3>
                <p className="text-foreground/70 leading-relaxed mb-3">
                  Your quiz has been submitted successfully! Some questions require manual grading 
                  by the instructor. Your current score reflects only the auto-graded questions.
                </p>
                <p className="text-sm text-foreground/60 font-semibold">
                  You&apos;ll receive an update from your instructor once grading is complete
                  for all questions. Check back later for your final score.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Score Card */}
        <div className="bg-card border-2 border-foreground/10 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left Side - Grade */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <div className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center font-black border-4 ${
                  needsGrading 
                    ? 'bg-warning/10 text-warning border-warning/30'
                    : isPassed 
                    ? 'bg-success/10 text-success border-success/30' 
                    : 'bg-error/10 text-error border-error/30'
                }`}>
                  <div className="text-4xl">{getLetterGrade(score)}</div>
                  <div className="text-sm">{score}%</div>
                </div>
                
                {!needsGrading && (
                  <div className="text-left">
                    {isPassed ? (
                      <>
                        <div className="flex items-center gap-2 text-success mb-1">
                          <CheckCircle size={24} />
                          <span className="text-2xl font-black">Passed!</span>
                        </div>
                        <p className="text-sm text-foreground/60 font-semibold">
                          Great job! You met the passing score.
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-error mb-1">
                          <XCircle size={24} />
                          <span className="text-2xl font-black">Not Passed</span>
                        </div>
                        <p className="text-sm text-foreground/60 font-semibold">
                          Required: {quiz.passingScore}% to pass
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2 text-foreground/70">
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm">
                  <Target size={16} />
                  <span className="font-semibold">
                    {attempt.totalPointsEarned} / {attempt.totalPointsPossible} points
                  </span>
                </div>
                {attempt.timeSpent && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-sm">
                    <Clock size={16} />
                    <span className="font-semibold">Time: {formatTime(attempt.timeSpent)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-foreground mb-1">
                  {attempt.answers.filter(a => a.pointsEarned === a.pointsWorth).length}
                </div>
                <div className="text-sm text-foreground/60 font-semibold">Correct</div>
              </div>
              
              <div className="bg-background rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-foreground mb-1">
                  {attempt.answers.filter(a => a.pointsEarned === 0 && !a.needsGrading).length}
                </div>
                <div className="text-sm text-foreground/60 font-semibold">Incorrect</div>
              </div>
              
              <div className="bg-background rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-foreground mb-1">
                  {attempt.answers.filter(a => a.needsGrading).length}
                </div>
                <div className="text-sm text-foreground/60 font-semibold">Pending</div>
              </div>
              
              <div className="bg-background rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-foreground mb-1">
                  {quiz.questions.length}
                </div>
                <div className="text-sm text-foreground/60 font-semibold">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Feedback */}
        {attempt.overallFeedback && (
          <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <Star className="text-primary flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Instructor Feedback
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {attempt.overallFeedback}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Question Review */}
        <div className="bg-card border-2 border-foreground/10 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-black text-foreground mb-6 flex items-center gap-2">
            <BarChart3 size={24} className="text-primary" />
            Question by Question Review
          </h2>

          <div className="space-y-6">
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
                  className={`bg-background border-2 rounded-xl p-6 ${
                    isPending ? 'border-warning/30' :
                    isCorrect ? 'border-success/30' :
                    isPartial ? 'border-primary/30' :
                    'border-error/30'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black ${
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
                              Awaiting Grade
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-foreground">
                          {question.questionText}
                        </h3>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className={`text-xl font-black ${
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
                            className={`p-3 rounded-lg border-2 ${
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
                                <span className="text-xs font-bold text-foreground/60">Your Answer</span>
                              )}
                              {isCorrectAnswer && !isStudentAnswer && (
                                <span className="text-xs font-bold text-success">Correct Answer</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Text Answer Review */}
                  {question.questionType === 'text_answer' && (
                    <div className="mb-4">
                      <div className="bg-card rounded-lg p-4 border border-foreground/10 mb-3">
                        <div className="text-sm font-bold text-foreground/60 mb-2">Your Answer:</div>
                        <p className="text-foreground whitespace-pre-wrap">
                          {answer.textAnswer || <em className="text-foreground/40">No answer provided</em>}
                        </p>
                      </div>

                      {!isPending && question.sampleAnswer && (
                        <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
                          <div className="text-sm font-bold text-accent mb-2">Sample Answer:</div>
                          <p className="text-foreground/70 whitespace-pre-wrap text-sm">
                            {question.sampleAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Individual Question Feedback */}
                  {answer.feedback && (
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="text-primary flex-shrink-0 mt-0.5" size={18} />
                        <div>
                          <div className="text-sm font-bold text-primary mb-1">Instructor Feedback:</div>
                          <p className="text-foreground/80 text-sm">{answer.feedback}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/courses/${courseId}/dashboard`}
            className="flex-1 px-8 py-4 bg-primary text-background rounded-xl font-bold hover:bg-accent transition-all text-center"
          >
            Return to Dashboard
          </Link>
          
          {!needsGrading && attempt.attemptNumber < quiz.maxAttempts && (
            <Link
              href={`/courses/${courseId}/quizzes/${quizId}/take`}
              className="flex-1 px-8 py-4 bg-secondary text-background rounded-xl font-bold hover:bg-secondary/90 transition-all text-center"
            >
              Try Again (Attempt {attempt.attemptNumber + 1}/{quiz.maxAttempts})
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}