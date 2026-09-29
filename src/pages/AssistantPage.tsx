import React, { useState, useEffect, useRef } from 'react';
import { PageView, Chat, ChatMessage } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { MarkdownView } from '../components/common/MarkdownView.js';
import { exportChatToPDF, exportAnswerToPDF } from '../services/pdfExport.js';
import { GitHubConnectModal } from '../components/common/GitHubConnectModal.js';
import {
  Sparkles,
  Send,
  Plus,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  Bookmark,
  FileText,
  AlertCircle,
  BookOpen,
  Sliders,
  ChevronDown,
  FileDown,
  Maximize2,
  Minimize2,
  Github,
  Zap,
} from 'lucide-react';

interface AssistantPageProps {
  onNavigate: (page: PageView, extra?: any) => void;
  prefillPrompt?: string;
  prefillSubject?: string;
}

const SUBJECTS = [
  'Computer Science',
  'Commerce',
  'Mathematics',
  'English',
  'Economics',
  'Business Studies',
  'Programming',
  'General Knowledge',
];

const RESPONSE_STYLES = [
  { id: 'Simple', label: 'Simple & Clear', desc: 'Direct, student-friendly, jargon-free' },
  { id: 'Detailed', label: 'Detailed & In-Depth', desc: 'College textbook level with complete mechanisms' },
  { id: 'Exam Answer', label: 'Exam Answer (Marking Scheme)', desc: 'Definition, points, diagrams, and advantages' },
  { id: 'Step-by-Step', label: 'Step-by-Step Breakdown', desc: 'Sequential walkthrough with examples' },
  { id: 'Beginner Friendly', label: 'Beginner Friendly (Analogy)', desc: 'Intuitive analogies for tough concepts' },
];

export const AssistantPage: React.FC<AssistantPageProps> = ({
  onNavigate,
  prefillPrompt,
  prefillSubject,
}) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [inputMessage, setInputMessage] = useState(prefillPrompt || '');
  const [selectedSubject, setSelectedSubject] = useState(prefillSubject || 'Computer Science');
  const [selectedStyle, setSelectedStyle] = useState('Simple');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [exportingChatPdf, setExportingChatPdf] = useState(false);
  const [exportingAnswerId, setExportingAnswerId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (prefillPrompt) {
      setInputMessage(prefillPrompt);
    }
    if (prefillSubject) {
      setSelectedSubject(prefillSubject);
    }
  }, [prefillPrompt, prefillSubject]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages, loading]);

  const loadChats = async () => {
    try {
      const data = await api.getChats();
      setChats(data);
      if (data.length > 0) {
        setCurrentChat(data[0]);
        setSelectedSubject(data[0].subject || 'Computer Science');
        setSelectedStyle(data[0].responseStyle || 'Simple');
      } else {
        await handleNewChat();
      }
    } catch (err: any) {
      console.error('Error fetching chats:', err);
    }
  };

  const handleNewChat = async () => {
    try {
      const newChat = await api.createChat({
        title: 'New Study Session',
        subject: selectedSubject,
        responseStyle: selectedStyle,
      });
      setChats((prev) => [newChat, ...prev]);
      setCurrentChat(newChat);
    } catch (err: any) {
      console.error('Failed to create new chat:', err);
    }
  };

  const handleSelectChat = async (chatId: string) => {
    try {
      const chat = await api.getChat(chatId);
      setCurrentChat(chat);
      setSelectedSubject(chat.subject || 'Computer Science');
      setSelectedStyle(chat.responseStyle || 'Simple');
    } catch (err: any) {
      console.error('Failed to load chat:', err);
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this study conversation?')) return;

    try {
      await api.deleteChat(chatId);
      const remaining = chats.filter((c) => c.id !== chatId);
      setChats(remaining);
      if (currentChat?.id === chatId) {
        setCurrentChat(remaining.length > 0 ? remaining[0] : null);
        if (remaining.length === 0) handleNewChat();
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  const handleClearChat = async () => {
    if (!currentChat) return;
    if (!window.confirm('Clear all messages in this conversation?')) return;

    try {
      await api.clearChat(currentChat.id);
      setCurrentChat({
        ...currentChat,
        messages: [],
        lastMessage: '',
      });
    } catch (err) {
      console.error('Failed to clear chat:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const userText = inputMessage.trim();
    if (!userText || loading) return;

    setInputMessage('');
    setError(null);
    setLoading(true);

    let activeChat = currentChat;
    if (!activeChat) {
      try {
        activeChat = await api.createChat({
          title: userText.slice(0, 35),
          subject: selectedSubject,
          responseStyle: selectedStyle,
        });
        setChats((prev) => [activeChat!, ...prev]);
        setCurrentChat(activeChat);
      } catch (e) {
        activeChat = {
          id: 'chat_' + Date.now(),
          userId: user?.id || 'usr_student_demo',
          title: userText.slice(0, 35),
          subject: selectedSubject,
          responseStyle: selectedStyle,
          lastMessage: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [],
        };
        setCurrentChat(activeChat);
      }
    }

    // Optimistic user message
    const tempUserMsg: ChatMessage = {
      id: 'temp_' + Date.now(),
      role: 'user',
      content: userText,
      subject: selectedSubject,
      responseStyle: selectedStyle,
      timestamp: new Date().toISOString(),
    };

    setCurrentChat((prev) =>
      prev ? { ...prev, messages: [...prev.messages, tempUserMsg] } : null
    );

    const sendChatId = activeChat?.id || currentChat?.id || 'new';

    try {
      const result = await api.sendMessage(sendChatId, {
        message: userText,
        subject: selectedSubject,
        responseStyle: selectedStyle,
      });

      const confirmedChatId = result.chatId || sendChatId;

      // Update state with confirmed assistant message
      setCurrentChat((prev) => {
        if (!prev) return null;
        const filtered = prev.messages.filter((m) => m.id !== tempUserMsg.id);
        return {
          ...prev,
          id: confirmedChatId,
          title: prev.messages.length === 0 ? userText.slice(0, 35) : prev.title,
          lastMessage: result.assistantMessage.content.slice(0, 100),
          messages: [...filtered, result.userMessage, result.assistantMessage],
        };
      });

      // Refresh chat list title
      setChats((prev) =>
        prev.map((c) =>
          c.id === sendChatId || c.id === confirmedChatId
            ? {
                ...c,
                id: confirmedChatId,
                title: c.messages.length === 0 ? userText.slice(0, 35) : c.title,
                lastMessage: result.assistantMessage.content.slice(0, 100),
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
    } catch (err: any) {
      setError(err.message || 'Gemini API call failed. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveAnswer = async (question: string, answer: string, id: string) => {
    try {
      await api.createSavedAnswer({
        question,
        answer,
        subject: selectedSubject,
        source: 'chat',
      });
      setSavedId(id);
      setTimeout(() => setSavedId(null), 2500);
    } catch (err) {
      console.error('Failed to save answer:', err);
    }
  };

  const handleExportChatPDF = async () => {
    if (!currentChat || currentChat.messages.length === 0) return;
    try {
      setExportingChatPdf(true);
      await exportChatToPDF({
        chatTitle: currentChat.title || 'Gemini Academic Study Session',
        subject: selectedSubject,
        responseStyle: selectedStyle,
        messages: currentChat.messages.map((m) => ({
          role: m.role,
          content: m.content,
          subject: m.subject || selectedSubject,
          responseStyle: m.responseStyle || selectedStyle,
          timestamp: m.timestamp,
        })),
        filename: `${(currentChat.title || 'Chat_Session').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}_Chat.pdf`,
      });
    } catch (err) {
      console.error('Failed to export chat transcript as PDF:', err);
      alert('Failed to export chat transcript as PDF. Please try again.');
    } finally {
      setExportingChatPdf(false);
    }
  };

  const handleExportSingleResponsePDF = async (question: string, answer: string, id: string) => {
    try {
      setExportingAnswerId(id);
      await exportAnswerToPDF(
        question || 'Academic Explanation',
        answer,
        selectedSubject,
        `${(question || 'Exam_Answer').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}_Answer.pdf`
      );
    } catch (err) {
      console.error('Failed to export single answer as PDF:', err);
      alert('Failed to export answer as PDF. Please try again.');
    } finally {
      setExportingAnswerId(null);
    }
  };

  const handleCreateNoteFromAnswer = async (question: string, answer: string) => {
    try {
      await api.createNote({
        title: question.slice(0, 50),
        subject: selectedSubject,
        content: answer,
        tags: [selectedSubject, 'From Gemini Chat'],
      });
      alert('Answer saved as a private Study Note! You can view it on the Notes page.');
    } catch (err) {
      console.error('Failed to create note:', err);
    }
  };

  return (
    <div
      className={`flex flex-col bg-white overflow-hidden shadow-xs transition-all ${
        isFullScreen
          ? 'fixed inset-0 z-50 rounded-none w-screen h-screen'
          : 'h-[calc(100vh-6rem)] rounded-2xl border border-slate-200'
      }`}
    >
      {/* Top Configuration & Control Bar */}
      <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                Gemini Academic Tutor
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                <span>Direct Answers (No PDF Required)</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Direct on-screen factual explanations for university college examinations
            </p>
          </div>
        </div>

        {/* Controls: Subject & Response Style Selectors & FullScreen */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-semibold text-slate-500 hidden sm:inline">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Style Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs shadow-2xs">
            <Sliders className="w-3.5 h-3.5 text-purple-600" />
            <span className="font-semibold text-slate-500 hidden sm:inline">Style:</span>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {RESPONSE_STYLES.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          {/* Full Screen Toggle */}
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer shadow-2xs ${
              isFullScreen
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title={isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen Focus Mode'}
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullScreen ? 'Exit Full Screen' : 'Full Screen'}</span>
          </button>

          {/* GitHub Connect Button */}
          <button
            onClick={() => setIsGitHubModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
            title="Connect your GitHub repository"
          >
            <Github className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">GitHub</span>
          </button>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {/* Clear Chat Button */}
          {currentChat && currentChat.messages.length > 0 && (
            <button
              onClick={handleClearChat}
              title="Clear messages"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Empty State */}
        {(!currentChat || currentChat.messages.length === 0) && (
          <div className="max-w-2xl mx-auto my-auto text-center space-y-6 py-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                Ask Gemini Any Academic Question
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Get definitions, detailed mechanisms, formulas, diagrams, advantages, and disadvantages formatted for university exams.
              </p>
            </div>

            {/* Quick Prompt Starters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {[
                {
                  label: 'Explain Cloud Computing Architecture',
                  sub: 'Definition, Service Layers & Advantages',
                  subj: 'Computer Science',
                },
                {
                  label: 'Derive Bayes Theorem with Example',
                  sub: 'Step-by-step mathematical proof & clinical testing',
                  subj: 'Mathematics',
                },
                {
                  label: 'Differentiate Micro vs Macroeconomics',
                  sub: '5-mark tabular comparison for university exam',
                  subj: 'Economics',
                },
                {
                  label: 'Explain QuickSort with Partition Algorithm',
                  sub: 'Trace with array [10, 80, 30, 90, 40, 50, 70]',
                  subj: 'Programming',
                },
              ].map((starter, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedSubject(starter.subj);
                    setInputMessage(starter.label);
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 transition text-left group shadow-2xs"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                    {starter.subj}
                  </span>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">
                    {starter.label}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{starter.sub}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Stream */}
        {currentChat?.messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          const userQuestion = isUser
            ? msg.content
            : currentChat.messages[index - 1]?.content || 'Gemini Explanation';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-xs mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-xs ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-slate-50/80 border border-slate-200/90 text-slate-900 rounded-tl-xs'
                }`}
              >
                {/* Assistant message header */}
                {!isUser && (
                  <div className="flex items-center justify-between border-b border-slate-200/70 pb-2 mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-700">Gemini Assistant</span>
                      {msg.subject && (
                        <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                          {msg.subject}
                        </span>
                      )}
                      {msg.responseStyle && (
                        <span className="text-[10px] text-slate-400">
                          Style: {msg.responseStyle}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Message Body */}
                {isUser ? (
                  <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                ) : (
                  <MarkdownView content={msg.content} />
                )}

                {/* Assistant Action Toolbar */}
                {!isUser && (
                  <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-200/60 text-xs text-slate-500">
                    {/* Copy answer */}
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition"
                    >
                      {copiedId === msg.id ? (
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

                    {/* Save to SavedAnswers */}
                    <button
                      onClick={() => handleSaveAnswer(userQuestion, msg.content, msg.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 transition"
                    >
                      {savedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Saved to Portfolio</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Save Answer</span>
                        </>
                      )}
                    </button>

                    {/* Save as Study Note */}
                    <button
                      onClick={() => handleCreateNoteFromAnswer(userQuestion, msg.content)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 hover:text-teal-600 transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Save as Study Note</span>
                    </button>

                    {/* Export Response to PDF */}
                    <button
                      onClick={() => handleExportSingleResponsePDF(userQuestion, msg.content, msg.id)}
                      disabled={exportingAnswerId === msg.id}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition font-semibold"
                      title="Export this response as a PDF study sheet"
                    >
                      <FileDown className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{exportingAnswerId === msg.id ? 'Exporting...' : 'Export PDF'}</span>
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0 mt-1 text-xs">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex items-start gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-xs animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl rounded-tl-xs flex items-center gap-2.5 text-xs text-slate-600">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span>Gemini is generating educational explanation...</span>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Generation Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Message Input Box */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
        <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            placeholder={`Ask Gemini about ${selectedSubject} (e.g., "Explain cloud computing with definition, points, examples")...`}
            className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-slate-50/50 pr-24"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="absolute right-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
          <span>Gemini 3.8 Flash • Adapts answers to {selectedStyle} format</span>
          <span className="hidden sm:inline">Press Enter to send</span>
        </div>
      </div>

      {/* GitHub Connect Modal */}
      <GitHubConnectModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        userEmail={user?.email || 'sanjayrevathi2006@gmail.com'}
      />
    </div>
  );
};
