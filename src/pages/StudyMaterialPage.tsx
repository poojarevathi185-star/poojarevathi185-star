import React, { useState, useEffect } from 'react';
import { PageView, UploadedMaterial } from '../types/index.js';
import { api } from '../services/api.js';
import { MarkdownView } from '../components/common/MarkdownView.js';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Save,
  Trash2,
  Copy,
  Check,
  Eye,
  BookOpen,
} from 'lucide-react';

interface StudyMaterialPageProps {
  onNavigate: (page: PageView, extra?: any) => void;
}

const SAMPLE_NOTES = `Lecture Notes: Operating Systems - Virtual Memory and Paging

1. Overview:
Virtual memory is a storage allocation scheme in which secondary memory can be addressed as though it were part of main memory. The addresses a program may use to reference memory are distinguished from the addresses the memory system uses to identify physical storage sites.

2. Paging Mechanism:
- Physical memory is broken into fixed-sized blocks called Frames (typically 4KB).
- Logical memory is broken into blocks of the same size called Pages.
- When a process is to be executed, its pages are loaded into any available memory frames from the backing store.
- The Page Table translates logical addresses to physical addresses using:
  Logical Address = Page Number (p) + Offset (d)

3. Page Faults & Handling:
A page fault trap occurs when the hardware attempts to access a page marked invalid (not currently residing in physical RAM).
Steps in handling:
1. Trap to the OS kernel.
2. Save user registers and process state.
3. Check internal table to verify whether the reference is valid or an illegal address.
4. If valid but not in RAM, locate a free physical frame.
5. Schedule a disk operation to read the desired page into the allocated frame.
6. When read completes, update the internal tables and page table (set valid bit).
7. Restart the instruction that was interrupted.

4. Page Replacement Algorithms:
- FIFO (First In First Out): Suffers from Belady's Anomaly where increasing frames increases page faults.
- Optimal (OPT): Replaces page that will not be used for longest time (impossible in practice, used as theoretical benchmark).
- LRU (Least Recently Used): Replaces the page that has not been used for the longest period of time. Approximated using reference bits.

5. Thrashing:
A state where the CPU spends more time swapping pages in and out than executing instructions. Caused by high multiprogramming without sufficient memory frames for working sets. Resolved by reducing multiprogramming or adding physical RAM.`;

export const StudyMaterialPage: React.FC<StudyMaterialPageProps> = ({ onNavigate }) => {
  const [materials, setMaterials] = useState<UploadedMaterial[]>([]);
  const [activeMaterial, setActiveMaterial] = useState<UploadedMaterial | null>(null);
  const [activeAnalysisText, setActiveAnalysisText] = useState<string | null>(null);

  const [fileName, setFileName] = useState('');
  const [fileText, setFileText] = useState('');
  const [base64Image, setBase64Image] = useState<{ mimeType: string; data: string } | null>(null);
  const [subject, setSubject] = useState('Computer Science');
  const [fileSize, setFileSize] = useState(0);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedToNotesSuccess, setSavedToNotesSuccess] = useState(false);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      const data = await api.getMaterials();
      setMaterials(data);
      if (data.length > 0 && !activeMaterial) {
        setActiveMaterial(data[0]);
        setActiveAnalysisText(data[0].summary);
      }
    } catch (err) {
      console.error('Failed to load materials:', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setFileName(file.name);
    setFileSize(file.size);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        setBase64Image({
          mimeType: file.type,
          data: base64Data,
        });
        setFileText('');
      };
      reader.readAsDataURL(file);
    } else {
      // Text / Markdown / Code file
      const reader = new FileReader();
      reader.onload = () => {
        setFileText(reader.result as string);
        setBase64Image(null);
      };
      reader.readAsText(file);
    }
  };

  const handleLoadSample = () => {
    setFileName('Lecture_Notes_OS_VirtualMemory.txt');
    setFileText(SAMPLE_NOTES);
    setBase64Image(null);
    setFileSize(2048);
    setSubject('Computer Science');
    setError(null);
  };

  const handleSubmitAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileText && !base64Image) {
      setError('Please choose a file or load sample notes first.');
      return;
    }

    setError(null);
    setLoading(true);
    setUploadProgress(20);

    const progressTimer = setInterval(() => {
      setUploadProgress((prev) => (prev < 90 ? prev + 15 : prev));
    }, 400);

    try {
      const res = await api.analyzeMaterial({
        fileName: fileName || 'Uploaded_Study_Document.txt',
        fileText,
        base64Image,
        subject,
        fileSize,
      });

      clearInterval(progressTimer);
      setUploadProgress(100);
      setActiveAnalysisText(res.analysis);
      setActiveMaterial(res.record);
      setMaterials((prev) => [res.record, ...prev]);
    } catch (err: any) {
      clearInterval(progressTimer);
      setError(err.message || 'File analysis failed. Please verify file format.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMaterial = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this analyzed material?')) return;
    try {
      await api.deleteMaterial(id);
      const remaining = materials.filter((m) => m.id !== id);
      setMaterials(remaining);
      if (activeMaterial?.id === id) {
        setActiveMaterial(remaining.length > 0 ? remaining[0] : null);
        setActiveAnalysisText(remaining.length > 0 ? remaining[0].summary : null);
      }
    } catch (err) {
      console.error('Delete material error:', err);
    }
  };

  const handleSaveAsNote = async () => {
    if (!activeAnalysisText || !activeMaterial) return;
    try {
      await api.createNote({
        title: `Notes: ${activeMaterial.fileName}`,
        subject: activeMaterial.subject || subject,
        content: activeAnalysisText,
        tags: [activeMaterial.subject || subject, 'Study Material Analysis'],
      });
      setSavedToNotesSuccess(true);
      setTimeout(() => setSavedToNotesSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save to notes:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-emerald-600" />
            Study Material & File Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Upload textbooks, lecture notes, assignment sheets, or diagrams for 6-in-1 AI deep analysis
          </p>
        </div>

        <button
          onClick={handleLoadSample}
          className="px-3.5 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>Load Sample OS Notes</span>
        </button>
      </div>

      {/* Main Grid: Upload Form on Left, Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Upload Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900">Upload Academic Material</h3>

            {/* Error Notification */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmitAnalysis} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Area</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Economics">Economics</option>
                  <option value="Business Studies">Business Studies</option>
                  <option value="Programming">Programming</option>
                  <option value="General Knowledge">General Knowledge</option>
                </select>
              </div>

              {/* Drag & Drop Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  File Document / Image
                </label>
                <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-50/50 hover:bg-emerald-50/20">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {fileName ? fileName : 'Click to select file or drag here'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    Supports .txt, .md, .py, .java, .cpp, .json, and image diagrams (.png, .jpg)
                  </span>
                  <input
                    type="file"
                    accept=".txt,.md,.py,.java,.cpp,.json,.csv,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Text content preview if text exists */}
              {fileText && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Content Preview ({fileText.length} characters)
                  </label>
                  <textarea
                    rows={4}
                    value={fileText}
                    onChange={(e) => setFileText(e.target.value)}
                    className="w-full p-2 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              )}

              {/* Progress bar */}
              {loading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                    <span>Analyzing with Gemini 3.8 Flash...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (!fileText && !base64Image)}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-md shadow-emerald-600/20"
              >
                {loading ? 'Analyzing Content...' : 'Run 6-in-1 Academic Analysis'}
              </button>
            </form>
          </div>

          {/* Past Uploads History List */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Previously Analyzed Materials ({materials.length})
            </h4>

            {materials.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No documents analyzed yet.</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {materials.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setActiveMaterial(m);
                      setActiveAnalysisText(m.summary);
                    }}
                    className={`p-2.5 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                      activeMaterial?.id === m.id
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-xs truncate">{m.fileName}</p>
                        <span className="text-[10px] text-slate-400 block">
                          {m.subject} • {new Date(m.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteMaterial(m.id, e)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Output Results Panel (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs min-h-[550px] flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  {activeMaterial ? activeMaterial.fileName : 'Analysis Results'}
                </span>
              </div>

              {activeAnalysisText && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activeAnalysisText);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSaveAsNote}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-semibold transition"
                  >
                    {savedToNotesSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Saved to Notes!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save to Notes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Results Content */}
            <div className="overflow-y-auto max-h-[650px] pr-2">
              {loading && (
                <div className="py-24 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-800">
                    Gemini 3.8 is analyzing your study material...
                  </p>
                  <p className="text-xs text-slate-400">
                    Extracting summary, definitions, exam questions, MCQs, and plain explanations
                  </p>
                </div>
              )}

              {!loading && activeAnalysisText && (
                <MarkdownView content={activeAnalysisText} />
              )}

              {!loading && !activeAnalysisText && (
                <div className="py-28 text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">No Material Selected</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Upload a file on the left or click "Load Sample OS Notes" to see how Gemini transforms raw material into exam study sheets.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
