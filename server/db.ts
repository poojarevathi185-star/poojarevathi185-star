import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  course: string;
  year: string;
  role: 'student' | 'admin';
  avatar: string;
  createdAt: string;
}

export interface Session {
  token: string;
  userId: string;
  createdAt: string;
}

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
  correctAnswer: number; // 0-based index
  explanation: string;
}

export interface QuizRecord {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  questionsCount: number;
  questions: QuizQuestion[];
  createdAt: string;
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

export interface GitHubIntegration {
  userId: string;
  username: string;
  repository: string;
  branch: string;
  token?: string;
  connectedAt: string;
  lastSyncedAt?: string;
  syncedFilesCount: number;
}

export interface DatabaseSchema {
  users: User[];
  sessions: Session[];
  chats: Chat[];
  notes: Note[];
  savedAnswers: SavedAnswer[];
  quizzes: QuizRecord[];
  quizResults: QuizResult[];
  uploadedMaterials: UploadedMaterial[];
  activityLogs: ActivityLog[];
  githubIntegrations?: Record<string, GitHubIntegration>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Password hash helper using standard crypto
export function hashPassword(password: string): string {
  const salt = 'gla_salt_2026_secured';
  return crypto.scryptSync(password, salt, 32).toString('hex');
}

function getInitialData(): DatabaseSchema {
  const studentId = 'usr_student_demo';
  const adminId = 'usr_admin_demo';
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 86400000).toISOString();
  const twoDaysAgo = new Date(Date.now() - 172800000).toISOString();

  return {
    users: [
      {
        id: studentId,
        name: 'Alex Rivera',
        email: 'student@college.edu',
        passwordHash: hashPassword('student123'),
        course: 'B.Tech Computer Science & Engineering',
        year: '3rd Year',
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: twoDaysAgo,
      },
      {
        id: adminId,
        name: 'Prof. Katherine Vance',
        email: 'admin@college.edu',
        passwordHash: hashPassword('admin123'),
        course: 'Faculty of Computer Science & Academic Admin',
        year: 'Dean / Administrator',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        createdAt: twoDaysAgo,
      },
    ],
    sessions: [],
    chats: [
      {
        id: 'chat_sample_1',
        userId: studentId,
        title: 'Explaining Cloud Computing Architecture',
        subject: 'Computer Science',
        responseStyle: 'Exam Answer',
        lastMessage: 'Cloud computing provides on-demand access to computing resources over the internet...',
        createdAt: yesterday,
        updatedAt: yesterday,
        messages: [
          {
            id: 'msg_1',
            role: 'user',
            content: 'Explain cloud computing architecture and its deployment models with examples.',
            subject: 'Computer Science',
            responseStyle: 'Exam Answer',
            timestamp: yesterday,
          },
          {
            id: 'msg_2',
            role: 'assistant',
            content: `### 1. Definition
Cloud Computing refers to the on-demand delivery of computing services—including servers, storage, databases, networking, software, and analytics—over the internet ("the cloud") with pay-as-you-go pricing.

### 2. Key Points & Architectural Layers
- **Front-End Platform:** Client devices, web browsers, and user interfaces accessing cloud services.
- **Back-End Platform:** Physical servers, data storage systems, virtual machines, and security protocols managed by cloud service providers.
- **Service Models:**
  - **IaaS (Infrastructure as a Service):** AWS EC2, Google Compute Engine (raw compute, storage, networking).
  - **PaaS (Platform as a Service):** Google App Engine, Heroku (managed runtime for developers).
  - **SaaS (Software as a Service):** Google Workspace, Microsoft 365 (end-user applications).

### 3. Deployment Models
1. **Public Cloud:** Resources owned and operated by third-party providers (e.g., Google Cloud, AWS).
2. **Private Cloud:** Infrastructure dedicated entirely to a single organization, hosted on-premise or by a third party.
3. **Hybrid Cloud:** Combines public and private clouds, sharing data and applications for flexibility.
4. **Community Cloud:** Shared by several organizations with common compliance or security requirements.

### 4. Real-World Example
Netflix runs its streaming delivery microservices on cloud infrastructure, scaling compute nodes dynamically during peak viewing hours without owning physical server farms worldwide.

### 5. Advantages
- **Scalability & Elasticity:** Instantly provision or deprovision resources.
- **Cost Efficiency:** Capital expenditure (CapEx) replaced by operational expenditure (OpEx).
- **High Availability & Disaster Recovery:** Geographically distributed data centers ensure business continuity.

### 6. Disadvantages
- **Internet Dependency:** Offline access is restricted.
- **Security & Compliance Concerns:** Storing sensitive enterprise data on multi-tenant infrastructure.`,
            subject: 'Computer Science',
            responseStyle: 'Exam Answer',
            structured: {
              definition: 'Cloud Computing refers to the on-demand delivery of computing services over the internet with pay-as-you-go pricing.',
              keyPoints: [
                'Front-end and Back-end architectural split',
                'Three service layers: IaaS, PaaS, and SaaS',
                'Four deployment archetypes: Public, Private, Hybrid, Community'
              ],
              example: 'Netflix utilizes scalable cloud microservices for global high-definition streaming.',
              advantages: ['Instant Elasticity', 'Reduced Capital Expenditure', 'Automatic Disaster Recovery'],
              disadvantages: ['Network Latency Dependence', 'Multi-tenant Security Vulnerabilities']
            },
            timestamp: yesterday,
          },
        ],
      },
    ],
    notes: [
      {
        id: 'note_sample_1',
        userId: studentId,
        title: 'Operating Systems: Process Synchronization & Semaphores',
        subject: 'Computer Science',
        tags: ['OS', 'Semaphores', 'Concurrency', 'Exam Prep'],
        content: `## Process Synchronization Overview
When multiple processes execute concurrently, cooperative processes share a common logical address space or data. Unsynchronized access can lead to data inconsistency.

### Critical Section Problem
A section of code requiring exclusive access to shared variables. Must satisfy:
1. **Mutual Exclusion:** If process Pi is executing in its critical section, no other processes can execute in their critical sections.
2. **Progress:** If no process is in its critical section and some processes wish to enter, only those not executing in their remainder sections can participate in deciding who enters next.
3. **Bounded Waiting:** A bound must exist on the number of times other processes are allowed to enter their critical sections after a process has made a request.

### Semaphores
A synchronization tool provided by the operating system:
- **wait(S) or P(S):** Decrements the semaphore value. If negative or zero, process blocks.
- **signal(S) or V(S):** Increments the semaphore value, waking waiting processes.
- **Counting Semaphores:** Unrestricted integer value domain.
- **Binary Semaphores (Mutex):** Value ranges strictly between 0 and 1.`,
        createdAt: twoDaysAgo,
        updatedAt: yesterday,
      },
      {
        id: 'note_sample_2',
        userId: studentId,
        title: 'Time Value of Money & Compound Interest Formulas',
        subject: 'Mathematics',
        tags: ['Finance Math', 'Compounding', 'Formulas'],
        content: `## Time Value of Money (TVM)
The core principle stating that money available at the present time is worth more than the identical sum in the future due to its potential earning capacity.

### Key Formulas:
- **Future Value (FV):**
  $$FV = PV \\times (1 + r)^n$$
- **Present Value (PV):**
  $$PV = \\frac{FV}{(1 + r)^n}$$
- **Continuous Compounding:**
  $$A = P \\times e^{rt}$$

### Applications in Economics & Business:
- Capital budgeting for new projects (Net Present Value - NPV)
- Loan amortization schedules and mortgage repayments
- Bond valuation and yield curve modeling`,
        createdAt: yesterday,
        updatedAt: yesterday,
      },
    ],
    savedAnswers: [
      {
        id: 'saved_1',
        userId: studentId,
        question: 'What is the difference between TCP and UDP?',
        answer: `### TCP vs. UDP Comparison:

1. **Connection Nature:**
   - **TCP (Transmission Control Protocol):** Connection-oriented. Establishes a 3-way handshake (SYN, SYN-ACK, ACK) before data transmission.
   - **UDP (User Datagram Protocol):** Connectionless. Packets are fired without pre-handshake setup.

2. **Reliability:**
   - **TCP:** Guarantees delivery, flow control, congestion control, and ordered packet sequencing. Lost packets are retransmitted.
   - **UDP:** Unreliable, "best-effort" delivery. Packets can arrive out-of-order or be dropped.

3. **Speed & Overhead:**
   - **TCP:** Slower due to 20-60 byte header and acknowledgement overhead.
   - **UDP:** Ultra-fast, minimal 8-byte header overhead.

4. **Typical Use Cases:**
   - **TCP:** Web browsing (HTTP/HTTPS), Email (SMTP), File transfer (FTP), SSH.
   - **UDP:** Real-time multiplayer gaming, DNS lookups, Live video/audio streaming, VoIP.`,
        subject: 'Computer Science',
        source: 'chat',
        createdAt: yesterday,
      },
    ],
    quizzes: [
      {
        id: 'quiz_seed_1',
        userId: studentId,
        subject: 'Computer Science',
        topic: 'Data Structures and Algorithms',
        questionsCount: 5,
        questions: [
          {
            id: 1,
            question: 'What is the average time complexity of searching an element in a balanced Binary Search Tree (BST)?',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
            correctAnswer: 1,
            explanation: 'In a balanced BST, each comparison halves the search space, yielding O(log n) time complexity.',
          },
          {
            id: 2,
            question: 'Which data structure operates on a Last-In, First-Out (LIFO) basis?',
            options: ['Queue', 'Priority Queue', 'Stack', 'Circular Buffer'],
            correctAnswer: 2,
            explanation: 'A Stack follows the LIFO order where the last pushed element is popped first.',
          },
          {
            id: 3,
            question: 'Which sorting algorithm has a worst-case time complexity of O(n log n)?',
            options: ['Merge Sort', 'Quick Sort', 'Bubble Sort', 'Insertion Sort'],
            correctAnswer: 0,
            explanation: 'Merge Sort guarantees O(n log n) in best, average, and worst cases due to its divide-and-conquer tree recursion.',
          },
          {
            id: 4,
            question: 'What technique does Dijkstra algorithm use to find the shortest path from a single source?',
            options: ['Divide and Conquer', 'Greedy Strategy', 'Dynamic Programming', 'Backtracking'],
            correctAnswer: 1,
            explanation: 'Dijkstras algorithm is a greedy algorithm that always extracts the vertex with minimum tentative distance from a priority queue.',
          },
          {
            id: 5,
            question: 'What is the worst-case space complexity of a Depth First Search (DFS) traversal on a graph with V vertices?',
            options: ['O(1)', 'O(V)', 'O(V^2)', 'O(E)'],
            correctAnswer: 1,
            explanation: 'In the worst case (e.g. a degenerate tree or line graph), the recursion call stack holds all V vertices, requiring O(V) auxiliary space.',
          },
        ],
        createdAt: yesterday,
      },
    ],
    quizResults: [
      {
        id: 'qres_1',
        userId: studentId,
        quizId: 'quiz_seed_1',
        subject: 'Computer Science',
        topic: 'Data Structures and Algorithms',
        totalQuestions: 5,
        score: 5,
        percentage: 100,
        userAnswers: { 1: 1, 2: 2, 3: 0, 4: 1, 5: 1 },
        questions: [
          {
            id: 1,
            question: 'What is the average time complexity of searching an element in a balanced Binary Search Tree (BST)?',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
            correctAnswer: 1,
            explanation: 'In a balanced BST, each comparison halves the search space, yielding O(log n) time complexity.',
          },
          {
            id: 2,
            question: 'Which data structure operates on a Last-In, First-Out (LIFO) basis?',
            options: ['Queue', 'Priority Queue', 'Stack', 'Circular Buffer'],
            correctAnswer: 2,
            explanation: 'A Stack follows the LIFO order where the last pushed element is popped first.',
          },
          {
            id: 3,
            question: 'Which sorting algorithm has a worst-case time complexity of O(n log n)?',
            options: ['Merge Sort', 'Quick Sort', 'Bubble Sort', 'Insertion Sort'],
            correctAnswer: 0,
            explanation: 'Merge Sort guarantees O(n log n) in best, average, and worst cases due to its divide-and-conquer tree recursion.',
          },
          {
            id: 4,
            question: 'What technique does Dijkstra algorithm use to find the shortest path from a single source?',
            options: ['Divide and Conquer', 'Greedy Strategy', 'Dynamic Programming', 'Backtracking'],
            correctAnswer: 1,
            explanation: 'Dijkstras algorithm is a greedy algorithm that always extracts the vertex with minimum tentative distance from a priority queue.',
          },
          {
            id: 5,
            question: 'What is the worst-case space complexity of a Depth First Search (DFS) traversal on a graph with V vertices?',
            options: ['O(1)', 'O(V)', 'O(V^2)', 'O(E)'],
            correctAnswer: 1,
            explanation: 'In the worst case (e.g. a degenerate tree or line graph), the recursion call stack holds all V vertices, requiring O(V) auxiliary space.',
          },
        ],
        createdAt: yesterday,
      },
    ],
    uploadedMaterials: [],
    activityLogs: [
      {
        id: 'act_1',
        userId: studentId,
        userName: 'Alex Rivera',
        action: 'Created note on Process Synchronization',
        subject: 'Computer Science',
        timestamp: twoDaysAgo,
      },
      {
        id: 'act_2',
        userId: studentId,
        userName: 'Alex Rivera',
        action: 'Completed DSA Quiz with 100% score',
        subject: 'Computer Science',
        timestamp: yesterday,
      },
      {
        id: 'act_3',
        userId: studentId,
        userName: 'Alex Rivera',
        action: 'Asked question: Cloud Computing Architecture',
        subject: 'Computer Science',
        timestamp: yesterday,
      },
    ],
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading database file, initializing fresh:', err);
        this.data = getInitialData();
        this.save();
      }
    } else {
      this.data = getInitialData();
      this.save();
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // Users
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: 'usr_' + crypto.randomBytes(6).toString('hex'),
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const index = this.data.users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    this.data.users[index] = { ...this.data.users[index], ...updates };
    this.save();
    return this.data.users[index];
  }

  // Sessions
  createSession(userId: string): string {
    const token = 'tok_' + crypto.randomBytes(24).toString('hex');
    this.data.sessions.push({
      token,
      userId,
      createdAt: new Date().toISOString(),
    });
    this.save();
    return token;
  }

  getSessionUser(token: string): User | undefined {
    const session = this.data.sessions.find((s) => s.token === token);
    if (!session) return undefined;
    return this.getUserById(session.userId);
  }

  deleteSession(token: string): void {
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.save();
  }

  // Chats
  getUserChats(userId: string): Chat[] {
    return this.data.chats.filter((c) => c.userId === userId).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getChatById(chatId: string, userId: string): Chat | undefined {
    return this.data.chats.find((c) => c.id === chatId && c.userId === userId);
  }

  createChat(userId: string, title: string, subject: string, responseStyle: string): Chat {
    const newChat: Chat = {
      id: 'chat_' + crypto.randomBytes(6).toString('hex'),
      userId,
      title,
      subject: subject || 'General Knowledge',
      responseStyle: responseStyle || 'Simple',
      lastMessage: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    this.data.chats.unshift(newChat);
    this.save();
    return newChat;
  }

  addMessageToChat(chatId: string, userId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage | undefined {
    const chat = this.getChatById(chatId, userId);
    if (!chat) return undefined;

    const fullMessage: ChatMessage = {
      ...message,
      id: 'msg_' + crypto.randomBytes(6).toString('hex'),
      timestamp: new Date().toISOString(),
    };

    chat.messages.push(fullMessage);
    chat.lastMessage = message.content.slice(0, 120);
    chat.updatedAt = new Date().toISOString();
    this.save();
    return fullMessage;
  }

  deleteChat(chatId: string, userId: string): boolean {
    const prevLength = this.data.chats.length;
    this.data.chats = this.data.chats.filter((c) => !(c.id === chatId && c.userId === userId));
    this.save();
    return this.data.chats.length !== prevLength;
  }

  clearChatMessages(chatId: string, userId: string): boolean {
    const chat = this.getChatById(chatId, userId);
    if (!chat) return false;
    chat.messages = [];
    chat.lastMessage = '';
    chat.updatedAt = new Date().toISOString();
    this.save();
    return true;
  }

  // Notes
  getUserNotes(userId: string): Note[] {
    return this.data.notes.filter((n) => n.userId === userId).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  createNote(userId: string, note: { title: string; subject: string; content: string; tags: string[] }): Note {
    const newNote: Note = {
      id: 'note_' + crypto.randomBytes(6).toString('hex'),
      userId,
      title: note.title,
      subject: note.subject,
      content: note.content,
      tags: note.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.notes.unshift(newNote);
    this.logActivity(userId, `Created note: ${note.title}`, note.subject);
    this.save();
    return newNote;
  }

  updateNote(noteId: string, userId: string, updates: Partial<{ title: string; subject: string; content: string; tags: string[] }>): Note | undefined {
    const note = this.data.notes.find((n) => n.id === noteId && n.userId === userId);
    if (!note) return undefined;
    if (updates.title !== undefined) note.title = updates.title;
    if (updates.subject !== undefined) note.subject = updates.subject;
    if (updates.content !== undefined) note.content = updates.content;
    if (updates.tags !== undefined) note.tags = updates.tags;
    note.updatedAt = new Date().toISOString();
    this.save();
    return note;
  }

  deleteNote(noteId: string, userId: string): boolean {
    const initial = this.data.notes.length;
    this.data.notes = this.data.notes.filter((n) => !(n.id === noteId && n.userId === userId));
    this.save();
    return this.data.notes.length !== initial;
  }

  // Saved Answers
  getUserSavedAnswers(userId: string): SavedAnswer[] {
    return this.data.savedAnswers.filter((a) => a.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createSavedAnswer(userId: string, data: { question: string; answer: string; subject: string; source: 'chat' | 'study_tools' | 'file_upload' }): SavedAnswer {
    const saved: SavedAnswer = {
      id: 'ans_' + crypto.randomBytes(6).toString('hex'),
      userId,
      question: data.question,
      answer: data.answer,
      subject: data.subject || 'General Knowledge',
      source: data.source || 'chat',
      createdAt: new Date().toISOString(),
    };
    this.data.savedAnswers.unshift(saved);
    this.logActivity(userId, `Saved answer for: "${data.question.slice(0, 40)}..."`, data.subject);
    this.save();
    return saved;
  }

  deleteSavedAnswer(id: string, userId: string): boolean {
    const initial = this.data.savedAnswers.length;
    this.data.savedAnswers = this.data.savedAnswers.filter((a) => !(a.id === id && a.userId === userId));
    this.save();
    return this.data.savedAnswers.length !== initial;
  }

  // Quizzes & Results
  saveQuiz(userId: string, quiz: Omit<QuizRecord, 'id' | 'createdAt'>): QuizRecord {
    const record: QuizRecord = {
      ...quiz,
      id: 'quiz_' + crypto.randomBytes(6).toString('hex'),
      createdAt: new Date().toISOString(),
    };
    this.data.quizzes.unshift(record);
    this.save();
    return record;
  }

  saveQuizResult(userId: string, result: Omit<QuizResult, 'id' | 'createdAt'>): QuizResult {
    const record: QuizResult = {
      ...result,
      id: 'qres_' + crypto.randomBytes(6).toString('hex'),
      createdAt: new Date().toISOString(),
    };
    this.data.quizResults.unshift(record);
    this.logActivity(userId, `Completed quiz on ${result.topic} (${result.score}/${result.totalQuestions})`, result.subject);
    this.save();
    return record;
  }

  getUserQuizResults(userId: string): QuizResult[] {
    return this.data.quizResults.filter((r) => r.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Uploaded Materials
  saveUploadedMaterial(userId: string, material: Omit<UploadedMaterial, 'id' | 'createdAt'>): UploadedMaterial {
    const record: UploadedMaterial = {
      ...material,
      id: 'mat_' + crypto.randomBytes(6).toString('hex'),
      createdAt: new Date().toISOString(),
    };
    this.data.uploadedMaterials.unshift(record);
    this.logActivity(userId, `Analyzed study material: ${material.fileName}`, material.subject);
    this.save();
    return record;
  }

  getUserMaterials(userId: string): UploadedMaterial[] {
    return this.data.uploadedMaterials.filter((m) => m.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  deleteUploadedMaterial(id: string, userId: string): boolean {
    const initial = this.data.uploadedMaterials.length;
    this.data.uploadedMaterials = this.data.uploadedMaterials.filter((m) => !(m.id === id && m.userId === userId));
    this.save();
    return this.data.uploadedMaterials.length !== initial;
  }

  // Activity Logs
  logActivity(userId: string, action: string, subject?: string, details?: string): void {
    const user = this.getUserById(userId);
    this.data.activityLogs.unshift({
      id: 'act_' + crypto.randomBytes(6).toString('hex'),
      userId,
      userName: user ? user.name : 'Unknown User',
      action,
      subject,
      details,
      timestamp: new Date().toISOString(),
    });
    // Keep max 200 logs
    if (this.data.activityLogs.length > 200) {
      this.data.activityLogs = this.data.activityLogs.slice(0, 200);
    }
    this.save();
  }

  getUserActivities(userId: string, limit = 15): ActivityLog[] {
    return this.data.activityLogs.filter((a) => a.userId === userId).slice(0, limit);
  }

  // Admin stats & data
  getAdminStats() {
    const totalUsers = this.data.users.length;
    const studentCount = this.data.users.filter((u) => u.role === 'student').length;
    const adminCount = this.data.users.filter((u) => u.role === 'admin').length;
    
    // Count total questions asked across all chats
    let totalQuestionsAsked = 0;
    const subjectCounts: Record<string, number> = {};
    for (const chat of this.data.chats) {
      const userQuestions = chat.messages.filter((m) => m.role === 'user').length;
      totalQuestionsAsked += userQuestions;
      if (chat.subject) {
        subjectCounts[chat.subject] = (subjectCounts[chat.subject] || 0) + 1;
      }
    }

    const totalQuizzesCompleted = this.data.quizResults.length;
    const totalNotesCreated = this.data.notes.length;
    const totalMaterialsAnalyzed = this.data.uploadedMaterials.length;

    // Active users in last 7 days
    const recentTime = Date.now() - 7 * 86400000;
    const activeUserIds = new Set(
      this.data.activityLogs
        .filter((l) => new Date(l.timestamp).getTime() > recentTime)
        .map((l) => l.userId)
    );

    return {
      totalUsers,
      studentCount,
      adminCount,
      activeUsersCount: Math.max(activeUserIds.size, 1),
      totalQuestionsAsked,
      totalQuizzesCompleted,
      totalNotesCreated,
      totalMaterialsAnalyzed,
      subjectCounts,
      recentActivity: this.data.activityLogs.slice(0, 20),
    };
  }

  getAllUsersForAdmin(): Array<Omit<User, 'passwordHash'>> {
    return this.data.users.map(({ passwordHash, ...rest }) => rest);
  }

  // GitHub Integration Methods
  getGitHubIntegration(userId: string): GitHubIntegration | null {
    if (!this.data.githubIntegrations) this.data.githubIntegrations = {};
    return this.data.githubIntegrations[userId] || null;
  }

  setGitHubIntegration(userId: string, data: Partial<GitHubIntegration>): GitHubIntegration {
    if (!this.data.githubIntegrations) this.data.githubIntegrations = {};
    const existing = this.data.githubIntegrations[userId] || {
      userId,
      username: 'sanjay-student',
      repository: 'gemini-academic-notes',
      branch: 'main',
      connectedAt: new Date().toISOString(),
      syncedFilesCount: 0,
    };
    const updated: GitHubIntegration = {
      ...existing,
      ...data,
      userId,
      connectedAt: existing.connectedAt || new Date().toISOString(),
    };
    this.data.githubIntegrations[userId] = updated;
    this.save();
    return updated;
  }

  disconnectGitHub(userId: string): boolean {
    if (this.data.githubIntegrations && this.data.githubIntegrations[userId]) {
      delete this.data.githubIntegrations[userId];
      this.save();
      return true;
    }
    return false;
  }

  incrementGitHubSync(userId: string): GitHubIntegration {
    const current = this.getGitHubIntegration(userId);
    if (current) {
      current.syncedFilesCount = (current.syncedFilesCount || 0) + 1;
      current.lastSyncedAt = new Date().toISOString();
      this.save();
      return current;
    }
    return this.setGitHubIntegration(userId, {
      syncedFilesCount: 1,
      lastSyncedAt: new Date().toISOString(),
    });
  }
}

export const db = new Database();
