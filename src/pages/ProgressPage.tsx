import React, { useState, useEffect } from 'react';
import { PageView, DashboardStats, QuizResult } from '../types/index.js';
import { api } from '../services/api.js';
import {
  TrendingUp,
  Award,
  HelpCircle,
  FileText,
  Sparkles,
  BookOpen,
  Clock,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

interface ProgressPageProps {
  onNavigate: (page: PageView, extra?: any) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, quizData] = await Promise.all([
        api.getDashboardStats(),
        api.getQuizResults(),
      ]);
      setStats(statsData);
      setQuizResults(quizData);
    } catch (err) {
      console.error('Failed to load progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-rose-600" />
          My Learning Progress & Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Real-time metrics, quiz retention scores, and study timeline tracked across your sessions
        </p>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Questions Explored
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {stats?.totalQuestionsAsked ?? 0}
            </span>
            <span className="text-xs text-purple-600 font-semibold">Gemini Queries</span>
          </div>
          <p className="text-[11px] text-slate-400">Total chat inquiries & solutions</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Quizzes Completed
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {stats?.quizzesCompleted ?? 0}
            </span>
            <span className="text-xs text-blue-600 font-semibold">Evaluations</span>
          </div>
          <p className="text-[11px] text-slate-400">Adaptive tests taken</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Average Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {stats?.averageQuizScore ?? 0}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Cumulative</span>
          </div>
          <p className="text-[11px] text-slate-400">Retention & accuracy rating</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Subjects Covered
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {stats?.subjectsCount ?? 0}
            </span>
            <span className="text-xs text-teal-600 font-semibold">Disciplines</span>
          </div>
          <p className="text-[11px] text-slate-400">Academic domains touched</p>
        </div>
      </div>

      {/* Two Column Layout: Quiz Performance History & Learning Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Quiz Performance & Score Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Recent Quiz Scores & Topic Mastery
            </h3>
            <button
              onClick={() => onNavigate('quiz')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              Take Another Quiz →
            </button>
          </div>

          {quizResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <HelpCircle className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">No quiz scores recorded yet.</p>
              <button
                onClick={() => onNavigate('quiz')}
                className="text-xs text-indigo-600 underline font-bold"
              >
                Start your first quiz now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {quizResults.slice(0, 6).map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        {quiz.subject}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">{quiz.topic}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-slate-900 block">
                        {quiz.score}/{quiz.totalQuestions}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          quiz.percentage >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : quiz.percentage >= 60
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {quiz.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar Visual */}
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        quiz.percentage >= 80
                          ? 'bg-emerald-500'
                          : quiz.percentage >= 60
                          ? 'bg-blue-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${quiz.percentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block text-right">
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Full Learning Activity Timeline (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              Complete Activity Stream
            </h3>
            <span className="text-xs text-slate-400">Audit Log</span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((act) => (
                <div key={act.id} className="flex items-start gap-3 border-l-2 border-indigo-200 pl-3 py-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800">{act.action}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                      {act.subject && (
                        <span className="text-indigo-600 font-semibold">{act.subject}</span>
                      )}
                      <span>•</span>
                      <span>{new Date(act.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No recent activities recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
