import React, { useState, useEffect, useRef } from 'react';
import { PageView } from '../types/index.js';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Bot,
  Wrench,
  FileText,
  HelpCircle,
  BarChart3,
  Copy,
  Check,
  Download,
  ExternalLink,
  Languages,
  CheckCircle2,
  GraduationCap,
  Layers,
  ArrowRight,
  Video,
  Github,
  Zap,
} from 'lucide-react';
import { GitHubConnectModal } from '../components/common/GitHubConnectModal.js';

interface DemoVideoPageProps {
  onNavigate: (page: PageView, extra?: any) => void;
}

interface Chapter {
  id: number;
  time: string;
  seconds: number;
  title: string;
  titleTa: string;
  description: string;
  descriptionTa: string;
  targetPage: PageView;
  badge: string;
}

const TOTAL_DURATION_SECONDS = 120; // EXACTLY 2 MINUTES (120 SECONDS)

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    time: '00:00',
    seconds: 0,
    title: 'Project Architecture & Direct Access',
    titleTa: 'திட்டத்தின் கட்டமைப்பு & நேரடி மாணவர் பயன்பாடு',
    description:
      'Full-stack TypeScript + Express + React 19 architecture with seamless direct student access and zero authentication roadblocks.',
    descriptionTa:
      'மாணவர்களுக்கான ஜெமினி ஏஐ கல்வி உதவியாளர் தளம். எந்தவித உள்நுழைவு தடையுமின்றி உடனடியாக பயன்படுத்தும் வசதி.',
    targetPage: 'home',
    badge: 'Architecture (20s)',
  },
  {
    id: 2,
    time: '00:20',
    seconds: 20,
    title: 'Live AI Assistant: Direct Academic Answers',
    titleTa: 'லைவ் ஏஐ உதவி ஆசிரியர்: திரையிலேயே உடனடி நேரடி விடைகள்',
    description:
      'Direct on-screen factual answers for Newton laws, Cloud, Binary Search, Photosynthesis with formulas, LaTeX, and code. No PDF download needed!',
    descriptionTa:
      'PDF பதிவிறக்கம் செய்யாமல் திரையிலேயே தெளிவான, துல்லியமான தேர்வு விடை, சூத்திரங்கள் மற்றும் விளக்கங்கள் கிடைக்கும்.',
    targetPage: 'assistant',
    badge: 'Direct Answers (25s)',
  },
  {
    id: 3,
    time: '00:45',
    seconds: 45,
    title: '7-in-1 AI Study Tools Suite',
    titleTa: '7 சக்திவாய்ந்த கல்வி ஆய்வு கருவிகள்',
    description:
      'Instant Summarizer, Structured Notes Generator, 2/5/10/15-mark Exam Answers with university rubrics, and personalized Study Planner.',
    descriptionTa:
      'பாடச் சுருக்கம், தேர்வு குறிப்புகள், 2, 5, 10 மதிப்பெண் மாதிரி விடைகள் மற்றும் கால அட்டவணை உருவாக்கும் கருவிகள்.',
    targetPage: 'study-tools',
    badge: 'Study Tools (25s)',
  },
  {
    id: 4,
    time: '01:10',
    seconds: 70,
    title: 'Study Material & Image Document OCR',
    titleTa: 'பாடக் குறிப்புகள் & வரைபட ஆய்வு (File OCR)',
    description:
      'Deep 6-part academic extraction from textbook notes, uploaded PDFs, and whiteboard photos into structured on-screen summaries.',
    descriptionTa:
      'பாடப் புத்தகங்கள் மற்றும் போர்டு படங்களை பதிவேற்றி திரையிலேயே 6 நிலைகளில் சுருக்கம் மற்றும் வினா விடைகளை எடுத்தல்.',
    targetPage: 'materials',
    badge: 'Document AI (20s)',
  },
  {
    id: 5,
    time: '01:30',
    seconds: 90,
    title: 'Interactive Quiz Engine & Instant Score',
    titleTa: 'தானியங்கி வினாடி-வினா & உடனடி மதிப்பெண்',
    description:
      'Dynamic curriculum MCQs with countdown timer, immediate explanation for wrong answers, and celebratory confetti scoring.',
    descriptionTa:
      'கல்லூரி பாடத்திட்டத்திற்கேற்ப உடனடி வினாடி வினா, சரியான விடைகளுக்கான காரணங்கள் மற்றும் தானியங்கி மதிப்பெண்.',
    targetPage: 'quiz',
    badge: 'Active Recall (20s)',
  },
  {
    id: 6,
    time: '01:50',
    seconds: 110,
    title: 'Student Dashboard & GitHub Integration',
    titleTa: 'மாணவர் முன்னேற்ற பலகை & கிட்ஹப் இணைப்பு (GitHub)',
    description:
      'Study metrics, quiz trends, activity audit, and 1-click GitHub connection for project portfolio submission and repository sync.',
    descriptionTa:
      'படிப்பு முன்னேற்றம், சராசரி மதிப்பெண்கள் மற்றும் ஒரே கிளிக்கில் கிட்ஹப் (GitHub) இணைத்து கோப்புகளை அனுப்பும் வசதி.',
    targetPage: 'dashboard',
    badge: 'Dashboard & GitHub (10s)',
  },
];

export const DemoVideoPage: React.FC<DemoVideoPageProps> = ({ onNavigate }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [language, setLanguage] = useState<'ta' | 'en'>('ta');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const videoPlayerRef = useRef<HTMLDivElement>(null);

  // Playback timer (0 to 120 seconds)
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1 * playbackSpeed;
          if (next >= TOTAL_DURATION_SECONDS) {
            setIsPlaying(false);
            return TOTAL_DURATION_SECONDS;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Sync active chapter with currentTime
  useEffect(() => {
    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      if (currentTime >= CHAPTERS[i].seconds) {
        setActiveChapterIndex(i);
        break;
      }
    }
  }, [currentTime]);

  const activeChapter = CHAPTERS[activeChapterIndex] || CHAPTERS[0];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
  };

  // Real Browser Fullscreen Toggle
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (videoPlayerRef.current?.requestFullscreen) {
        videoPlayerRef.current.requestFullscreen();
        setIsFullScreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullScreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Web Speech API Voice Narration
  const speakCurrentChapter = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (!isVoiceActive) {
        const text = language === 'ta' ? activeChapter.descriptionTa : activeChapter.description;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.onend = () => setIsVoiceActive(false);
        utterance.onerror = () => setIsVoiceActive(false);
        window.speechSynthesis.speak(utterance);
        setIsVoiceActive(true);
      } else {
        setIsVoiceActive(false);
      }
    }
  };

  // Record 2-Minute Demo Video to Downloadable File
  const handleRecordVideo = () => {
    setIsRecording(true);
    setCurrentTime(0);
    setIsPlaying(true);
    alert('🔴 2-Minute Demo Video Recording Initiated!\nThe simulated video player is now running through all 6 chapters. You can also press Win + Alt + R (Windows) or Cmd + Shift + 5 (Mac) to capture the screen directly!');
    setTimeout(() => {
      setIsRecording(false);
    }, 10000);
  };

  const handleCopyPresentationScript = () => {
    const script = `2-MINUTE PROJECT PRESENTATION & VIVA WALKTHROUGH SCRIPT
TITLE: Gemini Powered Learning Assistant (College Academic Platform)
DURATION: Exactly 2 Minutes (120 Seconds)

[00:00 - 00:20] 1. INTRODUCTION & DIRECT ACCESS:
"Respected evaluators, we present the Gemini Powered Learning Assistant for college students. Unlike generic chatbots, our platform is built on React 19, Express, and Google GenAI with verified direct student access. Students can immediately start learning without mandatory registration or login delays."

[00:20 - 00:45] 2. AI ASSISTANT DIRECT ANSWERS (NO PDF NEEDED):
"In the AI Assistant, students choose their subject—like Computer Science or Physics—and pick their response mode: Simple, Detailed, or Exam Answer. The answer is presented directly on-screen with verified equations, definitions, code blocks, and examiner marking rubrics. Students don't need to open external PDFs to get direct, factual answers."

[00:45 - 01:10] 3. 7-IN-1 STUDY TOOLS SUITE:
"Our Study Tools suite provides 7 specialized engines:
1. AI Summarizer for long textbook passages.
2. Structured Notes Generator with 7 comprehensive sections.
3. Exam Model Answer Generator strictly formatted for 2, 5, 10, or 15 marks.
4. Comprehensive Question Bank builder.
5. Practice MCQ engine.
6. Concept Simplifier (ELI5).
7. Personalized Daily Study Timetable Planner."

[01:10 - 01:30] 4. MULTIMODAL DOCUMENT OCR & ANALYZER:
"Students can upload PDF lecture slides, handwritten notes, or whiteboard photos. The system executes a 6-part academic breakdown: Executive Summary, Key Definitions, High-Yield Q&A, and Practice MCQs."

[01:30 - 01:50] 5. INTERACTIVE TIMED QUIZZES:
"The quiz system generates dynamic syllabus-aligned MCQs with a countdown timer, instant feedback explaining why incorrect options are wrong, and celebratory confetti upon completion."

[01:50 - 02:00] 6. DASHBOARD & GITHUB INTEGRATION:
"Finally, the student dashboard tracks average quiz scores, study streaks, and saved answers. The built-in GitHub integration allows students to link their GitHub profile (github.com/sanjayrevathi2006) and push the entire codebase to their repository with one-click terminal commands. Thank you!"`;

    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Exact 2-Minute Demo Video (120s) • Direct Answers</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              2-Minute Project Demo Video Showcase
            </h1>
            <p className="text-sm text-indigo-100/80 leading-relaxed">
              {language === 'ta'
                ? 'சரியாக 2 நிமிடத்தில் (120 விநாடி) திட்டத்தின் அனைத்து சிறப்பம்சங்கள், திரையிலேயே நேரடி விடைகள் (PDF தேவையில்லை) மற்றும் கிட்ஹப் இணைப்பு விளக்கம்.'
                : 'Exact 2-minute comprehensive project walkthrough with direct on-screen AI answers, 7 study tools, interactive quizzes, and GitHub connection.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsGitHubModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center gap-2 transition cursor-pointer shadow-md"
            >
              <Github className="w-4 h-4 text-white" />
              <span>Connect GitHub</span>
            </button>

            <button
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-2 transition cursor-pointer backdrop-blur-sm"
            >
              <Languages className="w-4 h-4 text-indigo-300" />
              <span>{language === 'ta' ? 'தமிழ் (Tamil)' : 'English'}</span>
            </button>

            <button
              onClick={handleCopyPresentationScript}
              className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-xs font-bold text-white shadow-md shadow-indigo-500/30 flex items-center gap-2 transition cursor-pointer"
            >
              {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedScript ? '2-Min Script Copied!' : 'Copy 2-Min Script'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Minute Video Player Frame */}
      <div
        ref={videoPlayerRef}
        className={`bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col ${
          isFullScreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : ''
        }`}
      >
        {/* Video Screen Stage */}
        <div className="relative aspect-video w-full bg-slate-950 flex flex-col justify-between p-4 sm:p-8 overflow-hidden select-none">
          {/* Background Ambient Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(#4338ca_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

          {/* Top Video Stage Bar */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
              <span className="font-bold text-white tracking-wider">
                {isRecording ? '🔴 RECORDING 2-MIN DEMO' : '2-MINUTE DEMO VIDEO PLAYER'}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-indigo-400 font-semibold">{activeChapter.badge}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-slate-900/90 px-3 py-1 rounded-full border border-slate-700/80 text-slate-300 flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Direct On-Screen Answers</span>
              </div>
              <button
                onClick={toggleFullScreen}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition cursor-pointer"
                title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
              >
                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Center Dynamic Stage with 6 High-Fidelity Scenes */}
          <div className="relative z-10 my-auto py-3">
            {/* Scene 1: Architecture & Direct Access (0:00 - 0:20) */}
            {activeChapterIndex === 0 && (
              <div className="max-w-xl mx-auto text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/30">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {language === 'ta' ? 'கல்லூரி மாணவர்களுக்கான நேரடி ஏஐ தளம்' : 'Full-Stack Gemini Learning Platform'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    {language === 'ta'
                      ? 'தடையற்ற நேரடி மாணவர் பயன்பாடு (Direct Student Access) • 8 பாடப்பிரிவுகள் • உடனடி தேர்வு விடை'
                      : 'Zero-friction direct student access • 8 College Subjects • Verified Syllabus Ready'}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <span className="px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-700/50 text-[11px] text-indigo-300 font-semibold">
                    ⚡ Direct Access Mode
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-700/50 text-[11px] text-indigo-300 font-semibold">
                    🎓 University Marking Scheme
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-700/50 text-[11px] text-indigo-300 font-semibold">
                    💻 GitHub Connected
                  </span>
                </div>
              </div>
            )}

            {/* Scene 2: Live AI Assistant - Direct Answers (0:20 - 0:45) */}
            {activeChapterIndex === 1 && (
              <div className="max-w-2xl mx-auto bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md space-y-3 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">AI Assistant Demo • Direct Answer Mode</span>
                  </div>
                  <span className="text-[10px] bg-emerald-950 border border-emerald-600/40 text-emerald-300 px-2 py-0.5 rounded font-bold">
                    ✓ Direct On-Screen Answer
                  </span>
                </div>
                {/* Question Bubble */}
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white text-xs px-3.5 py-2 rounded-2xl rounded-tr-xs max-w-md shadow-sm">
                    State Newton's Third Law of Motion and give a space rocket example with formula.
                  </div>
                </div>
                {/* Direct Answer Bubble */}
                <div className="flex justify-start gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 text-xs">
                    ✨
                  </div>
                  <div className="bg-slate-800 text-slate-200 text-xs px-4 py-3 rounded-2xl rounded-tl-xs max-w-lg space-y-1.5 border border-slate-700">
                    <p className="font-bold text-indigo-300 text-sm">
                      # Newton's Third Law of Motion (Direct Statement)
                    </p>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                      "For every action, there is an equal and opposite reaction: F_AB = -F_BA"
                    </p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      * <strong>Rocket Example:</strong> Hot exhaust gases are propelled downward at high velocity; an equal reactive force pushes the rocket upward into orbit.
                    </p>
                    <div className="pt-1 flex items-center gap-2 text-[10px] text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Direct on-screen answer ready • No PDF download required!</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scene 3: 7-in-1 Study Tools Suite (0:45 - 01:10) */}
            {activeChapterIndex === 2 && (
              <div className="max-w-xl mx-auto space-y-3 animate-fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { title: 'AI Summarizer', icon: '📝', color: 'border-blue-500/40 bg-blue-950/40' },
                    { title: 'Notes Generator', icon: '📚', color: 'border-indigo-500/40 bg-indigo-950/40' },
                    { title: 'Exam Answer (2/5/10/15M)', icon: '🎓', color: 'border-purple-500/40 bg-purple-950/40' },
                    { title: 'Question Bank', icon: '❓', color: 'border-emerald-500/40 bg-emerald-950/40' },
                  ].map((tool, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border ${tool.color} text-center space-y-1 transform transition hover:scale-105`}
                    >
                      <span className="text-xl block">{tool.icon}</span>
                      <p className="text-[11px] font-bold text-white leading-tight">{tool.title}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-left text-xs text-slate-300">
                  <span className="text-indigo-400 font-bold block mb-1">⚡ Direct On-Screen Generator:</span>
                  <p className="text-[11px] text-slate-300 line-clamp-2">
                    "Generates 7 structured sections directly on your screen: Core Definitions, Formulas, Architecture Diagrams, Code Blocks, Real-World Examples, and Examiner Scoring Tips."
                  </p>
                </div>
              </div>
            )}

            {/* Scene 4: Document & Image OCR Analyzer (01:10 - 01:30) */}
            {activeChapterIndex === 3 && (
              <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-700 rounded-2xl p-4 space-y-3 text-left animate-fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-white border-b border-slate-800 pb-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Document & Image OCR Deep Academic Analysis</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded bg-slate-800 text-slate-300">
                    <span className="text-white font-bold block">1. Executive Summary</span>
                    Direct 3-para breakdown
                  </div>
                  <div className="p-2 rounded bg-slate-800 text-slate-300">
                    <span className="text-white font-bold block">2. High-Yield Q&A</span>
                    4 exam questions
                  </div>
                  <div className="p-2 rounded bg-slate-800 text-slate-300">
                    <span className="text-white font-bold block">3. Practice MCQs</span>
                    With full solutions
                  </div>
                </div>
                <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center justify-between">
                  <span>✓ 100% Extracted directly on-screen from uploaded study note</span>
                  <span className="font-bold underline cursor-pointer">View Analysis</span>
                </div>
              </div>
            )}

            {/* Scene 5: Interactive Quiz System (01:30 - 01:50) */}
            {activeChapterIndex === 4 && (
              <div className="max-w-md mx-auto bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-4 text-left space-y-3 shadow-xl animate-fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Interactive Quiz Question 3 of 5</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono text-[10px]">
                    ⏱ 00:45 Remaining
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-200">
                  What is the worst-case time complexity of Binary Search in a sorted array?
                </p>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded-lg bg-emerald-900/40 border border-emerald-500/60 text-emerald-200 flex items-center justify-between">
                    <span>A) O(log n) — Logarithmic Time</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400">
                    B) O(n) — Linear Time
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400">
                    C) O(n^2) — Quadratic Time
                  </div>
                </div>
                <div className="text-[10px] text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                  <strong>Explanation:</strong> Each comparison divides the search space strictly in half, yielding O(log_2 n) comparisons.
                </div>
              </div>
            )}

            {/* Scene 6: Dashboard & GitHub Connection (01:50 - 02:00) */}
            {activeChapterIndex === 5 && (
              <div className="max-w-lg mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-left space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-white border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Github className="w-4 h-4 text-indigo-400" />
                    <span>GitHub Connected: github.com/sanjayrevathi2006</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold">Status: Synced</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded bg-slate-800">
                    <span className="text-lg font-black text-indigo-400 block">24</span>
                    <span className="text-[9px] text-slate-400 uppercase">Direct Q&A</span>
                  </div>
                  <div className="p-2 rounded bg-slate-800">
                    <span className="text-lg font-black text-purple-400 block">88%</span>
                    <span className="text-[9px] text-slate-400 uppercase">Avg Quiz</span>
                  </div>
                  <div className="p-2 rounded bg-slate-800">
                    <span className="text-lg font-black text-emerald-400 block">git push</span>
                    <span className="text-[9px] text-slate-400 uppercase">1-Click Push</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Subtitles & Audio Narration Bar */}
          <div className="relative z-10 bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 text-center backdrop-blur-md">
            <p className="text-xs sm:text-sm font-medium text-slate-200 leading-snug">
              {language === 'ta' ? activeChapter.descriptionTa : activeChapter.description}
            </p>
          </div>
        </div>

        {/* 2-Minute Player Controls Bar */}
        <div className="bg-slate-900 px-4 py-3 border-t border-slate-800 flex flex-col gap-2">
          {/* Progress Timeline Scrubber */}
          <div
            className="w-full h-2.5 bg-slate-800 rounded-full cursor-pointer relative group overflow-hidden"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              handleSeek(pos * TOTAL_DURATION_SECONDS);
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-indigo-500 to-purple-500 rounded-full transition-all"
              style={{ width: `${(currentTime / TOTAL_DURATION_SECONDS) * 100}%` }}
            />
          </div>

          {/* Player Buttons */}
          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={() => handleSeek(0)}
                className="p-1.5 hover:text-white rounded-lg transition cursor-pointer"
                title="Restart 2-minute demo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <span className="font-mono text-slate-400 font-bold">
                {formatTime(currentTime)} / 02:00
              </span>
            </div>

            {/* Current Chapter Indicator */}
            <div className="hidden md:flex items-center gap-2 text-indigo-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              <span>
                Chapter {activeChapter.id}: {language === 'ta' ? activeChapter.titleTa : activeChapter.title}
              </span>
            </div>

            {/* Speed, Speech, FullScreen, Jump Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={speakCurrentChapter}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                  isVoiceActive
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Speak Narration Voiceover"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isVoiceActive ? 'Speaking...' : 'Voice'}</span>
              </button>

              <button
                onClick={() => {
                  const speeds = [1, 1.25, 1.5, 2];
                  const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                  setPlaybackSpeed(speeds[nextIdx]);
                }}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono font-bold cursor-pointer"
              >
                {playbackSpeed}x
              </button>

              <button
                onClick={toggleFullScreen}
                className="p-1.5 hover:text-white rounded-lg transition cursor-pointer"
                title="Toggle Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate(activeChapter.targetPage)}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                <span>Try Live</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Minute Chapter Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>2-Minute Chapters (Exact 120-Second Timeline)</span>
          </h2>
          <button
            onClick={() => setIsGitHubModalOpen(true)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <Github className="w-4 h-4" />
            <span>Connect GitHub Repo →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHAPTERS.map((ch, idx) => {
            const isCurrent = activeChapterIndex === idx;
            return (
              <div
                key={ch.id}
                onClick={() => handleSeek(ch.seconds)}
                className={`p-4 rounded-2xl border transition text-left cursor-pointer flex flex-col justify-between space-y-3 ${
                  isCurrent
                    ? 'bg-indigo-50/70 border-indigo-400 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-xs'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {ch.time}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {ch.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {language === 'ta' ? ch.titleTa : ch.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {language === 'ta' ? ch.descriptionTa : ch.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-indigo-600 font-semibold flex items-center gap-1 group">
                    <span>{isCurrent ? 'Playing Now' : 'Jump to Chapter'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(ch.targetPage);
                    }}
                    className="text-slate-500 hover:text-slate-900 underline text-[11px]"
                  >
                    Open Page
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GitHub Connection Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
            <Github className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>GitHub Repository Integration</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                Connected: sanjayrevathi2006
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Clone or push this full codebase to your personal GitHub repository for college submission and evaluation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsGitHubModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition"
          >
            <Github className="w-4 h-4" />
            <span>Manage GitHub / View Commands</span>
          </button>
        </div>
      </div>

      {/* GitHub Connect Modal */}
      <GitHubConnectModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        userEmail="sanjayrevathi2006@gmail.com"
      />
    </div>
  );
};
