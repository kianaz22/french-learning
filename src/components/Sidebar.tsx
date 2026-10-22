import { dailySessionSteps, type UnitContent, type SessionStepId } from '../data/types';
import type { ProgressState, SyncStatus } from '../types/progress';

const stepIcons: Record<SessionStepId, string> = {
  flashcards: '🃏',
  quiz: '✓',
  fill: '✎',
  conjugate: '↻',
  mission: '🎯',
};

type AppView = 'home' | 'learn' | 'review' | SessionStepId;

type Props = {
  unit: UnitContent;
  view: AppView;
  progress: ProgressState;
  reviewCount?: number;
  syncStatus?: SyncStatus;
  onNavigate: (view: AppView) => void;
};

export function Sidebar({ unit, view, progress, reviewCount = 0, syncStatus, onNavigate }: Props) {
  const { meta } = unit;
  const completed = progress.completedSteps.length;
  const total = dailySessionSteps.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <aside className="sidebar" aria-label="Navigation">
      <div className="sidebar-brand">
        <span className="sidebar-logo">A1</span>
        <div>
          <p className="sidebar-app">L&apos;Atelier Companion</p>
          <p className="sidebar-unit">Unité {meta.number} — {meta.title}</p>
        </div>
      </div>

      <div className="sidebar-progress">
        <div className="sidebar-progress-bar">
          <div className="sidebar-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="sidebar-progress-label">
          {completed}/{total} activités · {pct}%
          {progress.streak > 0 && ` · 🔥 ${progress.streak}`}
          {syncStatus === 'syncing' && ' · sync…'}
          {syncStatus === 'synced' && ' · ☁ sync'}
          {syncStatus === 'offline' && ' · hors ligne'}
          {syncStatus === 'error' && ' · sync échoué'}
        </p>
      </div>

      <nav className="sidebar-nav">
        <button
          type="button"
          className={`sidebar-link ${view === 'home' ? 'sidebar-link--active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          <span className="sidebar-link-icon">🏠</span>
          <span>Accueil</span>
        </button>

        <button
          type="button"
          className={`sidebar-link ${view === 'learn' ? 'sidebar-link--active' : ''}`}
          onClick={() => onNavigate('learn')}
        >
          <span className="sidebar-link-icon">📖</span>
          <span className="sidebar-link-text">
            <span className="sidebar-link-name">Leçon</span>
            <span className="sidebar-link-desc">Grammaire & vocabulaire</span>
          </span>
        </button>

        <button
          type="button"
          className={`sidebar-link ${view === 'review' ? 'sidebar-link--active' : ''}`}
          onClick={() => onNavigate('review')}
        >
          <span className="sidebar-link-icon">🔁</span>
          <span className="sidebar-link-text">
            <span className="sidebar-link-name">À revoir</span>
            <span className="sidebar-link-desc">
              {reviewCount === 0 ? 'Aucune erreur en attente' : `${reviewCount} à retravailler`}
            </span>
          </span>
          {reviewCount > 0 && <span className="review-badge review-badge--sidebar">{reviewCount}</span>}
        </button>

        <p className="sidebar-nav-label">Session du jour</p>

        {dailySessionSteps.map((step) => {
          const done = progress.completedSteps.includes(step.id);
          const active = view === step.id;
          return (
            <button
              key={step.id}
              type="button"
              className={`sidebar-link ${active ? 'sidebar-link--active' : ''} ${done ? 'sidebar-link--done' : ''}`}
              onClick={() => onNavigate(step.id)}
            >
              <span className="sidebar-link-icon">{stepIcons[step.id]}</span>
              <span className="sidebar-link-text">
                <span className="sidebar-link-name">{step.label}</span>
                <span className="sidebar-link-desc">{step.description}</span>
              </span>
              {done && <span className="sidebar-check">✓</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export { stepIcons };
