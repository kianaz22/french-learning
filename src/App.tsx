import { useState } from 'react';
import { unit1Meta, dailySessionSteps } from './data/unit1';
import { useAuth } from './contexts/AuthProvider';
import { useProgress } from './hooks/useProgress';
import { AuthScreen } from './components/AuthScreen';
import { Home } from './components/Home';
import { Flashcards } from './components/Flashcards';
import { Quiz } from './components/Quiz';
import { FillBlank } from './components/FillBlank';
import { Conjugation } from './components/Conjugation';
import { Mission } from './components/Mission';
import { Sidebar, stepIcons } from './components/Sidebar';
import { UserMenu } from './components/UserMenu';
import type { SessionStepId } from './data/unit1';

type View = 'home' | SessionStepId;

export default function App() {
  const { loading, user, isGuest } = useAuth();
  const {
    progress,
    syncStatus,
    progressReady,
    updateProgress,
    markStepComplete,
    resetProgress,
    todayComplete,
  } = useProgress();
  const [view, setView] = useState<View>('home');

  const goHome = () => setView('home');

  const handleStepComplete = (stepId: SessionStepId) => {
    markStepComplete(stepId);
    setView('home');
  };

  if (loading) {
    return (
      <div className="auth-screen">
        <div className="auth-card auth-card--loading">
          <p className="auth-sub">Chargement…</p>
        </div>
      </div>
    );
  }

  if (!user && !isGuest) {
    return <AuthScreen />;
  }

  if (!progressReady) {
    return (
      <div className="auth-screen">
        <div className="auth-card auth-card--loading">
          <p className="auth-sub">Syncing your progress…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar view={view} progress={progress} onNavigate={setView} syncStatus={syncStatus} />

      <div className="app">
        <header className="header">
          {view !== 'home' && (
            <button type="button" className="back-btn" onClick={goHome} aria-label="Back">
              ←
            </button>
          )}
          <div className="header-text">
            <span className="header-level">A1 · Unité {unit1Meta.number}</span>
            <h1 className="header-title">
              {view === 'home' ? unit1Meta.title : getStepLabel(view)}
            </h1>
          </div>
          <div className="header-actions">
            {progress.streak > 0 && (
              <span className="streak streak--mobile" title="Day streak">
                🔥 {progress.streak}
              </span>
            )}
            <UserMenu syncStatus={syncStatus} />
          </div>
        </header>

        <main className="main">
          {view === 'home' && (
            <Home
              progress={progress}
              todayComplete={todayComplete}
              onSelectStep={(id) => setView(id)}
              onReset={resetProgress}
            />
          )}
          {view === 'flashcards' && (
            <Flashcards
              onComplete={(scores) => {
                updateProgress({ flashcardScores: scores });
                handleStepComplete('flashcards');
              }}
            />
          )}
          {view === 'quiz' && (
            <Quiz
              onComplete={(score) => {
                updateProgress({ quizScore: score });
                handleStepComplete('quiz');
              }}
            />
          )}
          {view === 'fill' && (
            <FillBlank
              onComplete={(score) => {
                updateProgress({ fillScore: score });
                handleStepComplete('fill');
              }}
            />
          )}
          {view === 'conjugate' && (
            <Conjugation
              onComplete={() => {
                updateProgress({ conjugationComplete: true });
                handleStepComplete('conjugate');
              }}
            />
          )}
          {view === 'mission' && (
            <Mission
              completedIds={progress.missionsCompleted}
              onComplete={(missionId) => {
                updateProgress({
                  missionsCompleted: [...new Set([...progress.missionsCompleted, missionId])],
                });
                handleStepComplete('mission');
              }}
            />
          )}
        </main>

        <nav className="bottom-nav" aria-label="Study modes">
          <button
            type="button"
            className={`nav-item ${view === 'home' ? 'nav-item--active' : ''}`}
            onClick={goHome}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Accueil</span>
          </button>
          {dailySessionSteps.map((step) => {
            const done = progress.completedSteps.includes(step.id);
            const active = view === step.id;
            return (
              <button
                key={step.id}
                type="button"
                className={`nav-item ${done ? 'nav-item--done' : ''} ${active ? 'nav-item--active' : ''}`}
                onClick={() => setView(step.id)}
              >
                <span className="nav-icon">{stepIcons[step.id]}</span>
                <span className="nav-label">{step.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function getStepLabel(view: SessionStepId): string {
  return dailySessionSteps.find((s) => s.id === view)?.label ?? view;
}
