import { dailySessionSteps, unit1Meta } from '../data/unit1';
import type { ProgressState, SyncStatus } from '../types/progress';
import type { SessionStepId } from '../data/unit1';

const stepIcons: Record<SessionStepId, string> = {
  flashcards: '🃏',
  quiz: '✓',
  fill: '✎',
  conjugate: '↻',
  mission: '🎯',
};

type Props = {
  view: 'home' | SessionStepId;
  progress: ProgressState;
  syncStatus?: SyncStatus;
  onNavigate: (view: 'home' | SessionStepId) => void;
};

export function Sidebar({ view, progress, syncStatus, onNavigate }: Props) {
  const completed = progress.completedSteps.length;
  const total = dailySessionSteps.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <aside className="sidebar" aria-label="Navigation">
      <div className="sidebar-brand">
        <span className="sidebar-logo">A1</span>
        <div>
          <p className="sidebar-app">L&apos;Atelier Companion</p>
          <p className="sidebar-unit">Unité {unit1Meta.number} — {unit1Meta.title}</p>
        </div>
      </div>

      <div className="sidebar-progress">
        <div className="sidebar-progress-bar">
          <div className="sidebar-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="sidebar-progress-label">
          {completed}/{total} activités · {pct}%
          {progress.streak > 0 && ` · 🔥 ${progress.streak}`}
          {syncStatus === 'synced' && ' · ☁ synced'}
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
