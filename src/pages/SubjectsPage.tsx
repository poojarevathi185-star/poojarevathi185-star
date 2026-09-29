import React from 'react';
import { PageView } from '../types/index.js';
import {
  Laptop,
  Coins,
  Sigma,
  BookOpen,
  TrendingUp,
  Briefcase,
  Code2,
  Globe2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface SubjectsPageProps {
  onNavigate: (page: PageView, extra?: any) => void;
}

interface SubjectCard {
  id: string;
  name: string;
  icon: React.ReactNode;
  badgeColor: string;
  description: string;
  topics: string[];
  popularPrompt: string;
}

export const SubjectsPage: React.FC<SubjectsPageProps> = ({ onNavigate }) => {
  const subjects: SubjectCard[] = [
    {
      id: 'cs',
      name: 'Computer Science',
      icon: <Laptop className="w-6 h-6 text-indigo-600" />,
      badgeColor: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      description:
        'Operating Systems, Database Management Systems (DBMS), Computer Networks, Data Structures, Software Engineering, and Computer Architecture.',
      topics: ['Deadlocks & Semaphores', 'SQL & Normalization', 'TCP/IP Model', 'Tree Traversals'],
      popularPrompt: 'Explain Operating Systems Process Scheduling algorithms (FCFS, SJF, Round Robin) with a comparative chart.',
    },
    {
      id: 'commerce',
      name: 'Commerce',
      icon: <Coins className="w-6 h-6 text-amber-600" />,
      badgeColor: 'bg-amber-50 border-amber-200 text-amber-700',
      description:
        'Financial Accounting, Corporate Auditing, Business Law, Cost Accounting, Banking, and Taxation principles.',
      topics: ['Double-Entry Ledger', 'Balance Sheet Analysis', 'Goods & Services Tax', 'Depreciation Methods'],
      popularPrompt: 'Explain the difference between Capital Expenditure and Revenue Expenditure with real college accounting examples.',
    },
    {
      id: 'math',
      name: 'Mathematics',
      icon: <Sigma className="w-6 h-6 text-blue-600" />,
      badgeColor: 'bg-blue-50 border-blue-200 text-blue-700',
      description:
        'Calculus, Linear Algebra, Probability & Statistics, Discrete Mathematics, Differential Equations, and Numerical Methods.',
      topics: ['Eigenvalues & Eigenvectors', 'Bayes Theorem', 'Taylor Series', 'Graph Theory'],
      popularPrompt: 'Derive Bayes Theorem and explain its real-world application in probabilistic diagnostic tests.',
    },
    {
      id: 'english',
      name: 'English',
      icon: <BookOpen className="w-6 h-6 text-emerald-600" />,
      badgeColor: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      description:
        'Academic writing, Technical Report Writing, English Literature, Grammar & Syntax, Reading Comprehension, and Professional Communication.',
      topics: ['Active vs. Passive Voice', 'Formal Essay Structure', 'Literary Analysis', 'Business Correspondence'],
      popularPrompt: 'Explain the 7 Cs of effective business communication with situational examples.',
    },
    {
      id: 'economics',
      name: 'Economics',
      icon: <TrendingUp className="w-6 h-6 text-rose-600" />,
      badgeColor: 'bg-rose-50 border-rose-200 text-rose-700',
      description:
        'Microeconomics, Macroeconomics, Monetary Economics, Public Finance, International Trade, and Development Economics.',
      topics: ['Supply & Demand Elasticity', 'Fiscal Policy', 'Inflation Mechanisms', 'GDP Calculation'],
      popularPrompt: 'Explain the concept of Opportunity Cost and how it dictates production possibility frontiers.',
    },
    {
      id: 'business',
      name: 'Business Studies',
      icon: <Briefcase className="w-6 h-6 text-purple-600" />,
      badgeColor: 'bg-purple-50 border-purple-200 text-purple-700',
      description:
        'Principles of Management, Human Resource Management, Strategic Marketing, Organizational Behavior, and Entrepreneurship.',
      topics: ['SWOT & PESTLE Analysis', 'Maslow Hierarchy', 'Marketing 4Ps', 'Leadership Styles'],
      popularPrompt: 'Explain Fayols 14 Principles of Management with modern corporate illustrations.',
    },
    {
      id: 'programming',
      name: 'Programming',
      icon: <Code2 className="w-6 h-6 text-teal-600" />,
      badgeColor: 'bg-teal-50 border-teal-200 text-teal-700',
      description:
        'Python, Java, C/C++, JavaScript, Web Development, Object-Oriented Programming (OOP), and Algorithms implementation.',
      topics: ['OOP 4 Pillars', 'Async/Await & Promises', 'Recursion & Dynamic Programming', 'REST APIs'],
      popularPrompt: 'Explain the four pillars of Object-Oriented Programming (OOP) with clean code examples.',
    },
    {
      id: 'gk',
      name: 'General Knowledge',
      icon: <Globe2 className="w-6 h-6 text-cyan-600" />,
      badgeColor: 'bg-cyan-50 border-cyan-200 text-cyan-700',
      description:
        'Global Affairs, Modern Science & Technology, World Geography, Constitutional Studies, and General Aptitude.',
      topics: ['Constitutional Rights', 'Space Exploration', 'Climate Policy', 'Scientific Innovations'],
      popularPrompt: 'Explain how the United Nations General Assembly and Security Council function together.',
    },
  ];

  const handleStartSubject = (subject: SubjectCard) => {
    onNavigate('assistant', {
      prefillSubject: subject.name,
      prefillPrompt: subject.popularPrompt,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          Academic Subjects Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Select any college syllabus domain to open Gemini Assistant pre-configured for that discipline
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {sub.icon}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sub.badgeColor}`}>
                  Active Syllabus
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
                  {sub.description}
                </p>
              </div>

              {/* Topics tags */}
              <div className="pt-2 flex flex-wrap gap-1.5">
                {sub.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Button */}
            <div className="pt-5 mt-4 border-t border-slate-100">
              <button
                onClick={() => handleStartSubject(sub)}
                className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/20 transition cursor-pointer"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
