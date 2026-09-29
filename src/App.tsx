import React, { useState } from 'react';
import { PageView } from './types/index.js';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { AppSidebar } from './components/layout/AppSidebar.js';

// Pages
import { HomePage } from './pages/HomePage.js';
import { LoginPage } from './pages/LoginPage.js';
import { SignupPage } from './pages/SignupPage.js';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { AssistantPage } from './pages/AssistantPage.js';
import { SubjectsPage } from './pages/SubjectsPage.js';
import { StudyToolsPage } from './pages/StudyToolsPage.js';
import { StudyMaterialPage } from './pages/StudyMaterialPage.js';
import { NotesPage } from './pages/NotesPage.js';
import { QuizPage } from './pages/QuizPage.js';
import { ProgressPage } from './pages/ProgressPage.js';
import { SavedAnswersPage } from './pages/SavedAnswersPage.js';
import { ChatHistoryPage } from './pages/ChatHistoryPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { DemoVideoPage } from './pages/DemoVideoPage.js';

function MainApp() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [navExtra, setNavExtra] = useState<any>(null);

  const handleNavigate = (page: PageView, extra?: any) => {
    setCurrentPage(page);
    setNavExtra(extra || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 border-2 border-indigo-400 border-t-white animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-800">
            Initializing Gemini Learning Assistant...
          </p>
          <p className="text-xs text-slate-400">Verifying session & database</p>
        </div>
      </div>
    );
  }

  // Determine if this is an in-app page that uses the Sidebar layout
  const isAppPage = [
    'dashboard',
    'assistant',
    'subjects',
    'study-tools',
    'materials',
    'notes',
    'quiz',
    'progress',
    'saved-answers',
    'chat-history',
    'profile',
    'admin',
    'demo-video',
  ].includes(currentPage);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Body */}
      {isAppPage ? (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Left App Sidebar (Desktop) */}
          <div className="hidden md:block">
            <AppSidebar currentPage={currentPage} onNavigate={handleNavigate} />
          </div>

          {/* Right Main App Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
            {currentPage === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
            {currentPage === 'demo-video' && <DemoVideoPage onNavigate={handleNavigate} />}
            {currentPage === 'assistant' && (
              <AssistantPage
                onNavigate={handleNavigate}
                prefillPrompt={navExtra?.prefillPrompt}
                prefillSubject={navExtra?.prefillSubject}
              />
            )}
            {currentPage === 'subjects' && <SubjectsPage onNavigate={handleNavigate} />}
            {currentPage === 'study-tools' && (
              <StudyToolsPage onNavigate={handleNavigate} initialTool={navExtra?.initialTool} />
            )}
            {currentPage === 'materials' && <StudyMaterialPage onNavigate={handleNavigate} />}
            {currentPage === 'notes' && <NotesPage onNavigate={handleNavigate} />}
            {currentPage === 'quiz' && (
              <QuizPage
                onNavigate={handleNavigate}
                prefillSubject={navExtra?.prefillSubject}
                prefillTopic={navExtra?.prefillTopic}
              />
            )}
            {currentPage === 'progress' && <ProgressPage onNavigate={handleNavigate} />}
            {currentPage === 'saved-answers' && <SavedAnswersPage onNavigate={handleNavigate} />}
            {currentPage === 'chat-history' && <ChatHistoryPage onNavigate={handleNavigate} />}
            {currentPage === 'profile' && <ProfilePage onNavigate={handleNavigate} />}
            {currentPage === 'admin' && <AdminDashboardPage onNavigate={handleNavigate} />}
          </main>
        </div>
      ) : (
        /* Public Pages (Home, About, Contact, Auth) */
        <main className="flex-1">
          {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
          {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
          {currentPage === 'signup' && <SignupPage onNavigate={handleNavigate} />}
          {currentPage === 'forgot-password' && (
            <ForgotPasswordPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
          {currentPage === 'contact' && <ContactPage onNavigate={handleNavigate} />}
        </main>
      )}

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
