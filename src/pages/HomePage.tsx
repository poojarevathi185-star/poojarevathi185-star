import React from 'react';
import { PageView } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import {
  Sparkles,
  BookOpen,
  Brain,
  FileText,
  HelpCircle,
  UploadCloud,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Award,
  Zap,
  Clock,
  Layers,
  ShieldCheck,
  ChevronRight,
  Video,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageView, extra?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const handleStartLearning = () => {
    if (user) {
      onNavigate('dashboard');
    } else {
      onNavigate('signup');
    }
  };

  const handleAskGemini = () => {
    if (user) {
      onNavigate('assistant');
    } else {
      onNavigate('assistant');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e0e7ff25_1px,transparent_1px),linear-gradient(to_bottom,#e0e7ff25_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                <span>Next-Generation College Learning Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Learn Smarter with <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Gemini AI
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Your personal AI-powered learning assistant for questions, notes, summaries, quizzes and personalized study.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={handleStartLearning}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 text-sm sm:text-base cursor-pointer"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleAskGemini}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300/80 shadow-xs hover:border-indigo-400 transition flex items-center justify-center gap-2.5 text-sm sm:text-base cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Ask Gemini</span>
                </button>
                <button
                  onClick={() => onNavigate('demo-video')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 shadow-xs hover:border-rose-300 transition flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer group"
                >
                  <Video className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform animate-pulse" />
                  <span>Demo Video</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-rose-200 text-rose-800 tracking-wider">
                    Watch
                  </span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Verified College Syllabus Ready</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>8 College Academic Subjects</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Secure Server-Side Gemini 3.8</span>
                </div>
              </div>
            </div>

            {/* Right Column: AI / Education Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow backdrop */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-3xl blur-lg opacity-30 animate-pulse" />
                
                {/* Interactive Mock Card */}
                <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-slate-900 px-5 py-4 flex items-center justify-between text-white border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="ml-2 text-xs font-mono text-slate-300">
                        Gemini Tutor Session
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Exam Prep
                    </span>
                  </div>

                  {/* Chat Preview Body */}
                  <div className="p-5 space-y-4 text-xs sm:text-sm bg-slate-50/50">
                    {/* Student Bubble */}
                    <div className="flex items-start gap-2.5 justify-end">
                      <div className="bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-xs max-w-[85%] shadow-sm">
                        <p className="font-medium">
                          Explain Cloud Computing architecture and service models for a 10-mark exam question.
                        </p>
                      </div>
                    </div>

                    {/* Gemini AI Bubble */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="bg-white text-slate-800 p-4 rounded-2xl rounded-tl-xs border border-slate-200 shadow-xs space-y-2.5 max-w-[90%]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                          <span className="font-bold text-indigo-700 text-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Gemini 3.8 Flash Answer
                          </span>
                          <span className="text-[10px] text-slate-400">Response Style: Exam Answer</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-sans">
                          <strong>1. Definition:</strong> On-demand delivery of compute, storage, and databases over the internet with zero local hardware management.
                        </p>
                        <div className="p-2 rounded bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-950 font-mono">
                          IaaS (Compute) ➔ PaaS (Runtime) ➔ SaaS (Apps)
                        </div>
                        <p className="text-xs text-slate-600">
                          <strong>2. Key Exam Points:</strong> Elasticity, CapEx to OpEx conversion, Multi-region fault tolerance...
                        </p>
                        <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-600 font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Includes Marking Rubric & 4 Diagrams Outline</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Quick Action Bar */}
                  <div className="bg-slate-100/90 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      Instant AI Generation
                    </span>
                    <button
                      onClick={() => onNavigate('assistant')}
                      className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
                    >
                      Try with your question <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
              Full Suite of AI Tools
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything College Students Need in One Platform
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Say goodbye to generic AI chatbots. Gemini Powered Learning Assistant is engineered specifically for academic rigor, exam preparation, and syllabus comprehension.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: AI Chat Assistant */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition group">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Gemini Academic Assistant
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                Ask any complex academic question. Choose from 5 response modes: Simple, Detailed, Exam Answer, Step-by-Step, or Beginner Friendly.
              </p>
              <button
                onClick={() => onNavigate('assistant')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Launch AI Assistant <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: 8 Study Tools */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-purple-300 transition group">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                8 Dedicated Study Tools
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                Text Summarizer, Structured Notes Generator, Question Bank Builder, MCQ Generator, Exam Answer Formatter, and Study Timetable Planner.
              </p>
              <button
                onClick={() => onNavigate('study-tools')}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                Explore Study Tools <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: Interactive Quizzes */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Adaptive MCQ & Quiz Engine
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                Generate real quizzes on any subject or topic with 5, 10, or 15 questions. Take interactive tests with instant scores and explanations.
              </p>
              <button
                onClick={() => onNavigate('quiz')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Take a Quiz <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 4: Study Material Upload */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                File & Material Analyzer
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                Upload lecture slides, notes, or images. Gemini extracts key definitions, generates practice Q&As, and creates executive study sheets.
              </p>
              <button
                onClick={() => onNavigate('materials')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                Upload Material <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 5: Smart Notes Management */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-300 transition group">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Persistent Study Notes
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                Save Gemini generated notes directly into your private database. Edit, tag, search, and export notes anytime before your semester exams.
              </p>
              <button
                onClick={() => onNavigate('notes')}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                View Notes <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 6: Progress & Learning Analytics */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-rose-300 transition group">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Progress & Mastery Tracking
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                Track your questions asked, quiz scores, completed topics, and learning velocity with transparent real-time statistics.
              </p>
              <button
                onClick={() => onNavigate('progress')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                Track Progress <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-100/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
              Seamless Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How Gemini Learning Assistant Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A 3-step structured pathway to mastering your syllabus and acing exams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm mb-4 shadow-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Select Subject & Input Question
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Choose your field—Computer Science, Commerce, Mathematics, or Programming—and type your question or upload your lecture notes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-extrabold flex items-center justify-center text-sm mb-4 shadow-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Gemini Synthesizes Structured Output
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Gemini 3.8 processes your academic query on our secure server, providing structured definitions, key points, examples, and exam marks schemes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm mb-4 shadow-sm">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Save Notes & Practice Quizzes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Save answers to your profile, generate instant practice MCQs, test your retention, and track your study milestones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                Student Advantages
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Built to Solve Real College Exam Challenges
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Standard textbooks are often dense and lecture slides can be incomplete. Gemini Powered Learning Assistant provides clear, structured clarity when you need it most.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Custom Exam Answer Formatting</h4>
                    <p className="text-xs text-slate-600">Get answers specifically proportioned for 2, 5, 10, or 15 marks so you never write too much or too little.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Zero Technical Fluff</h4>
                    <p className="text-xs text-slate-600">Break difficult algorithms or economic theorems into intuitive everyday analogies you will never forget.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Private & Persistent Data</h4>
                    <p className="text-xs text-slate-600">Your notes, chat history, saved answers, and quiz scores stay securely tied to your student account.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStartLearning}
                  className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition flex items-center gap-2 text-sm"
                >
                  Create Free Student Account <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Subjects Preview */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Supported College Disciplines
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Computer Science', icon: '💻', desc: 'OS, DBMS, DSA, Networks' },
                  { name: 'Mathematics', icon: '📐', desc: 'Calculus, Matrices, Stats' },
                  { name: 'Commerce', icon: '📊', desc: 'Accounting, Auditing, Tax' },
                  { name: 'Economics', icon: '📈', desc: 'Micro, Macro, Monetary' },
                  { name: 'Programming', icon: '⚡', desc: 'Python, C++, Java, Web' },
                  { name: 'Business Studies', icon: '💼', desc: 'Management, HR, Marketing' },
                  { name: 'English', icon: '📚', desc: 'Grammar, Literature, Essays' },
                  { name: 'General Knowledge', icon: '🌍', desc: 'Current Affairs, Science' },
                ].map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => onNavigate('subjects')}
                    className="p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition text-left group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{s.icon}</span>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {s.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 via-blue-700 to-purple-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-100 text-xs font-semibold backdrop-blur-xs">
            <GraduationCap className="w-4 h-4" />
            <span>Ready for Exam Success</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Elevate Your College Academic Performance Today
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Join students using Gemini Powered Learning Assistant to generate notes, master tough questions, and prepare for upcoming exams.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleStartLearning}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-white text-indigo-700 hover:bg-slate-100 shadow-lg shadow-black/10 transition text-sm cursor-pointer"
            >
              Get Started Now — It's Free
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold bg-indigo-600/40 hover:bg-indigo-600/60 border border-white/20 text-white transition text-sm cursor-pointer"
            >
              Learn More About Project
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
