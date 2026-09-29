const API_BASE = '/api';

export function getToken(): string | null {
  return localStorage.getItem('gla_auth_token');
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem('gla_auth_token', token);
  } else {
    localStorage.removeItem('gla_auth_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (payload: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  demoLogin: (role?: 'student' | 'admin') =>
    request<any>('/auth/demo-login', { method: 'POST', body: JSON.stringify({ role: role || 'student' }) }),
  forgotPassword: (payload: any) => request<any>('/auth/forgot-password', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request<any>('/auth/me'),
  updateProfile: (payload: any) => request<any>('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) }),
  logout: () => request<any>('/auth/logout', { method: 'POST' }),

  // Dashboard
  getDashboardStats: () => request<any>('/dashboard/stats'),

  // Chats
  getChats: () => request<any[]>('/chats'),
  createChat: (payload: { title?: string; subject?: string; responseStyle?: string }) =>
    request<any>('/chats', { method: 'POST', body: JSON.stringify(payload) }),
  getChat: (id: string) => request<any>(`/chats/${id}`),
  deleteChat: (id: string) => request<any>(`/chats/${id}`, { method: 'DELETE' }),
  clearChat: (id: string) => request<any>(`/chats/${id}/clear`, { method: 'POST' }),
  sendMessage: (id: string, payload: { message: string; subject?: string; responseStyle?: string }) =>
    request<any>(`/chats/${id}/message`, { method: 'POST', body: JSON.stringify(payload) }),

  // Study Tools
  summarize: (payload: { text: string; subject?: string }) =>
    request<any>('/study-tools/summarize', { method: 'POST', body: JSON.stringify(payload) }),
  generateNotes: (payload: { topic: string; subject: string }) =>
    request<any>('/study-tools/notes', { method: 'POST', body: JSON.stringify(payload) }),
  generateQuestions: (payload: { topic: string; subject: string }) =>
    request<any>('/study-tools/questions', { method: 'POST', body: JSON.stringify(payload) }),
  generateMCQs: (payload: { topic: string; subject: string; count?: number }) =>
    request<any>('/study-tools/mcqs', { method: 'POST', body: JSON.stringify(payload) }),
  explainSimply: (payload: { concept: string; subject?: string }) =>
    request<any>('/study-tools/explain-simply', { method: 'POST', body: JSON.stringify(payload) }),
  generateExamAnswer: (payload: { question: string; marks: number; subject: string }) =>
    request<any>('/study-tools/exam-answer', { method: 'POST', body: JSON.stringify(payload) }),
  generateStudyPlan: (payload: { subject: string; examDate: string; hoursPerDay: number; currentLevel?: string; topics?: string }) =>
    request<any>('/study-tools/study-planner', { method: 'POST', body: JSON.stringify(payload) }),
  analyzeMaterial: (payload: { fileName: string; fileText?: string; base64Image?: any; subject?: string; fileSize?: number }) =>
    request<any>('/study-tools/analyze-material', { method: 'POST', body: JSON.stringify(payload) }),

  // Notes
  getNotes: () => request<any[]>('/notes'),
  createNote: (payload: { title: string; subject: string; content: string; tags: string[] }) =>
    request<any>('/notes', { method: 'POST', body: JSON.stringify(payload) }),
  updateNote: (id: string, payload: any) => request<any>(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteNote: (id: string) => request<any>(`/notes/${id}`, { method: 'DELETE' }),

  // Saved Answers
  getSavedAnswers: () => request<any[]>('/saved-answers'),
  createSavedAnswer: (payload: { question: string; answer: string; subject?: string; source?: string }) =>
    request<any>('/saved-answers', { method: 'POST', body: JSON.stringify(payload) }),
  deleteSavedAnswer: (id: string) => request<any>(`/saved-answers/${id}`, { method: 'DELETE' }),

  // Quizzes
  generateQuiz: (payload: { subject: string; topic: string; count?: number }) =>
    request<any>('/quiz/generate', { method: 'POST', body: JSON.stringify(payload) }),
  saveQuizResult: (payload: any) => request<any>('/quiz/save-result', { method: 'POST', body: JSON.stringify(payload) }),
  getQuizResults: () => request<any[]>('/quiz/results'),

  // Materials
  getMaterials: () => request<any[]>('/materials'),
  deleteMaterial: (id: string) => request<any>(`/materials/${id}`, { method: 'DELETE' }),

  // Admin
  getAdminStats: () => request<any>('/admin/stats'),
  getAdminUsers: () => request<any[]>('/admin/users'),
  updateUserRole: (id: string, role: string) => request<any>(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),

  // Public Contact
  sendContact: (payload: { name: string; email: string; message: string }) =>
    request<any>('/contact', { method: 'POST', body: JSON.stringify(payload) }),

  // GitHub Integration
  getGitHubStatus: () => request<any>('/github/status'),
  connectGitHub: (payload: { username: string; repository: string; branch?: string; token?: string }) =>
    request<any>('/github/connect', { method: 'POST', body: JSON.stringify(payload) }),
  disconnectGitHub: () => request<any>('/github/disconnect', { method: 'POST' }),
  pushToGitHub: (payload: { title: string; content: string; subject?: string; category?: string }) =>
    request<any>('/github/push', { method: 'POST', body: JSON.stringify(payload) }),
};
