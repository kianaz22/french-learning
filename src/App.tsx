import { useCallback, useEffect, useRef, useState } from 'react';
import {
  units,
  getUnit,
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
import { Sidebar } from './components/Sidebar';
import { UserMenu } from './components/UserMenu';
import { liveReviewItems } from './lib/reviewList';
import {
  lastFinishedUnit,
  loadCourse,
  saveCourse,
  type CourseStatus,
} from './lib/course';
import { hashEquals, parseHash, toHash, type AppView } from './lib/hashRoute';
import { isSessionStep, nextSessionStep, stepLabel } from './lib/session';

type View = AppView;

export default function App() {
  const { loading, user, isGuest } = useAuth();
  const [course, setCourse] = useState(loadCourse);
  const practiceUnit = lastFinishedUnit(course);
  const [unitNumber, setUnitNumber] = useState(practiceUnit);
  const initialRoute = parseHash(window.location.hash);
  const [readingUnit, setReadingUnit] = useState<number | null>(initialRoute.readingUnit);
  const [situationId, setSituationId] = useState<string | undefined>(initialRoute.situationId);
  const unit = getUnit(unitNumber);
  const lessonUnit = getUnit(readingUnit ?? unitNumber);
  const {
    progress,
    syncStatus,
    updateProgress,
    recordReview,
    markStepComplete,
    resetProgress,
    todayComplete,
  } = useProgress(unitNumber);
  const [view, setView] = useState<View>(initialRoute.view);
  const skipHashWrite = useRef(true);

  useEffect(() => {
    setUnitNumber(practiceUnit);
    saveCurrentUnitNumber(practiceUnit);
  }, [practiceUnit]);

  const applyRoute = useCallback((route: ReturnType<typeof parseHash>) => {
    skipHashWrite.current = true;
    setView(route.view);
    setReadingUnit(route.readingUnit);
    setSituationId(route.situationId);
  }, []);

  useEffect(() => {
    const onPop = () => applyRoute(parseHash(window.location.hash));
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', onPop);
    };
  }, [applyRoute]);

  useEffect(() => {
    const next = toHash({ view, readingUnit, situationId });
    const current = window.location.hash || '#/';
    if (hashEquals(current, next)) {
      skipHashWrite.current = false;
      return;
    }
    if (skipHashWrite.current) {
      skipHashWrite.current = false;
      history.replaceState(null, '', next);
      return;
    }
    history.pushState(null, '', next);
  }, [view, readingUnit, situationId]);

  const goHome = () => {
    setReadingUnit(null);
    setSituationId(undefined);
    setView('home');
  };

  const openLesson = (n: number, sit?: string) => {
    setReadingUnit(n);
    setSituationId(sit);
    setView('learn');
  };

  const openPractice = (id: SessionStepId) => {
    setReadingUnit(null);
    setSituationId(undefined);
    setView(id);
  };

  const setStatus = (n: number, status: CourseStatus) => {
    const next = {
      ...course,
      statuses: { ...course.statuses, [n]: status },
    };
    const nextPractice = lastFinishedUnit(next);
    if (nextPractice !== practiceUnit) {
      const title = getUnit(nextPractice).meta.title;
      if (
        !window.confirm(
          `Pratiquer l’unité ${nextPractice} — ${title} ? La session suivra cette unité.`,
        )
      ) {
        return;
      }
    }
    saveCourse(next);
    setCourse(next);
  };

  const adoptAndPractice = (n: number) => {
    const next = {
      ...course,
      statuses: { ...course.statuses, [n]: 'done' as const },
    };
    saveCourse(next);
    setCourse(next);
    setReadingUnit(null);
    setSituationId(undefined);
    setView('flashcards');
  };

  const recordStep = (stepId: SessionStepId) => {
    markStepComplete(stepId);
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
  const nextAfter = (from: SessionStepId) => nextSessionStep(progress.completedSteps, from);
  const continueStep = nextSessionStep(progress.completedSteps) ?? 'flashcards';

  return (
    <div className="app-shell">
      <Sidebar
        unit={unit}
        view={view}
        progress={progress}
        reviewCount={reviewCount}
        onNavigate={(next) => {
          if (next === 'home') goHome();
          else if (next === 'learn') openLesson(unitNumber);
          else if (next === 'review') setView('review');
          else openPractice(next);
        }}
        syncStatus={syncStatus}
      />

      <div className="app">
        <header className="header">
          {syncStatus === 'syncing' && <div className="sync-bar" aria-hidden="true" />}
          {view !== 'home' && (
            <button type="button" className="back-btn" onClick={goHome} aria-label="Retour à l’accueil">
              ←
            </button>
          )}
          <div className="header-text">
            <span className="header-level">
              A1 · Unité {view === 'learn' ? lessonUnit.meta.number : meta.number}
            </span>
            <h1 className="header-title">
              {view === 'home'
                ? meta.title
                : view === 'learn'
                  ? lessonUnit.meta.title
                  : view === 'review'
                    ? 'À revoir'
                    : stepLabel(view)}
            </h1>
          </div>
          <div className="header-actions">
            {progress.streak > 0 && (
              <span className="streak streak--mobile" title="Série de jours">
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
              course={course}
              progress={progress}
              todayComplete={todayComplete}
              onSetStatus={setStatus}
              onOpenLesson={openLesson}
              onOpenReview={() => setView('review')}
              onSelectStep={openPractice}
              onReset={resetProgress}
            />
          )}
          {view === 'learn' && (
            <Lesson
              key={`${lessonUnit.meta.number}-${situationId ?? 'overview'}`}
              unit={lessonUnit}
              initialSituationId={situationId}
              practiceLabel={`l’unité ${meta.number}`}
              onStartPractice={
                lessonUnit.meta.number === unitNumber
                  ? () => openPractice('flashcards')
                  : undefined
              }
              onAdoptAndPractice={
                lessonUnit.meta.number === unitNumber
                  ? undefined
                  : () => adoptAndPractice(lessonUnit.meta.number)
              }
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
              nextStep={nextAfter('flashcards')}
              onHome={goHome}
              onNext={openPractice}
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
                recordStep('flashcards');
              }}
            />
          )}
          {view === 'quiz' && (
            <Quiz
              questions={multipleChoice}
              nextStep={nextAfter('quiz')}
              onHome={goHome}
              onNext={openPractice}
              onComplete={({ score, missedIds, correctIds }) => {
                updateProgress({ quizScore: score });
                recordReview(
                  missedIds.map((id) => ({ kind: 'quiz', id })),
                  correctIds.map((id) => ({ kind: 'quiz', id })),
                );
                recordStep('quiz');
              }}
            />
          )}
          {view === 'fill' && (
            <FillBlank
              exercises={fillBlank}
              nextStep={nextAfter('fill')}
              onHome={goHome}
              onNext={openPractice}
              onComplete={({ score, missedIds, correctIds }) => {
                updateProgress({ fillScore: score });
                recordReview(
                  missedIds.map((id) => ({ kind: 'fill', id })),
                  correctIds.map((id) => ({ kind: 'fill', id })),
                );
                recordStep('fill');
              }}
            />
          )}
          {view === 'conjugate' && (
            <Conjugation
              exercises={conjugationExercises}
              nextStep={nextAfter('conjugate')}
              onHome={goHome}
              onNext={openPractice}
              onComplete={({ missed, correct }) => {
                updateProgress({ conjugationComplete: true });
                recordReview(
                  missed.map((row) => ({ kind: 'conjugate', id: row.id, pronoun: row.pronoun })),
                  correct.map((row) => ({ kind: 'conjugate', id: row.id, pronoun: row.pronoun })),
                );
                recordStep('conjugate');
              }}
            />
          )}
          {view === 'mission' && (
            <Mission
              prompts={missionPrompts}
              completedIds={progress.missionsCompleted}
              nextStep={nextAfter('mission')}
              onHome={goHome}
              onNext={openPractice}
              onComplete={(missionId) => {
                updateProgress({
                  missionsCompleted: [...new Set([...progress.missionsCompleted, missionId])],
                });
                recordStep('mission');
              }}
            />
          )}
        </main>

        <nav className="bottom-nav" aria-label="Navigation">
          <button
            type="button"
            className={`nav-item ${view === 'home' ? 'nav-item--active' : ''}`}
            onClick={goHome}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Accueil</span>
          </button>
          <button
            type="button"
            className={`nav-item ${view === 'learn' ? 'nav-item--active' : ''}`}
            onClick={() => openLesson(readingUnit ?? unitNumber, view === 'learn' ? situationId : undefined)}
          >
            <span className="nav-icon">📖</span>
            <span className="nav-label">Leçon</span>
          </button>
          <button
            type="button"
            className={`nav-item ${isSessionStep(view) ? 'nav-item--active' : ''} ${
              progress.completedSteps.length === dailySessionSteps.length ? 'nav-item--done' : ''
            }`}
            onClick={() => openPractice(isSessionStep(view) ? view : continueStep)}
          >
            <span className="nav-icon">✎</span>
            <span className="nav-label">Pratique</span>
          </button>
          <button
            type="button"
            className={`nav-item ${view === 'review' ? 'nav-item--active' : ''}`}
            onClick={() => setView('review')}
          >
            <span className="nav-icon">🔁</span>
            <span className="nav-label">À revoir</span>
            {reviewCount > 0 && <span className="review-badge review-badge--nav">{reviewCount}</span>}
          </button>
        </nav>
      </div>
    </div>
  );
}
