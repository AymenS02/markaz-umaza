// app/admin/courses/[courseId]/quizzes/[quizId]/edit/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Plus, Trash2, Save, Eye, EyeOff,
  CheckSquare, FileText, AlertCircle, Loader
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const { courseId, quizId } = params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modules, setModules] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Quiz form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    module: '',
    quizType: 'graded',
    timeLimit: 0,
    passingScore: 70,
    maxAttempts: 1,
    isPublished: false,
    order: 0,
    availableFrom: '',
    availableUntil: ''
  });

  // Questions state
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchData();
  }, [courseId, quizId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch modules
      const modulesResponse = await authClient.fetchWithAuth(`/api/admin/courses/${courseId}/modules`);
      if (modulesResponse.ok) {
        const modulesData = await modulesResponse.json();
        setModules(modulesData);
      }

      // Fetch quiz
      const quizResponse = await authClient.fetchWithAuth(
        `/api/admin/courses/${courseId}/quizzes/${quizId}`
      );
      
      if (quizResponse.ok) {
        const quiz = await quizResponse.json();
        
        // Set form data
        setFormData({
          title: quiz.title,
          description: quiz.description || '',
          module: quiz.module?._id || '',
          quizType: quiz.quizType,
          timeLimit: quiz.timeLimit,
          passingScore: quiz.passingScore,
          maxAttempts: quiz.maxAttempts,
          isPublished: quiz.isPublished,
          order: quiz.order,
          availableFrom: quiz.availableFrom ? new Date(quiz.availableFrom).toISOString().slice(0, 16) : '',
          availableUntil: quiz.availableUntil ? new Date(quiz.availableUntil).toISOString().slice(0, 16) : ''
        });

        // Set questions
        setQuestions(quiz.questions.map(q => ({
          _id: q._id,
          questionText: q.questionText,
          questionType: q.questionType,
          pointsWorth: q.pointsWorth,
          options: q.options || [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
          instructorNotes: q.instructorNotes || '',
          sampleAnswer: q.sampleAnswer || ''
        })));
      } else {
        setError('Failed to load quiz');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error loading quiz data');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updated = [...questions];
    
    if (field === 'isCorrect' && value) {
      updated[questionIndex].options.forEach((opt, i) => {
        opt.isCorrect = i === optionIndex;
      });
    } else {
      updated[questionIndex].options[optionIndex][field] = value;
    }
    
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        questionType: 'multiple_choice',
        pointsWorth: 1,
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ],
        instructorNotes: '',
        sampleAnswer: ''
      }
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    } else {
      setError('Quiz must have at least one question');
    }
  };

  const addOption = (questionIndex) => {
    const updated = [...questions];
    updated[questionIndex].options.push({ text: '', isCorrect: false });
    setQuestions(updated);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updated = [...questions];
    if (updated[questionIndex].options.length > 2) {
      updated[questionIndex].options.splice(optionIndex, 1);
      setQuestions(updated);
    } else {
      setError('Multiple choice questions must have at least 2 options');
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Quiz title is required');
      return false;
    }

    if (questions.length === 0) {
      setError('Quiz must have at least one question');
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      if (!q.questionText.trim()) {
        setError(`Question ${i + 1} must have question text`);
        return false;
      }

      if (!q.pointsWorth || q.pointsWorth <= 0) {
        setError(`Question ${i + 1} must have points worth greater than 0`);
        return false;
      }

      if (q.questionType === 'multiple_choice') {
        if (q.options.length < 2) {
          setError(`Question ${i + 1} must have at least 2 options`);
          return false;
        }

        const hasCorrect = q.options.some(opt => opt.isCorrect);
        if (!hasCorrect) {
          setError(`Question ${i + 1} must have at least one correct answer`);
          return false;
        }

        const emptyOption = q.options.some(opt => !opt.text.trim());
        if (emptyOption) {
          setError(`Question ${i + 1} has empty options`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...formData,
        questions: questions.map((q, index) => ({
          ...q,
          _id: q._id || undefined // Keep existing IDs for updates
        })),
        module: formData.module || null
      };

      const response = await authClient.fetchWithAuth(
        `/api/admin/courses/${courseId}/quizzes/${quizId}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess('Quiz updated successfully!');
        setTimeout(() => {
          router.push(`/admin/courses/${courseId}/quizzes`);
        }, 1500);
      } else {
        setError(data.message || 'Failed to update quiz');
      }
    } catch (error) {
      console.error('Error updating quiz:', error);
      setError('An error occurred while updating the quiz');
    } finally {
      setSaving(false);
    }
  };

  const totalPoints = questions.reduce((sum, q) => sum + (Number(q.pointsWorth) || 0), 0);

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

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/admin/courses/${courseId}/quizzes`}
            className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-4 font-bold"
          >
            <ArrowLeft size={20} />
            Back to Quizzes
          </Link>
          <h1 className="text-4xl font-black text-foreground mb-2">Edit Quiz</h1>
          <p className="text-foreground/60">Make changes to your quiz</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-error/10 border-2 border-error/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="text-error flex-shrink-0 mt-0.5" size={20} />
            <div className="text-error font-semibold">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-success/10 border-2 border-success/30 rounded-xl flex items-start gap-3">
            <CheckSquare className="text-success flex-shrink-0 mt-0.5" size={20} />
            <div className="text-success font-semibold">{success}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Settings Card */}
          <div className="bg-card border-2 border-foreground/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-black text-foreground mb-6 flex items-center gap-2">
              <FileText size={24} className="text-primary" />
              Quiz Settings
            </h2>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="e.g., Arabic Grammar Quiz 1"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Brief description of what this quiz covers..."
                />
              </div>

              {/* Module Selection */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Module (Optional)
                </label>
                <select
                  value={formData.module}
                  onChange={(e) => handleFormChange('module', e.target.value)}
                  className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="">No Module (Standalone Quiz)</option>
                  {modules.map(module => (
                    <option key={module._id} value={module._id}>
                      Module {module.order}: {module.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 1: Quiz Type & Passing Score */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Quiz Type
                  </label>
                  <select
                    value={formData.quizType}
                    onChange={(e) => handleFormChange('quizType', e.target.value)}
                    className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="practice">Practice</option>
                    <option value="graded">Graded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.passingScore}
                    onChange={(e) => handleFormChange('passingScore', Number(e.target.value))}
                    className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Time Limit & Max Attempts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Time Limit (minutes, 0 = no limit)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.timeLimit}
                    onChange={(e) => handleFormChange('timeLimit', Number(e.target.value))}
                    className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Max Attempts
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxAttempts}
                    onChange={(e) => handleFormChange('maxAttempts', Number(e.target.value))}
                    className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {/* Row 3: Available Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Available From (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.availableFrom}
                    onChange={(e) => handleFormChange('availableFrom', e.target.value)}
                    className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Available Until (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.availableUntil}
                    onChange={(e) => handleFormChange('availableUntil', e.target.value)}
                    className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => handleFormChange('isPublished', e.target.checked)}
                  className="w-5 h-5 text-primary border-2 border-foreground/20 rounded focus:ring-2 focus:ring-primary/20"
                />
                <label htmlFor="isPublished" className="flex items-center gap-2 font-bold text-foreground cursor-pointer">
                  {formData.isPublished ? <Eye size={20} className="text-primary" /> : <EyeOff size={20} className="text-foreground/40" />}
                  {formData.isPublished ? 'Published (Visible to Students)' : 'Draft (Hidden from Students)'}
                </label>
              </div>
            </div>
          </div>

          {/* Questions Card - Same as create page */}
          <div className="bg-card border-2 border-foreground/10 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
                <CheckSquare size={24} className="text-secondary" />
                Questions ({questions.length})
              </h2>
              <div className="text-sm font-bold text-foreground/60">
                Total Points: <span className="text-primary text-lg">{totalPoints}</span>
              </div>
            </div>

            <div className="space-y-6">
              {questions.map((question, qIndex) => (
                <div
                  key={qIndex}
                  className="bg-background border-2 border-foreground/10 rounded-xl p-6 hover:border-primary/30 transition-all"
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-background font-black">
                        {qIndex + 1}
                      </div>
                      <select
                        value={question.questionType}
                        onChange={(e) => handleQuestionChange(qIndex, 'questionType', e.target.value)}
                        className="px-3 py-1.5 bg-card border-2 border-foreground/20 rounded-lg text-sm font-bold text-foreground focus:border-primary focus:outline-none"
                      >
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="text_answer">Text Answer</option>
                      </select>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-all"
                      disabled={questions.length === 1}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Question Text */}
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Question Text *
                    </label>
                    <textarea
                      value={question.questionText}
                      onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-card border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      placeholder="Enter your question..."
                      required
                    />
                  </div>

                  {/* Points Worth */}
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Points Worth *
                    </label>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={question.pointsWorth}
                      onChange={(e) => handleQuestionChange(qIndex, 'pointsWorth', Number(e.target.value))}
                      className="w-32 px-4 py-3 bg-card border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>

                  {/* Multiple Choice Options */}
                  {question.questionType === 'multiple_choice' && (
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-foreground mb-3">
                        Answer Options
                      </label>
                      <div className="space-y-3">
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={option.isCorrect}
                              onChange={() => handleOptionChange(qIndex, oIndex, 'isCorrect', true)}
                              className="w-5 h-5 text-success border-2 border-foreground/20 focus:ring-2 focus:ring-success/20"
                            />
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, 'text', e.target.value)}
                              className="flex-1 px-4 py-2 bg-card border-2 border-foreground/20 rounded-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                              placeholder={`Option ${oIndex + 1}`}
                              required
                            />
                            {question.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(qIndex, oIndex)}
                                className="p-2 text-error hover:bg-error/10 rounded-lg transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => addOption(qIndex)}
                        className="mt-3 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-all flex items-center gap-2"
                      >
                        <Plus size={18} />
                        Add Option
                      </button>
                    </div>
                  )}

                  {/* Text Answer Sample */}
                  {question.questionType === 'text_answer' && (
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-foreground mb-2">
                        Sample Answer (Optional - for your reference)
                      </label>
                      <textarea
                        value={question.sampleAnswer}
                        onChange={(e) => handleQuestionChange(qIndex, 'sampleAnswer', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 bg-card border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                        placeholder="Expected answer for grading reference..."
                      />
                    </div>
                  )}

                  {/* Instructor Notes */}
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Instructor Notes (Optional - not visible to students)
                    </label>
                    <textarea
                      value={question.instructorNotes}
                      onChange={(e) => handleQuestionChange(qIndex, 'instructorNotes', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 bg-card border-2 border-foreground/20 rounded-xl text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      placeholder="Notes about grading criteria, common mistakes, etc..."
                    />
                  </div>
                </div>
              ))}

              {/* Add Question Button */}
              <button
                type="button"
                onClick={addQuestion}
                className="w-full py-4 border-2 border-dashed border-foreground/20 rounded-xl text-foreground/60 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-bold"
              >
                <Plus size={20} />
                Add Question
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-8 py-4 bg-primary text-background rounded-xl font-black text-lg hover:bg-accent hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 shadow-lg"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-background"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
            
            <Link
              href={`/admin/courses/${courseId}/quizzes`}
              className="px-8 py-4 border-2 border-foreground/20 text-foreground rounded-xl font-black text-lg hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-3"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}