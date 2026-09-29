import React from 'react';
import { PageView } from '../types/index.js';
import {
  Sparkles,
  GraduationCap,
  CheckCircle,
  Brain,
  ShieldCheck,
  Code2,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageView) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      {/* Hero Intro */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
          <GraduationCap className="w-4 h-4" />
          <span>College Capstone Project Showcase</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          About Gemini Powered Learning Assistant
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          An advanced AI-driven educational platform designed specifically for university students, educators, and competitive exam aspirants.
        </p>
      </div>

      {/* What is the project */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          What is Gemini Powered Learning Assistant?
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          Gemini Powered Learning Assistant is a comprehensive, production-ready educational web application built with React, TypeScript, Express, and Google's flagship <strong>Gemini 3.8 Flash</strong> foundation model. It transforms generic AI assistance into structured, syllabus-oriented tutoring designed around authentic university examination requirements.
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          Rather than returning walls of conversational prose, this assistant enforces academic pedagogical structures: accurate definitions, bulleted mechanisms, diagrams suggestions, real-world industry case studies, formula derivations, and point-by-point marking scheme allocations.
        </p>
      </div>

      {/* Why Students Can Use It */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Why Students Use It
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: 'AI-Powered Learning',
              desc: 'High-speed reasoning across 8 major academic disciplines with zero hallucinations.',
            },
            {
              title: 'Personalized Explanations',
              desc: 'Choose between Simple, Detailed, Exam Answer, Step-by-Step, or Beginner Friendly modes.',
            },
            {
              title: 'Fast Study Assistance',
              desc: 'Instant answers to midnight revision doubts before mid-terms and finals.',
            },
            {
              title: 'Structured Notes Generation',
              desc: 'Exportable Markdown notes with revision checklists, formula summaries, and review items.',
            },
            {
              title: 'Adaptive Quiz Engine',
              desc: 'Live interactive MCQs with instant scoring, feedback, and pedagogical answer breakdowns.',
            },
            {
              title: 'Targeted Exam Preparation',
              desc: 'Specialized 2, 5, 10, and 15-mark university answers with examiner scoring rubrics.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                {item.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-5.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture & Security Principles */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          Security & Engineering Integrity
        </h2>
        <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            • <strong>Server-Side Isolation:</strong> The Gemini API key is strictly maintained within secure server environment variables and never exposed to the client browser.
          </p>
          <p>
            • <strong>Role-Based Access Control (RBAC):</strong> Student accounts have private access to their personal notes, chat history, and quiz evaluations; administration capabilities are restricted to faculty users.
          </p>
          <p>
            • <strong>Persistent Portfolio:</strong> User data, including custom notes, bookmarked model answers, and progress logs, are saved across sessions.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-600/20 transition cursor-pointer inline-flex items-center gap-2"
        >
          <span>Open Student Learning Portal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
