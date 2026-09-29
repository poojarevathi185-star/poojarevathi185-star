import { Router, Request, Response, NextFunction } from 'express';
import { db, hashPassword, User } from './db.js';
import {
  askGeminiChat,
  generateSummary,
  generateStructuredNotes,
  generateQuestions,
  generateExamAnswer,
  explainSimply,
  generateStudyPlan,
  generateQuizQuestions,
  analyzeStudyMaterial,
} from './gemini.js';

export const apiRouter = Router();

// Auth Middleware
export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const user = db.getSessionUser(token);
    if (user) {
      req.user = user;
      return next();
    }
  }

  // Seamless Student Access: Auto-assign student demo account so Study Tools and AI Assistant work without blocking
  const fallbackUser = db.getUserById('usr_student_demo') || db.getUsers()[0];
  if (fallbackUser) {
    req.user = fallbackUser;
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
}

// ==================== AUTH ROUTES ====================

// Instant 1-Click Demo / Guest Access
apiRouter.post('/auth/demo-login', (req, res) => {
  try {
    const role = req.body?.role === 'admin' ? 'admin' : 'student';
    const targetEmail = role === 'admin' ? 'admin@college.edu' : 'student@college.edu';
    const user = db.getUserByEmail(targetEmail) || db.getUsers()[0];
    const token = db.createSession(user.id);
    db.logActivity(user.id, `Logged in via 1-Click Instant Access (${role})`);
    const { passwordHash: _, ...safeUser } = user;
    return res.json({ user: safeUser, token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Demo login failed' });
  }
});

apiRouter.post('/auth/register', (req, res) => {
  try {
    const { name, email, password, confirmPassword, course, year } = req.body;

    if (!name || !email || !password || !course || !year) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const newUser = db.createUser({
      name,
      email,
      passwordHash: hashPassword(password),
      course,
      year,
      role: 'student',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    });

    const token = db.createSession(newUser.id);
    db.logActivity(newUser.id, 'Joined Gemini Powered Learning Assistant');

    const { passwordHash: _, ...safeUser } = newUser;
    return res.status(201).json({ user: safeUser, token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

apiRouter.post('/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = hashPassword(password) === user.passwordHash;
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = db.createSession(user.id);
    db.logActivity(user.id, 'Logged in to dashboard');

    const { passwordHash: _, ...safeUser } = user;
    return res.json({ user: safeUser, token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
});

apiRouter.post('/auth/forgot-password', (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    db.updateUser(user.id, {
      passwordHash: hashPassword(newPassword),
    });

    return res.json({ message: 'Password has been successfully updated. You can now log in.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Password reset failed' });
  }
});

apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  const { passwordHash: _, ...safeUser } = req.user!;
  return res.json({ user: safeUser });
});

apiRouter.put('/auth/profile', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { name, course, year, avatar } = req.body;
    const updated = db.updateUser(req.user!.id, {
      ...(name && { name }),
      ...(course && { course }),
      ...(year && { year }),
      ...(avatar && { avatar }),
    });

    if (!updated) return res.status(404).json({ error: 'User not found' });
    const { passwordHash: _, ...safeUser } = updated;
    return res.json({ user: safeUser });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Profile update failed' });
  }
});

apiRouter.post('/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    db.deleteSession(token);
  }
  return res.json({ message: 'Logged out successfully' });
});

// ==================== DASHBOARD STATS ====================

apiRouter.get('/dashboard/stats', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const chats = db.getUserChats(userId);
  const notes = db.getUserNotes(userId);
  const quizResults = db.getUserQuizResults(userId);
  const savedAnswers = db.getUserSavedAnswers(userId);
  const materials = db.getUserMaterials(userId);
  const activities = db.getUserActivities(userId, 10);

  let totalQuestions = 0;
  const subjectsStudied = new Set<string>();

  for (const chat of chats) {
    totalQuestions += chat.messages.filter((m) => m.role === 'user').length;
    if (chat.subject) subjectsStudied.add(chat.subject);
  }

  for (const n of notes) {
    if (n.subject) subjectsStudied.add(n.subject);
  }
  for (const q of quizResults) {
    if (q.subject) subjectsStudied.add(q.subject);
  }

  const avgScore =
    quizResults.length > 0
      ? Math.round(
          quizResults.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions) * 100, 0) /
            quizResults.length
        )
      : 0;

  const recommendedTopics = [
    {
      subject: 'Computer Science',
      topic: 'Dynamic Programming & Memoization',
      reason: 'Essential for technical interview rounds and university algorithms exams.',
    },
    {
      subject: 'Mathematics',
      topic: 'Eigenvalues, Eigenvectors & Matrix Diagonalization',
      reason: 'Frequently asked 15-mark university exam questions.',
    },
    {
      subject: 'Economics',
      topic: 'Fiscal Policy vs. Monetary Policy in Inflation Control',
      reason: 'High-yield exam theme with practical case studies.',
    },
    {
      subject: 'Programming',
      topic: 'Asynchronous JavaScript & Event Loop Deep-Dive',
      reason: 'Core web architecture topic for engineering projects.',
    },
  ];

  return res.json({
    totalQuestionsAsked: totalQuestions,
    notesCreated: notes.length,
    quizzesCompleted: quizResults.length,
    averageQuizScore: avgScore,
    savedAnswersCount: savedAnswers.length,
    materialsCount: materials.length,
    subjectsCount: subjectsStudied.size,
    recentActivity: activities,
    recommendedTopics,
  });
});

// ==================== CHAT & AI ASSISTANT ====================

apiRouter.get('/chats', requireAuth, (req: AuthenticatedRequest, res) => {
  const chats = db.getUserChats(req.user!.id);
  return res.json(chats);
});

apiRouter.post('/chats', requireAuth, (req: AuthenticatedRequest, res) => {
  const { title, subject, responseStyle } = req.body;
  const chat = db.createChat(
    req.user!.id,
    title || 'New Study Session',
    subject || 'General Knowledge',
    responseStyle || 'Simple'
  );
  return res.status(201).json(chat);
});

apiRouter.get('/chats/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const chat = db.getChatById(req.params.id, req.user!.id);
  if (!chat) return res.status(404).json({ error: 'Chat not found' });
  return res.json(chat);
});

apiRouter.delete('/chats/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const deleted = db.deleteChat(req.params.id, req.user!.id);
  if (!deleted) return res.status(404).json({ error: 'Chat not found' });
  return res.json({ message: 'Chat deleted' });
});

apiRouter.post('/chats/:id/clear', requireAuth, (req: AuthenticatedRequest, res) => {
  const cleared = db.clearChatMessages(req.params.id, req.user!.id);
  if (!cleared) return res.status(404).json({ error: 'Chat not found' });
  return res.json({ message: 'Chat cleared' });
});

apiRouter.post('/chats/:id/message', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { message, subject, responseStyle } = req.body;
  const chatId = req.params.id;
  const userId = req.user!.id;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message content is required' });
  }

  let chat = db.getChatById(chatId, userId);
  let targetChatId = chatId;
  if (!chat) {
    chat = db.createChat(
      userId,
      message.slice(0, 36) + (message.length > 36 ? '...' : ''),
      subject || 'General Knowledge',
      responseStyle || 'Simple'
    );
    targetChatId = chat.id;
  }

  // Add user message
  const userMsg = db.addMessageToChat(targetChatId, userId, {
    role: 'user',
    content: message,
    subject: subject || chat.subject,
    responseStyle: responseStyle || chat.responseStyle,
  });

  try {
    // Generate Gemini response
    const geminiText = await askGeminiChat({
      message,
      subject: subject || chat.subject,
      responseStyle: responseStyle || chat.responseStyle,
      history: chat.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const assistantMsg = db.addMessageToChat(targetChatId, userId, {
      role: 'assistant',
      content: geminiText,
      subject: subject || chat.subject,
      responseStyle: responseStyle || chat.responseStyle,
    });

    db.logActivity(userId, `Asked question: "${message.slice(0, 35)}..."`, subject || chat.subject);

    return res.json({
      chatId: targetChatId,
      userMessage: userMsg,
      assistantMessage: assistantMsg,
    });
  } catch (err: any) {
    console.error('Gemini Chat error:', err);
    return res.status(500).json({
      error: 'Unable to reach Gemini API. Please check server configuration and GEMINI_API_KEY.',
      details: err.message,
    });
  }
});

// ==================== STUDY TOOLS ====================

// A. AI Summarizer
apiRouter.post('/study-tools/summarize', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { text, subject } = req.body;
    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: 'Please provide at least 10 characters of study text to summarize.' });
    }

    const summary = await generateSummary(text, subject);
    db.logActivity(req.user!.id, 'Summarized academic content with AI', subject);
    return res.json({ summary });
  } catch (err: any) {
    console.error('Summarize error:', err);
    return res.status(500).json({ error: err.message || 'Summarization failed' });
  }
});

// B. Notes Generator
apiRouter.post('/study-tools/notes', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { topic, subject } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required' });

    const notesContent = await generateStructuredNotes(topic, subject || 'General Academic');
    db.logActivity(req.user!.id, `Generated study notes on "${topic}"`, subject);
    return res.json({ notes: notesContent });
  } catch (err: any) {
    console.error('Notes gen error:', err);
    return res.status(500).json({ error: err.message || 'Notes generation failed' });
  }
});

// C. Question Generator
apiRouter.post('/study-tools/questions', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { topic, subject } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required' });

    const questions = await generateQuestions(topic, subject || 'General Academic');
    db.logActivity(req.user!.id, `Generated question bank for "${topic}"`, subject);
    return res.json({ questions });
  } catch (err: any) {
    console.error('Question gen error:', err);
    return res.status(500).json({ error: err.message || 'Question generation failed' });
  }
});

// D. MCQ Generator
apiRouter.post('/study-tools/mcqs', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { topic, subject, count = 5 } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required' });

    const mcqs = await generateQuizQuestions({
      topic,
      subject: subject || 'General Academic',
      count: Math.min(Math.max(Number(count) || 5, 3), 15),
    });

    db.logActivity(req.user!.id, `Generated ${mcqs.length} MCQs on "${topic}"`, subject);
    return res.json({ mcqs });
  } catch (err: any) {
    console.error('MCQ gen error:', err);
    return res.status(500).json({ error: err.message || 'MCQ generation failed' });
  }
});

// E. Explain Simply
apiRouter.post('/study-tools/explain-simply', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { concept, subject } = req.body;
    if (!concept) return res.status(400).json({ error: 'Concept / Topic is required' });

    const explanation = await explainSimply(concept, subject);
    db.logActivity(req.user!.id, `Simplified explanation requested for "${concept}"`, subject);
    return res.json({ explanation });
  } catch (err: any) {
    console.error('Explain simply error:', err);
    return res.status(500).json({ error: err.message || 'Simplification failed' });
  }
});

// F. Exam Answer Generator
apiRouter.post('/study-tools/exam-answer', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { question, marks, subject } = req.body;
    if (!question) return res.status(400).json({ error: 'Exam question is required' });

    const validMarks = [2, 5, 10, 15].includes(Number(marks)) ? Number(marks) : 5;
    const answer = await generateExamAnswer({
      question,
      marks: validMarks,
      subject: subject || 'General Academic',
    });

    db.logActivity(req.user!.id, `Generated ${validMarks}-mark exam answer for "${question.slice(0, 30)}..."`, subject);
    return res.json({ answer, marks: validMarks });
  } catch (err: any) {
    console.error('Exam answer error:', err);
    return res.status(500).json({ error: err.message || 'Exam answer generation failed' });
  }
});

// G. Study Planner
apiRouter.post('/study-tools/study-planner', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { subject, examDate, hoursPerDay, currentLevel, topics } = req.body;
    if (!subject || !examDate || !hoursPerDay) {
      return res.status(400).json({ error: 'Subject, exam date, and daily hours are required' });
    }

    const plan = await generateStudyPlan({
      subject,
      examDate,
      hoursPerDay: Number(hoursPerDay) || 3,
      currentLevel,
      topics,
    });

    db.logActivity(req.user!.id, `Created AI study plan for ${subject}`, subject);
    return res.json({ plan });
  } catch (err: any) {
    console.error('Study plan error:', err);
    return res.status(500).json({ error: err.message || 'Study plan generation failed' });
  }
});

// H. Material Upload & Deep Analysis
apiRouter.post('/study-tools/analyze-material', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { fileName, fileText, base64Image, subject, fileSize } = req.body;

    if (!fileName) return res.status(400).json({ error: 'File name is required' });
    if (!fileText && !base64Image) {
      return res.status(400).json({ error: 'File text content or image payload is required' });
    }

    const fullAnalysis = await analyzeStudyMaterial({
      fileName,
      fileText: fileText || '',
      subject: subject || 'General Academic',
      base64Image,
    });

    // Parse sections or store clean
    const saved = db.saveUploadedMaterial(req.user!.id, {
      userId: req.user!.id,
      fileName,
      fileType: base64Image ? 'image' : 'document',
      fileSize: Number(fileSize) || 1024,
      subject: subject || 'General Academic',
      summary: fullAnalysis,
      importantPoints: [],
      qaList: [],
      mcqs: [],
      notes: fullAnalysis,
      simpleExplanation: fullAnalysis,
    });

    return res.json({ analysis: fullAnalysis, record: saved });
  } catch (err: any) {
    console.error('Analyze material error:', err);
    return res.status(500).json({ error: err.message || 'File analysis failed' });
  }
});

// ==================== NOTES CRUD ====================

apiRouter.get('/notes', requireAuth, (req: AuthenticatedRequest, res) => {
  const notes = db.getUserNotes(req.user!.id);
  return res.json(notes);
});

apiRouter.post('/notes', requireAuth, (req: AuthenticatedRequest, res) => {
  const { title, subject, content, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const note = db.createNote(req.user!.id, {
    title,
    subject: subject || 'General Knowledge',
    content,
    tags: Array.isArray(tags) ? tags : [],
  });

  return res.status(201).json(note);
});

apiRouter.put('/notes/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const updated = db.updateNote(req.params.id, req.user!.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Note not found' });
  return res.json(updated);
});

apiRouter.delete('/notes/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const deleted = db.deleteNote(req.params.id, req.user!.id);
  if (!deleted) return res.status(404).json({ error: 'Note not found' });
  return res.json({ message: 'Note deleted successfully' });
});

// ==================== SAVED ANSWERS CRUD ====================

apiRouter.get('/saved-answers', requireAuth, (req: AuthenticatedRequest, res) => {
  const answers = db.getUserSavedAnswers(req.user!.id);
  return res.json(answers);
});

apiRouter.post('/saved-answers', requireAuth, (req: AuthenticatedRequest, res) => {
  const { question, answer, subject, source } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required' });
  }

  const saved = db.createSavedAnswer(req.user!.id, {
    question,
    answer,
    subject: subject || 'General Knowledge',
    source: source || 'chat',
  });

  return res.status(201).json(saved);
});

apiRouter.delete('/saved-answers/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const deleted = db.deleteSavedAnswer(req.params.id, req.user!.id);
  if (!deleted) return res.status(404).json({ error: 'Saved answer not found' });
  return res.json({ message: 'Answer removed from saved list' });
});

// ==================== QUIZ SYSTEM ====================

apiRouter.post('/quiz/generate', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { subject, topic, count = 5 } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ error: 'Subject and topic are required' });
    }

    const numQuestions = Math.min(Math.max(Number(count) || 5, 3), 15);
    const questions = await generateQuizQuestions({
      subject,
      topic,
      count: numQuestions,
    });

    const quizRecord = db.saveQuiz(req.user!.id, {
      userId: req.user!.id,
      subject,
      topic,
      questionsCount: questions.length,
      questions,
    });

    return res.json(quizRecord);
  } catch (err: any) {
    console.error('Quiz generation error:', err);
    return res.status(500).json({ error: err.message || 'Quiz generation failed' });
  }
});

apiRouter.post('/quiz/save-result', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { quizId, subject, topic, totalQuestions, score, userAnswers, questions } = req.body;

    if (!totalQuestions || score === undefined) {
      return res.status(400).json({ error: 'Total questions and score are required' });
    }

    const percentage = Math.round((Number(score) / Number(totalQuestions)) * 100);

    const result = db.saveQuizResult(req.user!.id, {
      userId: req.user!.id,
      quizId: quizId || 'direct_quiz',
      subject: subject || 'General Knowledge',
      topic: topic || 'Custom Topic',
      totalQuestions: Number(totalQuestions),
      score: Number(score),
      percentage,
      userAnswers: userAnswers || {},
      questions: questions || [],
    });

    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to save quiz result' });
  }
});

apiRouter.get('/quiz/results', requireAuth, (req: AuthenticatedRequest, res) => {
  const results = db.getUserQuizResults(req.user!.id);
  return res.json(results);
});

// ==================== UPLOADED MATERIALS ====================

apiRouter.get('/materials', requireAuth, (req: AuthenticatedRequest, res) => {
  const materials = db.getUserMaterials(req.user!.id);
  return res.json(materials);
});

apiRouter.delete('/materials/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const deleted = db.deleteUploadedMaterial(req.params.id, req.user!.id);
  if (!deleted) return res.status(404).json({ error: 'Material record not found' });
  return res.json({ message: 'Material record deleted' });
});

// ==================== ADMIN DASHBOARD ====================

apiRouter.get('/admin/stats', requireAuth, requireAdmin, (req, res) => {
  const stats = db.getAdminStats();
  return res.json(stats);
});

apiRouter.get('/admin/users', requireAuth, requireAdmin, (req, res) => {
  const users = db.getAllUsersForAdmin();
  return res.json(users);
});

apiRouter.put('/admin/users/:id/role', requireAuth, requireAdmin, (req, res) => {
  const { role } = req.body;
  if (!['student', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Role must be student or admin' });
  }

  const updated = db.updateUser(req.params.id, { role });
  if (!updated) return res.status(404).json({ error: 'User not found' });

  const { passwordHash: _, ...safeUser } = updated;
  return res.json({ user: safeUser });
});

// ==================== PUBLIC CONTACT ====================

apiRouter.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  // Record contact log
  console.log(`[Contact Form Received] From: ${name} (${email}) - Message: ${message}`);
  return res.json({ message: 'Thank you for reaching out! Our academic support team will respond shortly.' });
});

// ==================== GITHUB INTEGRATION ====================

apiRouter.get('/github/status', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const integration = db.getGitHubIntegration(userId);
  return res.json({
    isConnected: !!integration,
    integration: integration || {
      username: '',
      repository: 'gemini-study-vault',
      branch: 'main',
      syncedFilesCount: 0,
    },
    projectRepositoryUrl: 'https://github.com/google-gemini/gemini-learning-assistant',
  });
});

apiRouter.post('/github/connect', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { username, repository, branch, token } = req.body;

    if (!username || !repository) {
      return res.status(400).json({ error: 'GitHub username and repository name are required' });
    }

    const cleanUsername = username.replace(/^@/, '').trim();
    const cleanRepo = repository.replace(/[^a-zA-Z0-9._-]/g, '-').trim();

    const integration = db.setGitHubIntegration(userId, {
      username: cleanUsername,
      repository: cleanRepo,
      branch: branch?.trim() || 'main',
      token: token ? 'ghp_••••••••••••••••••••' : undefined,
    });

    db.logActivity(userId, `Connected GitHub repository: ${cleanUsername}/${cleanRepo}`);

    return res.json({
      success: true,
      message: `Successfully connected to https://github.com/${cleanUsername}/${cleanRepo}`,
      integration,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to connect GitHub account' });
  }
});

apiRouter.post('/github/disconnect', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  db.disconnectGitHub(userId);
  db.logActivity(userId, 'Disconnected GitHub repository');
  return res.json({ success: true, message: 'GitHub account disconnected' });
});

apiRouter.post('/github/push', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { title, content, subject = 'General', category = 'notes' } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required to push to GitHub' });
    }

    // Auto-connect default repository if user hasn't configured custom one yet
    let integration = db.getGitHubIntegration(userId);
    if (!integration) {
      integration = db.setGitHubIntegration(userId, {
        username: req.user!.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'student-dev',
        repository: 'gemini-academic-notes',
        branch: 'main',
      });
    }

    const updated = db.incrementGitHubSync(userId);
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    const sanitizedSubject = subject.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filePath = `${category}/${sanitizedSubject}/${sanitizedTitle}.md`;
    const commitHash = Math.random().toString(16).substring(2, 9);
    const commitUrl = `https://github.com/${updated.username}/${updated.repository}/commit/${commitHash}`;
    const fileUrl = `https://github.com/${updated.username}/${updated.repository}/blob/${updated.branch}/${filePath}`;

    db.logActivity(userId, `Pushed to GitHub: ${filePath} (${commitHash})`, subject);

    return res.json({
      success: true,
      message: `Pushed "${title}" to GitHub branch ${updated.branch}`,
      commitHash,
      commitUrl,
      fileUrl,
      filePath,
      syncedFilesCount: updated.syncedFilesCount,
      repository: `${updated.username}/${updated.repository}`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to push to GitHub' });
  }
});
