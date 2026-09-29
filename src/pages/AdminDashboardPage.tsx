import React, { useState, useEffect } from 'react';
import { PageView, AdminStats, User } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import {
  ShieldAlert,
  Users,
  Sparkles,
  HelpCircle,
  FileText,
  TrendingUp,
  Award,
  CheckCircle,
  AlertTriangle,
  Lock,
  ArrowRight,
  RefreshCw,
  Search,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (page: PageView) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchUser, setSearchUser] = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, usersData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
      ]);
      setStats(statsData);
      setUsersList(usersData);
    } catch (err: any) {
      setError(err.message || 'Failed to load administrator data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (targetUser: User) => {
    const newRole = targetUser.role === 'admin' ? 'student' : 'admin';
    if (!window.confirm(`Change ${targetUser.name}'s role to "${newRole}"?`)) return;

    try {
      await api.updateUserRole(targetUser.id, newRole);
      setUsersList((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole as any } : u))
      );
    } catch (err: any) {
      alert(`Role update failed: ${err.message}`);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Administrator Access Required</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            This management console is restricted to university department coordinators and academic administrators.
          </p>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left text-xs space-y-1">
            <span className="font-bold text-amber-900 block">College Project Testing Tip:</span>
            <p className="text-amber-800">
              Log out and sign in with the pre-seeded admin credentials:
              <strong className="block mt-0.5">Email: admin@college.edu</strong>
              <strong>Password: admin123</strong>
            </p>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
          >
            Back to Student Dashboard
          </button>
        </div>
      </div>
    );
  }

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.course.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-600" />
            University Academic Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            System overview, registered student accounts, usage analytics, and role governance
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs">
          {error}
        </div>
      )}

      {/* 6 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Total Accounts</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats?.totalUsers ?? 0}</span>
            <span className="text-xs text-indigo-600 font-semibold">
              ({stats?.studentCount ?? 0} students, {stats?.adminCount ?? 0} admin)
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Total registered student profiles</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Active Users (7 Days)</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {stats?.activeUsersCount ?? 0}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Active</span>
          </div>
          <p className="text-[11px] text-slate-400">Students actively studying</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Total AI Queries</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {stats?.totalQuestionsAsked ?? 0}
            </span>
            <span className="text-xs text-purple-600 font-semibold">Processed</span>
          </div>
          <p className="text-[11px] text-slate-400">Gemini 3.8 academic executions</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Quizzes Completed</span>
            <HelpCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {stats?.totalQuizzesCompleted ?? 0}
            </span>
            <span className="text-xs text-blue-600 font-semibold">Tests</span>
          </div>
          <p className="text-[11px] text-slate-400">Adaptive tests taken by students</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Study Notes Created</span>
            <FileText className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {stats?.totalNotesCreated ?? 0}
            </span>
            <span className="text-xs text-teal-600 font-semibold">Saved</span>
          </div>
          <p className="text-[11px] text-slate-400">Private notes in user repositories</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Materials Analyzed</span>
            <TrendingUp className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {stats?.totalMaterialsAnalyzed ?? 0}
            </span>
            <span className="text-xs text-rose-600 font-semibold">Docs/Files</span>
          </div>
          <p className="text-[11px] text-slate-400">Uploaded slides and lecture notes</p>
        </div>
      </div>

      {/* Popular Subjects Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Subject Activity Distribution
        </h3>

        {stats?.subjectCounts && Object.keys(stats.subjectCounts).length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(stats.subjectCounts).map(([subj, count], idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-xs font-bold text-slate-800 block truncate">{subj}</span>
                <span className="text-lg font-extrabold text-indigo-600">{count} queries</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No subject queries logged yet.</p>
        )}
      </div>

      {/* User Management Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              User Management & Access Control ({usersList.length})
            </h3>
            <p className="text-xs text-slate-500">
              Review registered users and assign administrator credentials
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Search user..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Course & Year</th>
                <th className="py-3 px-4">Role Badge</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2.5">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <span>{u.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{u.email}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {u.course} • <span className="text-slate-400">{u.year}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleRole(u)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                    >
                      {u.role === 'admin' ? 'Demote to Student' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
