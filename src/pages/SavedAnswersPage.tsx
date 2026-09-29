import React, { useState, useEffect } from 'react';
import { PageView, SavedAnswer } from '../types/index.js';
import { api } from '../services/api.js';
import { MarkdownView } from '../components/common/MarkdownView.js';
import { exportAnswerToPDF, exportNoteToPDF } from '../services/pdfExport.js';
import {
  Bookmark,
  Search,
  Trash2,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  ArrowRight,
  Filter,
  FileDown,
} from 'lucide-react';

interface SavedAnswersPageProps {
  onNavigate: (page: PageView, extra?: any) => void;
}

export const SavedAnswersPage: React.FC<SavedAnswersPageProps> = ({ onNavigate }) => {
  const [answers, setAnswers] = useState<SavedAnswer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<SavedAnswer | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [exportingAll, setExportingAll] = useState(false);

  useEffect(() => {
    loadAnswers();
  }, []);

  const loadAnswers = async () => {
    try {
      const data = await api.getSavedAnswers();
      setAnswers(data);
      if (data.length > 0 && !selectedAnswer) {
        setSelectedAnswer(data[0]);
      }
    } catch (err) {
      console.error('Error fetching saved answers:', err);
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!window.confirm('Remove this answer from your saved portfolio?')) return;
    try {
      await api.deleteSavedAnswer(id);
      const remaining = answers.filter((a) => a.id !== id);
      setAnswers(remaining);
      if (selectedAnswer?.id === id) {
        setSelectedAnswer(remaining.length > 0 ? remaining[0] : null);
      }
    } catch (err) {
      console.error('Delete saved answer error:', err);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportSinglePDF = async (item: SavedAnswer) => {
    try {
      setExportingId(item.id);
      await exportAnswerToPDF(
        item.question,
        item.answer,
        item.subject,
        `${item.question.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}_Model_Answer.pdf`
      );
    } catch (err) {
      console.error('Export answer PDF error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setExportingId(null);
    }
  };

  const handleExportAllPDF = async () => {
    if (filtered.length === 0) return;
    try {
      setExportingAll(true);
      const combined = filtered
        .map(
          (item, idx) =>
            `# ${idx + 1}. ${item.question}\n**Subject:** ${item.subject} • **Saved Date:** ${new Date(item.createdAt).toLocaleDateString()}\n\n${item.answer}\n\n---\n`
        )
        .join('\n');

      await exportNoteToPDF({
        title: 'Saved Academic Answers Portfolio',
        subtitle: `Collection of ${filtered.length} curated model answers and solutions`,
        category: 'Exam Prep',
        metadata: [
          { label: 'Total Answers', value: String(filtered.length) },
          { label: 'Generated For', value: 'College Exams Revision' },
        ],
        content: combined,
        filename: 'Saved_Academic_Answers_Portfolio.pdf',
      });
    } catch (err) {
      console.error('Export all answers error:', err);
      alert('Failed to export answers portfolio. Please try again.');
    } finally {
      setExportingAll(false);
    }
  };

  const filtered = answers.filter(
    (a) =>
      a.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-cyan-600" />
            Saved Gemini Answers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Bookmarked explanations, model answers, and solutions saved from chat or study tools
          </p>
        </div>

        <div className="flex items-center gap-2">
          {filtered.length > 0 && (
            <button
              onClick={handleExportAllPDF}
              disabled={exportingAll}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              title="Export all saved answers as a single PDF handbook"
            >
              <FileDown className="w-4 h-4 text-slate-600" />
              <span>{exportingAll ? 'Exporting...' : 'Export Portfolio (PDF)'}</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('assistant')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask New Question</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search saved questions and answers by topic or text..."
          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-slate-500 px-1">
            Saved Items ({filtered.length})
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No saved answers found</p>
              <p className="text-[11px] text-slate-400">
                Click "Save Answer" inside Gemini Chat or Study Tools to bookmark answers here.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
              {filtered.map((item) => {
                const isSelected = selectedAnswer?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedAnswer(item)}
                    className={`p-4 rounded-xl border transition cursor-pointer text-left ${
                      isSelected
                        ? 'bg-cyan-50/70 border-cyan-300 text-cyan-950 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                        {item.subject}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold truncate mb-1">{item.question}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.answer.slice(0, 120)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Detail View (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs min-h-[500px] flex flex-col justify-between">
          {selectedAnswer ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                    {selectedAnswer.subject}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {selectedAnswer.question}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(selectedAnswer.answer, selectedAnswer.id)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                    title="Copy Answer"
                  >
                    {copiedId === selectedAnswer.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleExportSinglePDF(selectedAnswer)}
                    disabled={exportingId === selectedAnswer.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 border border-cyan-200 text-cyan-800 hover:bg-cyan-100 rounded-lg text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-2xs"
                    title="Export model answer as PDF sheet"
                  >
                    <FileDown className="w-4 h-4 text-cyan-700" />
                    <span>{exportingId === selectedAnswer.id ? 'Exporting...' : 'Export PDF'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(selectedAnswer.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Answer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Answer Content */}
              <div className="max-h-[600px] overflow-y-auto pr-2">
                <MarkdownView content={selectedAnswer.answer} />
              </div>
            </div>
          ) : (
            <div className="py-32 text-center space-y-3">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Answer Selected</h3>
              <p className="text-xs text-slate-400">Select an item from the left to view.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
