import React, { useState } from 'react';
import { PageView } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, CheckCircle, ShieldCheck, Zap } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: PageView) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, loginAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFastDemoLogin = async (type: 'student' | 'admin') => {
    setLoading(true);
    setError(null);
    try {
      await loginAsGuest(type);
      onNavigate(type === 'admin' ? 'admin' : 'dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type: 'student' | 'admin') => {
    if (type === 'student') {
      setEmail('student@college.edu');
      setPassword('student123');
    } else {
      setEmail('admin@college.edu');
      setPassword('admin123');
    }
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 items-center justify-center text-white shadow-md shadow-indigo-500/20 mb-1">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Student & Faculty Login</h2>
          <p className="text-xs text-slate-500">
            Sign in to access your Gemini study assistant, notes, and quiz records
          </p>
        </div>

        {/* Demo Fast Login Bar */}
        <div className="p-3.5 bg-gradient-to-br from-indigo-50 to-purple-50/60 rounded-xl border border-indigo-200 space-y-2">
          <p className="text-[11px] font-bold text-indigo-950 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
              1-Click Instant Demo Login
            </span>
            <span className="text-[9px] text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded font-bold">
              Instant Access
            </span>
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleFastDemoLogin('student')}
              className="py-2 px-2.5 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-indigo-800 font-semibold transition text-left cursor-pointer shadow-xs"
            >
              🎓 Student Demo
              <span className="block text-[10px] text-indigo-600 font-normal mt-0.5">Click to Login →</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleFastDemoLogin('admin')}
              className="py-2 px-2.5 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-indigo-800 font-semibold transition text-left cursor-pointer shadow-xs"
            >
              🛡️ Admin Demo
              <span className="block text-[10px] text-indigo-600 font-normal mt-0.5">Click to Login →</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="text-indigo-600 font-bold hover:underline"
            >
              Sign Up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
