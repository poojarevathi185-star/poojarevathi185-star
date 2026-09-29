import React, { useState, useEffect } from 'react';
import { PageView, Note } from '../types/index.js';
import { api } from '../services/api.js';
import { MarkdownView } from '../components/common/MarkdownView.js';
import { exportNoteToPDF } from '../services/pdfExport.js';
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Edit3,
  Copy,
  Check,
  Download,
  Sparkles,
  X,
  BookOpen,
  Filter,
  FileDown,
} from 'lucide-react';

interface NotesPageProps {
  onNavigate: (page: PageView, extra?: any) => void;
}

const SUBJECTS = [
  'All Subjects',
  'Computer Science',
  'Commerce',
  'Mathematics',
  'English',
  'Economics',
  'Business Studies',
  'Programming',
  'General Knowledge',
];

export const NotesPage: React.FC<NotesPageProps> = ({ onNavigate }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubject, setEditSubject] = useState('Computer Science');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

  // AI Generation in Modal
  const [aiGenerating, setAiGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exportingPdf, setExportingPdf] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await api.getNotes();
      setNotes(data);
      if (data.length > 0 && !selectedNote) {
        setSelectedNote(data[0]);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingNoteId(null);
    setEditTitle('');
    setEditSubject('Computer Science');
    setEditContent('');
    setEditTags('Exam Prep, Core Concepts');
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (note: Note) => {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditSubject(note.subject);
    setEditContent(note.content);
    setEditTags(note.tags.join(', '));
    setIsEditorOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim()) return;

    const tagsArray = editTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingNoteId) {
        const updated = await api.updateNote(editingNoteId, {
          title: editTitle,
          subject: editSubject,
          content: editContent,
          tags: tagsArray,
        });
        setNotes((prev) => prev.map((n) => (n.id === editingNoteId ? updated : n)));
        if (selectedNote?.id === editingNoteId) setSelectedNote(updated);
      } else {
        const created = await api.createNote({
          title: editTitle,
          subject: editSubject,
          content: editContent,
          tags: tagsArray,
        });
        setNotes((prev) => [created, ...prev]);
        setSelectedNote(created);
      }
      setIsEditorOpen(false);
    } catch (err) {
      console.error('Save note error:', err);
    }
  };

  const handleDeleteNote = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this study note?')) return;

    try {
      await api.deleteNote(id);
      const remaining = notes.filter((n) => n.id !== id);
      setNotes(remaining);
      if (selectedNote?.id === id) {
        setSelectedNote(remaining.length > 0 ? remaining[0] : null);
      }
    } catch (err) {
      console.error('Delete note error:', err);
    }
  };

  const handleGenerateContentWithGemini = async () => {
    if (!editTitle.trim()) {
      alert('Please enter a note title/topic first to generate content with Gemini.');
      return;
    }
    setAiGenerating(true);
    try {
      const res = await api.generateNotes({ topic: editTitle, subject: editSubject });
      setEditContent(res.notes);
    } catch (err) {
      console.error('AI notes generation failed:', err);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadNote = (note: Note) => {
    const blob = new Blob([note.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportNotePDF = async (note: Note) => {
    try {
      setExportingPdf(true);
      await exportNoteToPDF({
        title: note.title,
        subtitle: `College Revision Note • ${note.subject}`,
        category: note.subject,
        metadata: [
          { label: 'Subject', value: note.subject },
          { label: 'Tags', value: note.tags?.length ? note.tags.join(', ') : 'None' },
          { label: 'Updated', value: new Date(note.updatedAt).toLocaleDateString() },
        ],
        content: note.content,
        filename: `${note.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}_Notes.pdf`,
      });
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setExportingPdf(false);
    }
  };

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = subjectFilter === 'All Subjects' || note.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600" />
            My Study Notes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create, edit, organize, and generate revision notes for your college exams
          </p>
        </div>

        <div className="flex items-center gap-2">
          {filteredNotes.length > 0 && (
            <button
              onClick={async () => {
                if (!window.confirm(`Export compilation of ${filteredNotes.length} notes to PDF?`)) return;
                try {
                  setExportingPdf(true);
                  const combinedContent = filteredNotes
                    .map(
                      (n, idx) =>
                        `# ${idx + 1}. ${n.title}\n**Subject:** ${n.subject} • **Tags:** ${n.tags?.join(', ') || 'N/A'}\n\n${n.content}\n\n---\n`
                    )
                    .join('\n');
                  await exportNoteToPDF({
                    title: `Revision Notes Compilation (${subjectFilter})`,
                    subtitle: `Collection of ${filteredNotes.length} college revision notes`,
                    category: subjectFilter === 'All Subjects' ? 'Compilation' : subjectFilter,
                    metadata: [
                      { label: 'Subject Filter', value: subjectFilter },
                      { label: 'Total Notes', value: String(filteredNotes.length) },
                    ],
                    content: combinedContent,
                    filename: `College_Notes_Compilation_${subjectFilter.replace(/\s+/g, '_')}.pdf`,
                  });
                } catch (err) {
                  console.error('Batch export failed:', err);
                  alert('Batch export failed. Please try again.');
                } finally {
                  setExportingPdf(false);
                }
              }}
              disabled={exportingPdf}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
              title="Export all visible notes as a single compilation PDF book"
            >
              <FileDown className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Export Book (PDF)</span>
            </button>
          )}

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Note</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by keyword, topic, or tag..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-transparent font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes Layout: List on Left (4 cols), Detail View on Right (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Notes List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold">
            <span>Notes ({filteredNotes.length})</span>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No notes found</p>
              <p className="text-[11px] text-slate-400">
                Click "Create Note" or search with a different keyword.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
              {filteredNotes.map((note) => {
                const isSelected = selectedNote?.id === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className={`p-4 rounded-xl border transition cursor-pointer text-left ${
                      isSelected
                        ? 'bg-teal-50/70 border-teal-300 text-teal-950 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border border-slate-200/80 text-teal-700">
                        {note.subject}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold truncate mb-1">{note.title}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {note.content.slice(0, 140)}
                    </p>

                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {note.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] bg-slate-100/90 text-slate-600 px-1.5 py-0.5 rounded"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Note Detail Viewer */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs min-h-[500px] flex flex-col justify-between">
          {selectedNote ? (
            <div className="space-y-4">
              {/* Note Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-700">
                      {selectedNote.subject}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Last edited {new Date(selectedNote.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {selectedNote.title}
                  </h2>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(selectedNote.content, selectedNote.id)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                    title="Copy note"
                  >
                    {copiedId === selectedNote.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleExportNotePDF(selectedNote)}
                    disabled={exportingPdf}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 rounded-lg text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-2xs"
                    title="Export note as formatted PDF"
                  >
                    <FileDown className="w-4 h-4 text-teal-600" />
                    <span>{exportingPdf ? 'Exporting...' : 'Export PDF'}</span>
                  </button>
                  <button
                    onClick={() => handleDownloadNote(selectedNote)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                    title="Export Markdown (.md)"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(selectedNote)}
                    className="p-2 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                    title="Edit note"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(selectedNote.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Note Content (Markdown) */}
              <div className="max-h-[600px] overflow-y-auto pr-2">
                <MarkdownView content={selectedNote.content} />
              </div>
            </div>
          ) : (
            <div className="py-32 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Note Selected</h3>
              <p className="text-xs text-slate-400">
                Choose a note from the left list or create a new one.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingNoteId ? 'Edit Study Note' : 'Create New Study Note'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note Title / Topic
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus in Cloud Networks"
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    {SUBJECTS.filter((s) => s !== 'All Subjects').map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="OS, Chapter 4, 10-Marks"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* AI Auto-generate helper button */}
              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between gap-3">
                <div className="text-xs text-teal-900">
                  <span className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Need comprehensive notes fast?
                  </span>
                  <p className="text-[11px] text-teal-700">
                    Gemini 3.8 will draft structured notes with definitions and formulas based on your title.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateContentWithGemini}
                  disabled={aiGenerating || !editTitle.trim()}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shrink-0 transition disabled:opacity-50"
                >
                  {aiGenerating ? 'Generating...' : 'Auto-Generate Notes'}
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note Content (Markdown supported)
                </label>
                <textarea
                  required
                  rows={10}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Write your study notes, formulas, algorithms, or points..."
                  className="w-full p-3 text-xs sm:text-sm font-mono rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500 leading-relaxed"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-sm transition"
                >
                  {editingNoteId ? 'Update Note' : 'Save Note to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
