import { useState } from 'react';
import {
  units,
  getUnit,
  loadCurrentUnitNumber,
  saveCurrentUnitNumber,
  dailySessionSteps,
  flashcardCategories,
  type SessionStepId,
} from './data';
import { useAuth } from './contexts/AuthProvider';
import { useProgress } from './hooks/useProgress';
import { AuthScreen } from './components/AuthScreen';
import { Home } from './components/Home';
import { Flashcards } from './components/Flashcards';
import { Quiz } from './components/Quiz';
import { FillBlank } from './components/FillBlank';
import { Conjugation } from './components/Conjugation';
import { Mission } from './components/Mission';
import { Lesson } from './components/Lesson';
import { Review } from './components/Review';
import { Sidebar, stepIcons } from './components/Sidebar';
import { UserMenu } from './components/UserMenu';
import { liveReviewItems } from './lib/reviewList';

type View = 'home' | 'learn' | 'review' | SessionStepId;

export default function App() {
  const { loading, user, isGuest } = useAuth();
  const [unitNumber, setUnitNumber] = useState(loadCurrentUnitNumber);
  const unit = getUnit(unitNumber);
  const {
    progress,
    syncStatus,
    updateProgress,
    recordReview,
    markStepComplete,
    resetProgress,
    todayComplete,
  } = useProgress(unitNumber);
  const [view, setView] = useState<View>('home');

  const goHome = () => setView('home');

  const selectUnit = (n: number) => {
    saveCurrentUnitNumber(n);
    setUnitNumber(n);
    setView('home');
  };

  const handleStepComplete = (stepId: SessionStepId) => {
    markStepComplete(stepId);
    setView('home');
  };

  if (loading) {
    return (
      <div className="auth-screen">
        <div className="auth-card auth-card--loading">
          <span className="sync-spinner" aria-hidden="true" />
          <p className="auth-sub">Chargement…</p>
        </div>
      </div>
    );
  }

  if (!user && !isGuest) {
    return <AuthScreen />;
  }

  const { meta, flashcards, multipleChoice, fillBlank, conjugationExercises, missionPrompts } = unit;
  const categories = flashcardCategories(unit);
  const reviewItems = progress.reviewItems ?? [];
  const reviewCount = liveReviewItems(unit, reviewItems).length;
  const reviewCardIds = reviewItems.filter((item) => item.kind === 'flashcard').map((item) => item.id);

  return (
    <div className="app-shell">
      <Sidebar
        unit={unit}
        view={view}
        progress={progress}
        reviewCount={reviewCount}
        onNavigate={setView}
        syncStatus={syncStatus}
      />

      <div className="app">
        <header className="header">
          {syncStatus === 'syncing' && <div className="sync-bar" aria-hidden="true" />}
          {view !== 'home' && (
            <button type="button" className="back-btn" onClick={goHome} aria-label="Back">
              ←
            </button>
          )}
          <div className="header-text">
            <span className="header-level">A1 · Unité {meta.number}</span>
            <h1 className="header-title">
              {view === 'home'
                ? meta.title
                : view === 'learn'
                  ? 'Leçon'
                  : view === 'review'
                    ? 'À revoir'
                    : getStepLabel(view, dailySessionSteps)}
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
              unit={unit}
              units={units}
              progress={progress}
              todayComplete={todayComplete}
              onSelectUnit={selectUnit}
              onOpenLesson={() => setView('learn')}
              onOpenReview={() => setView('review')}
              onSelectStep={(id) => setView(id)}
              onReset={resetProgress}
            />
          )}
          {view === 'learn' && (
            <Lesson
              unit={unit}
              onStartPractice={() => setView('flashcards')}
            />
          )}
          {view === 'review' && (
            <Review
              unit={unit}
              items={reviewItems}
              onRecord={recordReview}
            />
          )}
          {view === 'flashcards' && (
            <Flashcards
              flashcards={flashcards}
              categories={categories}
              priorityIds={reviewCardIds}
              onComplete={(scores) => {
                updateProgress({
                  flashcardScores: { ...progress.flashcardScores, ...scores },
                });
                recordReview(
                  Object.entries(scores)
                    .filter(([, rating]) => rating === 'learning')
                    .map(([id]) => ({ kind: 'flashcard' as const, id })),
                  Object.entries(scores)
                    .filter(([, rating]) => rating === 'know')
                    .map(([id]) => ({ kind: 'flashcard' as const, id })),
                );
                handleStepComplete('flashcards');
              }}
            />
          )}
          {view === 'quiz' && (
            <Quiz
              questions={multipleChoice}
              onComplete={({ score, missedIds, correctIds }) => {
                updateProgress({ quizScore: score });
                recordReview(
                  missedIds.map((id) => ({ kind: 'quiz', id })),
                  correctIds.map((id) => ({ kind: 'quiz', id })),
                );
                handleStepComplete('quiz');
              }}
            />
          )}
          {view === 'fill' && (
            <FillBlank
              exercises={fillBlank}
              onComplete={({ score, missedIds, correctIds }) => {
                updateProgress({ fillScore: score });
                recordReview(
                  missedIds.map((id) => ({ kind: 'fill', id })),
                  correctIds.map((id) => ({ kind: 'fill', id })),
                );
                handleStepComplete('fill');
              }}
            />
          )}
          {view === 'conjugate' && (
            <Conjugation
              exercises={conjugationExercises}
              onComplete={({ missed, correct }) => {
                updateProgress({ conjugationComplete: true });
                recordReview(
                  missed.map((row) => ({ kind: 'conjugate', id: row.id, pronoun: row.pronoun })),
                  correct.map((row) => ({ kind: 'conjugate', id: row.id, pronoun: row.pronoun })),
                );
                handleStepComplete('conjugate');
              }}
            />
          )}
          {view === 'mission' && (
            <Mission
              prompts={missionPrompts}
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

function getStepLabel(
  view: SessionStepId,
  steps: ReadonlyArray<{ id: SessionStepId; label: string }>,
): string {
  return steps.find((s) => s.id === view)?.label ?? view;
}
