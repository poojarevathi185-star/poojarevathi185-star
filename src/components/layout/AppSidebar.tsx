import React, { useState } from 'react';
import { PageView } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { GitHubConnectModal } from '../common/GitHubConnectModal.js';
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Wrench,
  FileText,
  HelpCircle,
  TrendingUp,
  Bookmark,
  History,
  User,
  LogOut,
  ShieldAlert,
  Upload,
  Video,
  Github,
} from 'lucide-react';

interface AppSidebarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const [gitHubModalOpen, setGitHubModalOpen] = useState(false);

  const navItems: Array<{ page: PageView; label: string; icon: React.ReactNode; badge?: string }> = [
    { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { page: 'demo-video', label: 'Demo Video', icon: <Video className="w-4 h-4 text-rose-600 animate-pulse" />, badge: 'Watch' },
    { page: 'assistant', label: 'AI Assistant', icon: <Sparkles className="w-4 h-4 text-purple-600" />, badge: 'Gemini' },
    { page: 'subjects', label: 'Subjects', icon: <BookOpen className="w-4 h-4 text-blue-600" /> },
    { page: 'study-tools', label: 'Study Tools', icon: <Wrench className="w-4 h-4 text-amber-600" /> },
    { page: 'materials', label: 'Study Material', icon: <Upload className="w-4 h-4 text-emerald-600" /> },
    { page: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4 text-teal-600" /> },
    { page: 'quiz', label: 'Quiz', icon: <HelpCircle className="w-4 h-4 text-indigo-600" /> },
    { page: 'progress', label: 'My Progress', icon: <TrendingUp className="w-4 h-4 text-rose-600" /> },
    { page: 'saved-answers', label: 'Saved Answers', icon: <Bookmark className="w-4 h-4 text-cyan-600" /> },
    { page: 'chat-history', label: 'Chat History', icon: <History className="w-4 h-4 text-slate-600" /> },
    { page: 'profile', label: 'Profile', icon: <User className="w-4 h-4 text-violet-600" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* User Mini Card */}
        {user && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-indigo-50/70 to-slate-50 border border-indigo-100/70">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200 shrink-0"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.course}</p>
              <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-indigo-100 text-indigo-700">
                {user.role} • {user.year}
              </span>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Learning Portal
          </p>
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                      isActive ? 'bg-indigo-500 text-white' : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Admin link if user is admin */}
          {user?.role === 'admin' && (
            <div className="pt-3 border-t border-slate-200 mt-2">
              <p className="px-3 text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-1">
                Admin Area
              </p>
              <button
                onClick={() => onNavigate('admin')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  currentPage === 'admin'
                    ? 'bg-amber-600 text-white'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* GitHub & Logout buttons at bottom */}
      <div className="p-4 border-t border-slate-100 space-y-1.5">
        <button
          onClick={() => setGitHubModalOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4 text-slate-800" />
            <span>GitHub Repo</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </button>

        <button
          onClick={async () => {
            await logout();
            onNavigate('home');
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* GitHub Connect Modal */}
      <GitHubConnectModal
        isOpen={gitHubModalOpen}
        onClose={() => setGitHubModalOpen(false)}
        userEmail={user?.email || 'sanjayrevathi2006@gmail.com'}
      />
    </aside>
  );
};
