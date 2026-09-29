import React, { useState } from 'react';
import { PageView } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { GitHubConnectModal } from '../common/GitHubConnectModal.js';
import {
  Sparkles,
  BookOpen,
  LayoutDashboard,
  Brain,
  Wrench,
  Info,
  Mail,
  User,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  FileText,
  Video,
  Github,
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [gitHubModalOpen, setGitHubModalOpen] = useState(false);

  const handleNav = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    onNavigate('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 text-left group transition"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  Gemini Learning
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-indigo-100 text-indigo-700">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Powered Learning Assistant
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === 'home'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('subjects')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === 'subjects'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Subjects
            </button>
            <button
              onClick={() => handleNav('study-tools')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === 'study-tools'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Study Tools
            </button>
            <button
              onClick={() => handleNav('assistant')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                currentPage === 'assistant'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
              AI Assistant
            </button>
            <button
              onClick={() => handleNav('demo-video')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                currentPage === 'demo-video'
                  ? 'bg-rose-50 text-rose-700 font-semibold ring-1 ring-rose-200'
                  : 'text-slate-700 hover:text-rose-600 hover:bg-rose-50/50'
              }`}
            >
              <Video className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>Demo Video</span>
              <span className="px-1 py-0.2 bg-rose-100 text-rose-700 rounded text-[9px] font-black uppercase tracking-wider">
                Watch
              </span>
            </button>
            <button
              onClick={() => handleNav('about')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === 'about'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleNav('contact')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === 'contact'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Contact
            </button>

            {user && (
              <button
                onClick={() => handleNav('dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  currentPage === 'dashboard'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                Dashboard
              </button>
            )}
          </nav>

          {/* User Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* GitHub Connect Button */}
            <button
              onClick={() => setGitHubModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
              title="Connect your GitHub repository"
            >
              <Github className="w-3.5 h-3.5 text-white" />
              <span>GitHub</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-indigo-200"
                  />
                  <div className="text-left text-xs">
                    <span className="font-semibold text-slate-800 block leading-tight truncate max-w-[120px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-indigo-600 uppercase tracking-wider font-bold">
                      {user.role}
                    </span>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <p className="text-[10px] text-indigo-600 font-medium mt-0.5">{user.course}</p>
                    </div>

                    <button
                      onClick={() => handleNav('dashboard')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => handleNav('profile')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      My Profile
                    </button>
                    <button
                      onClick={() => handleNav('notes')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-slate-400" />
                      My Notes
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                        Admin Dashboard
                      </button>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('signup')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-lg shadow-sm shadow-indigo-500/20 hover:shadow-md transition"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('subjects')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
          >
            Subjects
          </button>
          <button
            onClick={() => handleNav('study-tools')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
          >
            Study Tools
          </button>
          <button
            onClick={() => handleNav('assistant')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-700 bg-indigo-50/70 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            AI Assistant
          </button>
          <button
            onClick={() => handleNav('demo-video')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-rose-700 bg-rose-50 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-rose-600" />
              <span>Project Demo Video</span>
            </div>
            <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-rose-200 text-rose-800">
              Watch
            </span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setGitHubModalOpen(true);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-900 bg-slate-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 text-slate-800" />
              <span>Connect GitHub Repository</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </button>
          <button
            onClick={() => handleNav('about')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
          >
            About
          </button>
          <button
            onClick={() => handleNav('contact')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
          >
            Contact
          </button>

          {user ? (
            <div className="pt-3 border-t border-slate-200 mt-2 space-y-1">
              <div className="px-3 py-2 bg-slate-50 rounded-lg mb-2">
                <p className="text-xs font-bold text-slate-800">{user.name}</p>
                <p className="text-[11px] text-slate-500">{user.email}</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-indigo-100 text-indigo-700">
                  {user.role}
                </span>
              </div>
              <button
                onClick={() => handleNav('dashboard')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                Dashboard
              </button>
              <button
                onClick={() => handleNav('profile')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-slate-500" />
                My Profile
              </button>
              {user.role === 'admin' && (
                <button
                  onClick={() => handleNav('admin')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Admin Dashboard
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 mt-2 flex flex-col gap-2">
              <button
                onClick={() => handleNav('login')}
                className="w-full text-center py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Log In
              </button>
              <button
                onClick={() => handleNav('signup')}
                className="w-full text-center py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 shadow-sm"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}

      {/* GitHub Connect Modal */}
      <GitHubConnectModal
        isOpen={gitHubModalOpen}
        onClose={() => setGitHubModalOpen(false)}
        userEmail={user?.email || 'sanjayrevathi2006@gmail.com'}
      />
    </header>
  );
};
