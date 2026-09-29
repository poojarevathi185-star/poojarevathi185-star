export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  course: string;
  year: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
}

export type PageView =
  | 'home'
  | 'about'
  | 'contact'
  | 'demo-video'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'dashboard'
  | 'assistant'
  | 'subjects'
  | 'study-tools'
  | 'materials'
  | 'notes'
  | 'quiz'
  | 'progress'
  | 'saved-answers'
  | 'chat-history'
  | 'profile'
  | 'admin';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  subject?: string;
  responseStyle?: string;
  structured?: {
    definition?: string;
    keyPoints?: string[];
    example?: string;
    advantages?: string[];
    disadvantages?: string[];
  };
  timestamp: string;
}

export interface Chat {
  id: string;
  userId: string;
  title: string;
  subject: string;
  responseStyle: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  subject: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SavedAnswer {
  id: string;
  userId: string;
  question: string;
  answer: string;
  subject: string;
  source: 'chat' | 'study_tools' | 'file_upload';
  createdAt: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  subject: string;
  topic: string;
  totalQuestions: number;
  score: number;
  percentage: number;
  userAnswers: Record<number, number>;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface UploadedMaterial {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  subject?: string;
  summary: string;
  importantPoints: string[];
  qaList: Array<{ question: string; answer: string }>;
  mcqs: Array<{ question: string; options: string[]; answer: string; explanation: string }>;
  notes: string;
  simpleExplanation: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  subject?: string;
  details?: string;
  timestamp: string;
}

export interface DashboardStats {
  totalQuestionsAsked: number;
  notesCreated: number;
  quizzesCompleted: number;
  averageQuizScore: number;
  savedAnswersCount: number;
  materialsCount: number;
  subjectsCount: number;
  recentActivity: ActivityLog[];
  recommendedTopics: Array<{
    subject: string;
    topic: string;
    reason: string;
  }>;
}

export interface AdminStats {
  totalUsers: number;
  studentCount: number;
  adminCount: number;
  activeUsersCount: number;
  totalQuestionsAsked: number;
  totalQuizzesCompleted: number;
  totalNotesCreated: number;
  totalMaterialsAnalyzed: number;
  subjectCounts: Record<string, number>;
  recentActivity: ActivityLog[];
}
