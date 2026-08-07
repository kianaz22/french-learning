import { dailySessionSteps, unit1Meta } from '../data/unit1';
import type { ProgressState } from '../types/progress';
import type { SessionStepId } from '../data/unit1';

type Props = {
  progress: ProgressState;
  todayComplete: boolean;
  onSelectStep: (id: SessionStepId) => void;
  onReset: () => void;
};

export function Home({ progress, todayComplete, onSelectStep, onReset }: Props) {
  const completed = progress.completedSteps.length;
  const total = dailySessionSteps.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <div className="home">
      {todayComplete && (
        <div className="banner banner--success">
          Bravo ! Session du jour terminée 🎉
        </div>
      )}

      <section className="card hero-card">
        <p className="eyebrow">L&apos;Atelier Companion</p>
        <h2 className="hero-title">Unité {unit1Meta.number} — {unit1Meta.title}</h2>
        <p className="hero-sub">
          ~15 min de pratique pour consolider la leçon entre deux cours.
        </p>
        <div className="progress-bar-wrap">
          <div className="progress-bar" style={{ width: `${pct}%` }} />
        </div>
        <p className="progress-label">
          {completed}/{total} activités · {pct}%
        </p>
      </section>

      <section className="card">
        <h3 className="section-title">Objectifs</h3>
        <ul className="objectives">
          {unit1Meta.objectives.map((obj) => (
            <li key={obj}>{obj}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="section-title">Session du jour</h3>
        <div className="step-list">
          {dailySessionSteps.map((step, i) => {
            const done = progress.completedSteps.includes(step.id);
            return (
              <button
                key={step.id}
                type="button"
                className={`step-card ${done ? 'step-card--done' : ''}`}
                onClick={() => onSelectStep(step.id)}
              >
                <span className="step-num">{done ? '✓' : i + 1}</span>
                <div className="step-body">
                  <span className="step-name">{step.label}</span>
                  <span className="step-desc">{step.description}</span>
                </div>
                <span className="step-time">{step.duration}</span>
              </button>
            );
          })}
        </div>
      </section>

      <button type="button" className="text-btn" onClick={onReset}>
        Réinitialiser la progression
      </button>
    </div>
  );
}
