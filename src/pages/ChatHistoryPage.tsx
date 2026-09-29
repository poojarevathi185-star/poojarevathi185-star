import React, { useState, useEffect } from 'react';
import { PageView, Chat, ChatMessage } from '../types/index.js';
import { api } from '../services/api.js';
import { exportChatToPDF } from '../services/pdfExport.js';
import {
  History,
  Sparkles,
  MessageSquare,
  Trash2,
  ArrowRight,
  BookOpen,
  Calendar,
  FileDown,
} from 'lucide-react';

interface ChatHistoryPageProps {
  onNavigate: (page: PageView, extra?: any) => void;
}

export const ChatHistoryPage: React.FC<ChatHistoryPageProps> = ({ onNavigate }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportingId, setExportingId] = useState<string | null>(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      const data = await api.getChats();
      setChats(data);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportChat = async (chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setExportingId(chat.id);
      // Fetch full chat if messages is incomplete
      const fullChat = await api.getChat(chat.id);
      await exportChatToPDF({
        chatTitle: fullChat.title || 'Gemini Academic Session',
        subject: fullChat.subject || 'General',
        responseStyle: fullChat.responseStyle || 'Standard',
        messages: fullChat.messages.map((m: ChatMessage) => ({
          role: m.role,
          content: m.content,
          subject: m.subject || fullChat.subject,
          responseStyle: m.responseStyle || fullChat.responseStyle,
          timestamp: m.timestamp,
        })),
        filename: `${(fullChat.title || 'Chat').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}_Transcript.pdf`,
      });
    } catch (err) {
      console.error('Failed to export chat to PDF:', err);
      alert('Failed to export conversation as PDF.');
    } finally {
      setExportingId(null);
    }
  };

  const handleDeleteChat = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this conversation history?')) return;
    try {
      await api.deleteChat(id);
      setChats((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Delete chat error:', err);
    }
  };

  const handleOpenConversation = (chat: Chat) => {
    onNavigate('assistant', {
      prefillSubject: chat.subject,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-slate-700" />
            Previous AI Conversations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View, resume, or manage your past Gemini learning sessions
          </p>
        </div>

        <button
          onClick={() => onNavigate('assistant')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Chat Session</span>
        </button>
      </div>

      {/* Chat List */}
      {chats.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Chat History Found</h3>
          <p className="text-xs text-slate-400">
            You have not started any conversations yet. Launch the AI Assistant to ask your first question.
          </p>
          <button
            onClick={() => onNavigate('assistant')}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
          >
            Start Learning
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleOpenConversation(chat)}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-300 transition cursor-pointer flex flex-col justify-between group text-left"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                    {chat.subject || 'General'}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(chat.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition truncate">
                    {chat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {chat.lastMessage || 'Click to continue this conversation with Gemini...'}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {chat.messages.length} message{chat.messages.length !== 1 ? 's' : ''}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleExportChat(chat, e)}
                    disabled={exportingId === chat.id}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    title="Export conversation as formatted PDF"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="text-indigo-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Resume <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
