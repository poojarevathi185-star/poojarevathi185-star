import React, { useState } from 'react';
import {
  Github,
  Check,
  Copy,
  ExternalLink,
  Download,
  Terminal,
  X,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Globe,
} from 'lucide-react';

interface GitHubConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export const GitHubConnectModal: React.FC<GitHubConnectModalProps> = ({
  isOpen,
  onClose,
  userEmail = 'sanjayrevathi2006@gmail.com',
}) => {
  const defaultUsername = userEmail.split('@')[0] || 'sanjayrevathi2006';
  const [username, setUsername] = useState(defaultUsername);
  const [repoName, setRepoName] = useState('gemini-learning-assistant');
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  if (!isOpen) return null;

  const repoUrl = `https://github.com/${username}/${repoName}`;
  const gitCommands = `# 1. Initialize Git in project directory
git init

# 2. Add all project files
git add .

# 3. Create initial commit
git commit -m "feat: Gemini Learning Assistant college project with direct AI answers"

# 4. Set main branch
git branch -M main

# 5. Connect remote GitHub repository
git remote add origin ${repoUrl}.git

# 6. Push to GitHub
git push -u origin main`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(id);
    setTimeout(() => setIsCopied(null), 2500);
  };

  const handleDownloadZipNotice = () => {
    const readmeContent = `# ${repoName}
> Gemini Powered Learning Assistant for College Students

## 🚀 Overview
An intelligent educational platform providing direct on-screen academic explanations, 7 study tools, interactive quizzes, and full-stack student dashboard.

### 🛠️ Tech Stack
- Frontend: React 19, TypeScript, Tailwind CSS, Lucide Icons
- Backend: Express, Node.js, tsx
- AI Engine: Google GenAI (Gemini 3.8 Flash & Fallback Academic Engine)
- PDF Engine: jsPDF
- Repository: ${repoUrl}

### 📦 Setup & Run
\`\`\`bash
npm install
npm run dev
\`\`\`
`;
    const blob = new Blob([readmeContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
    alert('Project documentation (README.md) downloaded! Use the Git commands below to push all source files directly to your GitHub repository.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Connect GitHub Repository</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                  {isConnected ? 'Connected' : 'Setup'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Sync and push your project to GitHub for college submission & portfolio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* GitHub Profile Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>github.com/{username}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </p>
                <p className="text-[11px] text-slate-500">{userEmail}</p>
                <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">
                  Repo: {repoName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-400 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs transition"
              >
                <span>Open Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setIsConnected(!isConnected)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                {isConnected ? '✓ Connected' : 'Connect'}
              </button>
            </div>
          </div>

          {/* Repository Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">GitHub Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                placeholder="e.g. sanjayrevathi2006"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Repository Name</label>
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                placeholder="e.g. gemini-learning-assistant"
              />
            </div>
          </div>

          {/* Quick Terminal Push Commands */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-indigo-600" />
                <span>One-Click Push Commands to Your GitHub Repo</span>
              </span>
              <button
                onClick={() => handleCopy(gitCommands, 'git-all')}
                className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                {isCopied === 'git-all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied === 'git-all' ? 'Copied All Commands!' : 'Copy Commands'}</span>
              </button>
            </div>

            <div className="relative rounded-2xl bg-slate-950 p-4 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
              <pre className="text-[11px] leading-relaxed text-indigo-200/90 whitespace-pre">
                {gitCommands}
              </pre>
            </div>
          </div>

          {/* Target URL Preview */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <GitBranch className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-slate-500">Repository Link:</span>
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-indigo-600 hover:underline truncate"
              >
                {repoUrl}
              </a>
            </div>
            <button
              onClick={() => handleCopy(repoUrl, 'repo-url')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-slate-700 shrink-0 cursor-pointer"
            >
              {isCopied === 'repo-url' ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={handleDownloadZipNotice}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 font-bold text-slate-700 flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Download Project Docs</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs"
            >
              Done & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
