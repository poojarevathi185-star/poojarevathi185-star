import React, { useState, useEffect } from 'react';
import { PageView, QuizQuestion, QuizResult } from '../types/index.js';
import { api } from '../services/api.js';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  RotateCcw,
  Award,
  Clock,
  BookOpen,
  AlertCircle,
  Check,
  ChevronRight,
  Flag,
} from 'lucide-react';

interface QuizPageProps {
  onNavigate: (page: PageView, extra?: any) => void;
  prefillSubject?: string;
  prefillTopic?: string;
}

const SUBJECTS = [
  'Computer Science',
  'Commerce',
  'Mathematics',
  'English',
  'Economics',
  'Business Studies',
  'Programming',
  'General Knowledge',
];

export const QuizPage: React.FC<QuizPageProps> = ({
  onNavigate,
  prefillSubject,
  prefillTopic,
}) => {
  // Setup state
  const [subject, setSubject] = useState(prefillSubject || 'Computer Science');
  const [topic, setTopic] = useState(prefillTopic || 'Data Structures & Algorithms');
  const [count, setCount] = useState<number>(5);

  // Active quiz state
  const [quizState, setQuizState] = useState<'setup' | 'active' | 'results'>('setup');
  const [activeQuizId, setActiveQuizId] = useState<string>('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});

  // Loading & Error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Result metrics
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  const [pastResults, setPastResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    loadPastResults();
  }, []);

  const loadPastResults = async () => {
    try {
      const data = await api.getQuizResults();
      setPastResults(data);
    } catch (err) {
      console.error('Failed to load past quiz results:', err);
    }
  };

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const quizRecord = await api.generateQuiz({
        subject,
        topic,
        count,
      });

      if (!quizRecord.questions || quizRecord.questions.length === 0) {
        throw new Error('No questions generated. Please try again.');
      }

      setActiveQuizId(quizRecord.id);
      setQuestions(quizRecord.questions);
      setUserAnswers({});
      setFlagged({});
      setCurrentIndex(0);
      setQuizState('active');
    } catch (err: any) {
      setError(err.message || 'Quiz generation failed. Please verify connection to Gemini API.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const toggleFlag = (questionId: number) => {
    setFlagged((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleSubmitQuiz = async () => {
    const unansweredCount = questions.length - Object.keys(userAnswers).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered question(s). Do you still wish to submit the quiz?`
      );
      if (!confirmSubmit) return;
    }

    // Calculate score
    let score = 0;
    for (const q of questions) {
      if (userAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    }

    try {
      const savedResult = await api.saveQuizResult({
        quizId: activeQuizId,
        subject,
        topic,
        totalQuestions: questions.length,
        score,
        userAnswers,
        questions,
      });

      setLastResult(savedResult);
      setPastResults((prev) => [savedResult, ...prev]);
      setQuizState('results');

      // Trigger celebratory confetti if score is >= 60%
      if ((score / questions.length) >= 0.6) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Failed to save quiz results:', err);
    }
  };

  const handleRetrySameQuiz = () => {
    setUserAnswers({});
    setFlagged({});
    setCurrentIndex(0);
    setQuizState('active');
  };

  const handleCreateNewQuiz = () => {
    setQuizState('setup');
    setLastResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-600" />
            Interactive Adaptive Quiz System
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Generate and take live MCQs generated by Gemini with automated scoring and explanations
          </p>
        </div>

        {quizState !== 'setup' && (
          <button
            onClick={handleCreateNewQuiz}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Quiz</span>
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* STAGE 1: SETUP FORM */}
      {quizState === 'setup' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Setup Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Configure Your Test</h2>
              <p className="text-xs text-slate-500">
                Gemini will craft academic multiple choice questions with 4 options and detailed solutions.
              </p>
            </div>

            <form onSubmit={handleGenerateQuiz} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Area
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Topic / Syllabus Concept
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Operating Systems: Process Scheduling & Deadlocks"
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Number of Questions
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[5, 10, 15].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCount(num)}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        count === num
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {num} Questions
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Topic Presets */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Popular Exam Topics:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Time Complexity & Big-O Notation',
                    'Relational Database Normalization',
                    'Supply & Demand Elasticity',
                    'Bayes Theorem & Probability',
                    'Double-Entry Bookkeeping Principles',
                    'TCP vs UDP Protocols',
                  ].map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTopic(t)}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 font-medium transition"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating Questions with Gemini 3.8...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate & Start Quiz</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Past Quiz Records (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Your Quiz Performance History
              </h3>
              <span className="text-xs text-slate-400">({pastResults.length})</span>
            </div>

            {pastResults.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <HelpCircle className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">No quizzes completed yet.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                {pastResults.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                        {res.subject}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(res.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{res.topic}</h4>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900">
                          {res.score} / {res.totalQuestions}
                        </span>
                        <span
                          className={`text-xs font-bold px-1.5 py-0.2 rounded ${
                            res.percentage >= 80
                              ? 'bg-emerald-100 text-emerald-800'
                              : res.percentage >= 60
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {res.percentage}%
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setLastResult(res);
                          setQuestions(res.questions || []);
                          setUserAnswers(res.userAnswers || {});
                          setQuizState('results');
                        }}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        Review Answers →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STAGE 2: ACTIVE QUIZ VIEW */}
      {quizState === 'active' && questions.length > 0 && (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Header Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="text-indigo-600 font-extrabold uppercase">
                {subject} • {topic}
              </span>
              <span>
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Quick Navigator Numbers */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {questions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isCurrent = currentIndex === idx;
              const isFlagged = flagged[q.id];

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center relative shrink-0 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                      : isAnswered
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 absolute -top-0.5 -right-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Question Box */}
          {(() => {
            const currentQ = questions[currentIndex];
            const selectedOption = userAnswers[currentQ.id];

            return (
              <div className="space-y-6 pt-2">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {currentIndex + 1}. {currentQ.question}
                  </h3>
                  <button
                    type="button"
                    onClick={() => toggleFlag(currentQ.id)}
                    className={`p-2 rounded-lg transition shrink-0 ${
                      flagged[currentQ.id]
                        ? 'bg-amber-100 text-amber-700'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                    title="Flag for review"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>

                {/* 4 Options */}
                <div className="space-y-3">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(currentQ.id, optIdx)}
                        className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition flex items-center justify-between group cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Navigation & Submit Bar */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition shadow-md shadow-emerald-600/20"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: RESULTS & DETAILED REVIEW */}
      {quizState === 'results' && lastResult && (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Result Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 text-center space-y-4 shadow-sm">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 items-center justify-center shadow-xs">
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Quiz Completed!</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Subject: <strong>{lastResult.subject}</strong> • Topic: <strong>{lastResult.topic}</strong>
            </p>

            {/* Score Ring / Bar */}
            <div className="flex items-center justify-center gap-6 py-4">
              <div className="text-center">
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 block">
                  {lastResult.score} / {lastResult.totalQuestions}
                </span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Total Score
                </span>
              </div>
              <div className="h-12 w-px bg-slate-200" />
              <div className="text-center">
                <span
                  className={`text-4xl sm:text-5xl font-extrabold block ${
                    lastResult.percentage >= 80
                      ? 'text-emerald-600'
                      : lastResult.percentage >= 60
                      ? 'text-blue-600'
                      : 'text-rose-600'
                  }`}
                >
                  {lastResult.percentage}%
                </span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Accuracy
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRetrySameQuiz}
                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry This Quiz</span>
              </button>
              <button
                onClick={handleCreateNewQuiz}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create New Quiz with Gemini</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Detailed Question Analysis & Explanations ({lastResult.questions?.length ?? 0})
            </h3>

            <div className="space-y-4">
              {lastResult.questions?.map((q, idx) => {
                const userAns = lastResult.userAnswers?.[q.id];
                const isCorrect = userAns === q.correctAnswer;
                const isUnanswered = userAns === undefined;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border bg-white shadow-2xs space-y-3 ${
                      isCorrect
                        ? 'border-emerald-200'
                        : isUnanswered
                        ? 'border-slate-200'
                        : 'border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-bold text-slate-900">
                        {idx + 1}. {q.question}
                      </h4>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                          <CheckCircle className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : isUnanswered ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                          Unanswered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md shrink-0">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>

                    {/* Options list with indicators */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isThisCorrect = optIdx === q.correctAnswer;
                        const isThisUserSelected = optIdx === userAns;

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl border flex items-center justify-between ${
                              isThisCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                                : isThisUserSelected
                                ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="font-mono font-bold">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span>{opt}</span>
                            </span>
                            {isThisCorrect && (
                              <span className="text-[10px] text-emerald-600 font-extrabold uppercase">
                                ✓ Correct
                              </span>
                            )}
                            {isThisUserSelected && !isThisCorrect && (
                              <span className="text-[10px] text-rose-600 font-extrabold uppercase">
                                ✗ Your Choice
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Gemini Explanation Box */}
                    <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100/90 text-xs text-indigo-950">
                      <span className="font-bold text-indigo-900 block mb-0.5">
                        Gemini Pedagogical Solution:
                      </span>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
