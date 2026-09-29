import React, { useState, useEffect } from 'react';
import { PageView, DashboardStats } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import {
  Sparkles,
  HelpCircle,
  FileText,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  Zap,
  Bookmark,
  Layers,
  ChevronRight,
  UploadCloud,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: PageView, extra?: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-purple-800 p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-indigo-100 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Learning Portal Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>

          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed font-normal">
            Ready to study today? Ask questions, generate exam-ready answers, create notes, or practice interactive quizzes tailored to your syllabus.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('assistant')}
              className="px-5 py-2.5 rounded-xl font-bold bg-white text-indigo-700 hover:bg-slate-100 transition shadow-md flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Ask Gemini AI</span>
            </button>
            <button
              onClick={() => onNavigate('study-tools')}
              className="px-5 py-2.5 rounded-xl font-semibold bg-indigo-600/40 hover:bg-indigo-600/60 border border-white/20 text-white transition flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Launch Study Tools</span>
            </button>
            <button
              onClick={() => onNavigate('quiz')}
              className="px-5 py-2.5 rounded-xl font-semibold bg-indigo-600/40 hover:bg-indigo-600/60 border border-white/20 text-white transition flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Take a Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Questions Asked */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Questions Asked</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats?.totalQuestionsAsked ?? 0}
            </span>
            <span className="text-xs font-medium text-emerald-600">Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Real-time Gemini queries answered</p>
        </div>

        {/* Notes Created */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notes Created</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats?.notesCreated ?? 0}
            </span>
            <span className="text-xs font-medium text-slate-500">Saved</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Structured notes in your database</p>
        </div>

        {/* Quizzes Completed */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quizzes Taken</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats?.quizzesCompleted ?? 0}
            </span>
            <span className="text-xs font-medium text-indigo-600">Sessions</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Adaptive test completions</p>
        </div>

        {/* Average Quiz Score */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Quiz Score</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats?.averageQuizScore ?? 0}%
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {(stats?.averageQuizScore ?? 0) >= 75 ? 'Mastery' : 'On Track'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cumulative retention accuracy</p>
        </div>
      </div>

      {/* Quick Launchpad & Study Tools Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            Quick Learning Launchpad
          </h2>
          <button
            onClick={() => onNavigate('study-tools')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            All 8 Study Tools <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('assistant')}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Academic AI Chat</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Ask definitions, derivations, mechanisms, or conceptual clarifications.
            </p>
          </button>

          <button
            onClick={() => onNavigate('study-tools')}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-md transition text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Notes & Question Gen</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Produce college notes and 2, 5, 10-mark questions with model answers.
            </p>
          </button>

          <button
            onClick={() => onNavigate('materials')}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Upload Study Material</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Analyze lecture notes, slides, or code files with 6-in-1 AI breakdown.
            </p>
          </button>

          <button
            onClick={() => onNavigate('quiz')}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Interactive Quiz</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Generate 5 to 15 question tests with automated scoring and explanations.
            </p>
          </button>
        </div>
      </div>

      {/* Two Column Grid: Recommended Topics & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recommended Study Topics (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Recommended Study Topics for College Exams
            </h3>
            <span className="text-[11px] text-slate-400">Curated by Syllabus</span>
          </div>

          <div className="space-y-3">
            {stats?.recommendedTopics?.map((rec, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-indigo-300 transition flex items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                      {rec.subject}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition">
                      {rec.topic}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{rec.reason}</p>
                </div>

                <button
                  onClick={() =>
                    onNavigate('assistant', {
                      prefillPrompt: `Explain ${rec.topic} in ${rec.subject} with exam focus, definition, key points, and advantages.`,
                      prefillSubject: rec.subject,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white transition shrink-0 shadow-2xs"
                >
                  Study Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Log (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              Recent Learning Activity
            </h3>
            <button
              onClick={() => onNavigate('progress')}
              className="text-[11px] font-bold text-indigo-600 hover:underline"
            >
              Full Log
            </button>
          </div>

          <div className="space-y-3">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.slice(0, 6).map((act, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs border-b border-slate-100 pb-2.5 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{act.action}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                      {act.subject && <span>{act.subject}</span>}
                      <span>•</span>
                      <span>{new Date(act.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                No activities yet. Start by asking Gemini a question!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
