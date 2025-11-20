// app/courses/[courseId]/quizzes/[quizId]/take/page.jsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Clock, Send, AlertCircle, CheckCircle,
  ChevronLeft, ChevronRight, Flag, Loader
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function TakeQuizPage() {
  const params = useParams();
  const router = useRouter();
  const { courseId, quizId } = params;

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const timerInterval = useRef(null);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    startQuiz();
    
    // Warn user before leaving page
    const handleBeforeUnload = (e) => {
      if (!hasSubmitted.current) {
        e.preventDefault();
        e.returnValue = 'Your quiz is in progress. If you leave now, you will lose all your answers. Are you sure?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [courseId, quizId]);

  useEffect(() => {
    if (quiz && attempt) {
      // Initialize empty answers
      const initialAnswers = {};
      quiz.questions.forEach(question => {
        initialAnswers[question._id] = {
          questionType: question.questionType,
          selectedOptionIndex: undefined,
          textAnswer: ''
        };
      });
      setAnswers(initialAnswers);

      // Start timer
      if (quiz.timeLimit > 0) {
        const startTime = new Date(attempt.startedAt).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        const remaining = (quiz.timeLimit * 60) - elapsed;
        
        if (remaining <= 0) {
          handleSubmit(true); // Auto-submit if time's up
        } else {
          setTimeRemaining(remaining);
        }
      }

      // Set up elapsed time tracking
      const startTime = new Date(attempt.startedAt).getTime();
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }
  }, [quiz, attempt]);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      timerInterval.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerInterval.current);
    }
  }, [timeRemaining]);

  useEffect(() => {
    // Track elapsed time
    const elapsedInterval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(elapsedInterval);
  }, []);

  const startQuiz = async () => {
    try {
      // Start attempt
      const startResponse = await authClient.fetchWithAuth(
        `/api/student/courses/${courseId}/quizzes/${quizId}/start`,
        { method: 'POST' }
      );

      if (!startResponse.ok) {
        const error = await startResponse.json();
        alert(error.message);
        router.push(`/courses/${courseId}/dashboard`);
        return;
      }

      const startData = await startResponse.json();
      
      // Get quiz questions
      const questionsResponse = await authClient.fetchWithAuth(
        `/api/student/courses/${courseId}/quizzes/${quizId}/questions?attemptId=${startData.attempt._id}`
      );

      if (questionsResponse.ok) {
        const data = await questionsResponse.json();
        setQuiz(data.quiz);
        setAttempt(data.attempt);
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert('Failed to start quiz');
      router.push(`/courses/${courseId}/dashboard`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value, type) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionType: type,
        ...(type === 'multiple_choice' 
          ? { selectedOptionIndex: value }
          : { textAnswer: value }
        )
      }
    }));
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (submitting || hasSubmitted.current) return;

    if (!autoSubmit && !confirm('Are you sure you want to submit your quiz? You cannot change your answers after submission.')) {
      return;
    }

    setSubmitting(true);
    hasSubmitted.current = true;

    try {
      // Prepare answers to save
      const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        questionType: answer.questionType,
        selectedOptionIndex: answer.selectedOptionIndex,
        textAnswer: answer.textAnswer
      }));

      // Save and submit in one call
      await authClient.fetchWithAuth(
        `/api/student/courses/${courseId}/quizzes/${quizId}/save`,
        {
          method: 'PUT',
          body: JSON.stringify({
            attemptId: attempt._id,
            answers: answersArray
          })
        }
      );

      // Submit quiz
      const response = await authClient.fetchWithAuth(
        `/api/student/courses/${courseId}/quizzes/${quizId}/submit`,
        {
          method: 'POST',
          body: JSON.stringify({
            attemptId: attempt._id,
            timeSpent: timeElapsed
          })
        }
      );

      if (response.ok) {
        // Clear intervals
        if (timerInterval.current) clearInterval(timerInterval.current);

        // Redirect to results
        router.push(`/courses/${courseId}/quizzes/${quizId}/results?attemptId=${attempt._id}`);
      } else {
        const error = await response.json();
        alert(error.message);
        hasSubmitted.current = false;
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
      hasSubmitted.current = false;
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.values(answers).filter(answer => {
      if (answer.questionType === 'multiple_choice') {
        return answer.selectedOptionIndex !== undefined && answer.selectedOptionIndex !== null;
      }
      return answer.textAnswer && answer.textAnswer.trim() !== '';
    }).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader className="animate-spin h-16 w-16 text-primary mx-auto mb-4" />
          <p className="text-foreground/60 font-semibold">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz || !attempt) {
    return null;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const answeredCount = getAnsweredCount();
  const totalQuestions = quiz.questions.length;

  return (
    <div className="min-h-screen bg-background py-8 px-4 mt-32">
      <div className="container mx-auto max-w-4xl">
        {/* Warning Banner */}
        <div className="bg-warning/10 border-2 border-warning/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-warning flex-shrink-0" size={20} />
            <p className="text-sm text-foreground font-bold">
              ⚠️ Your answers are NOT auto-saved. Make sure to complete and submit the quiz before leaving this page.
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="bg-card border-2 border-foreground/10 rounded-2xl p-6 mb-6 sticky top-4 z-10 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-foreground">{quiz.title}</h1>
              <p className="text-sm text-foreground/60">
                Attempt #{attempt.attemptNumber} • Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>

            {timeRemaining !== null && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${
                timeRemaining < 300 
                  ? 'bg-error/10 text-error border-2 border-error/30' 
                  : 'bg-primary/10 text-primary border-2 border-primary/30'
              }`}>
                <Clock size={20} />
                <span className="text-xl">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-foreground/60 mt-2 font-semibold">
            <span>{answeredCount} of {totalQuestions} answered</span>
            <span>{Math.round((answeredCount / totalQuestions) * 100)}% complete</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-card border-2 border-foreground/10 rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center font-black text-primary text-xl flex-shrink-0">
              {currentQuestionIndex + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  currentQuestion.questionType === 'multiple_choice'
                    ? 'bg-secondary/10 text-secondary border-2 border-secondary/30'
                    : 'bg-accent/10 text-accent border-2 border-accent/30'
                }`}>
                  {currentQuestion.questionType === 'multiple_choice' ? 'Multiple Choice' : 'Text Answer'}
                </span>
                <span className="text-sm font-bold text-foreground/60">
                  {currentQuestion.pointsWorth} {currentQuestion.pointsWorth === 1 ? 'point' : 'points'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground leading-relaxed">
                {currentQuestion.questionText}
              </h2>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            {currentQuestion.questionType === 'multiple_choice' ? (
              currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerChange(currentQuestion._id, index, 'multiple_choice')}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    answers[currentQuestion._id]?.selectedOptionIndex === index
                      ? 'border-primary bg-primary/10 shadow-lg'
                      : 'border-foreground/20 hover:border-primary/40 bg-background'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion._id]?.selectedOptionIndex === index
                        ? 'border-primary bg-primary'
                        : 'border-foreground/30'
                    }`}>
                      {answers[currentQuestion._id]?.selectedOptionIndex === index && (
                        <CheckCircle className="text-background" size={16} />
                      )}
                    </div>
                    <span className="font-semibold text-foreground">{option.text}</span>
                  </div>
                </button>
              ))
            ) : (
              <textarea
                value={answers[currentQuestion._id]?.textAnswer || ''}
                onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value, 'text_answer')}
                rows={8}
                placeholder="Type your answer here..."
                className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-card border-2 border-foreground/20 text-foreground rounded-xl font-bold hover:border-primary hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex(Math.min(totalQuestions - 1, currentQuestionIndex + 1))}
              className="px-6 py-3 bg-primary text-background rounded-xl font-bold hover:bg-accent transition-all flex items-center gap-2"
            >
              Next
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-6 py-3 bg-success text-background rounded-xl font-bold hover:bg-success/90 transition-all flex items-center gap-2"
            >
              <Send size={20} />
              Submit Quiz
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="bg-card border-2 border-foreground/10 rounded-2xl p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Flag size={20} className="text-primary" />
            Question Navigator
          </h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {quiz.questions.map((q, index) => {
              const isAnswered = answers[q._id] && (
                (answers[q._id].questionType === 'multiple_choice' && answers[q._id].selectedOptionIndex !== undefined) ||
                (answers[q._id].questionType === 'text_answer' && answers[q._id].textAnswer?.trim())
              );

              return (
                <button
                  key={q._id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`aspect-square rounded-lg font-bold transition-all ${
                    index === currentQuestionIndex
                      ? 'bg-primary text-background shadow-lg scale-110'
                      : isAnswered
                      ? 'bg-success/20 text-success border-2 border-success/30 hover:bg-success/30'
                      : 'bg-background border-2 border-foreground/20 text-foreground/60 hover:border-primary/40'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border-2 border-foreground/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="text-warning" size={24} />
                </div>
                <h3 className="text-2xl font-black text-foreground">Submit Quiz?</h3>
              </div>

              <p className="text-foreground/70 mb-4">
                You have answered <strong>{answeredCount} out of {totalQuestions}</strong> questions.
              </p>

              {answeredCount < totalQuestions && (
                <div className="bg-warning/10 border-2 border-warning/30 rounded-xl p-4 mb-6">
                  <p className="text-sm text-warning font-bold">
                    ⚠️ You have {totalQuestions - answeredCount} unanswered question(s). 
                    These will receive 0 points.
                  </p>
                </div>
              )}

              <p className="text-foreground/70 mb-6">
                Once submitted, you cannot change your answers. Are you sure you want to continue?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-primary text-background rounded-xl font-bold hover:bg-accent transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Yes, Submit
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-background border-2 border-foreground/20 text-foreground rounded-xl font-bold hover:border-foreground/40 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}