import React from 'react';
import { PageView } from '../../types/index.js';
import { Sparkles, GraduationCap, Heart, Github, BookOpen } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-base tracking-tight">
                Gemini Learning
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your personal AI-powered learning assistant for academic questions, notes, summaries, quizzes and personalized college study.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-[11px] text-indigo-400 font-medium border border-slate-700/60">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>College Final Year Engineering Project</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('subjects')} className="hover:text-white transition">
                  Subjects Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('study-tools')} className="hover:text-white transition">
                  AI Study Tools
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('assistant')} className="hover:text-white transition">
                  Ask Gemini Assistant
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition">
                  Student Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Study Tools */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">AI Features</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('study-tools')} className="hover:text-white transition">
                  AI Text Summarizer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('study-tools')} className="hover:text-white transition">
                  Structured Notes Generator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('study-tools')} className="hover:text-white transition">
                  Exam Model Answer Generator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('quiz')} className="hover:text-white transition">
                  Adaptive MCQ & Quiz Engine
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('materials')} className="hover:text-white transition">
                  Study Material & File Analyzer
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & About */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Project & Contact</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition">
                  About the Project
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition">
                  Contact & Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition">
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Gemini Powered Learning Assistant. Built with Google AI Studio & Gemini 3.8 Flash.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for College Students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
