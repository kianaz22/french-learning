import { dailySessionSteps, type UnitContent, type SessionStepId } from '../data/types';
import { liveReviewItems } from '../lib/reviewList';
import type { ProgressState } from '../types/progress';
import { UnitPicker } from './UnitPicker';

type Props = {
  unit: UnitContent;
  units: UnitContent[];
  progress: ProgressState;
  todayComplete: boolean;
  onSelectUnit: (unitNumber: number) => void;
  onOpenLesson: () => void;
  onOpenReview: () => void;
  onSelectStep: (id: SessionStepId) => void;
  onReset: () => void;
};

export function Home({
  unit,
  units,
  progress,
  todayComplete,
  onSelectUnit,
  onOpenLesson,
  onOpenReview,
  onSelectStep,
  onReset,
}: Props) {
  const { meta } = unit;
  const completed = progress.completedSteps.length;
  const total = dailySessionSteps.length;
  const pct = Math.round((completed / total) * 100);
  const reviewCount = liveReviewItems(unit, progress.reviewItems ?? []).length;

  return (
    <div className="home">
      {todayComplete && (
        <div className="banner banner--success">
          Bravo ! Session du jour terminée 🎉
        </div>
      )}

      <UnitPicker units={units} currentUnit={meta.number} onSelect={onSelectUnit} />

      <section className="card hero-card">
        <p className="eyebrow">L&apos;Atelier Companion</p>
        <h2 className="hero-title">Unité {meta.number} — {meta.title}</h2>
        <p className="hero-sub">
          ~30 min de pratique — leçons détaillées et grandes banques d'exercices.
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
          {meta.objectives.map((obj) => (
            <li key={obj}>{obj}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="section-title">Apprendre</h3>
        <div className="learn-stack">
        <button type="button" className="learn-card card" onClick={onOpenLesson}>
          <span className="learn-icon">📖</span>
          <div className="learn-body">
            <span className="learn-name">Leçon — Unité {meta.number}</span>
            <span className="learn-desc">
              Grammaire détaillée, vocabulaire, verbes, phrases et dialogue
            </span>
          </div>
          <span className="learn-arrow">→</span>
        </button>
        <button
          type="button"
          className={`learn-card card review-home-card ${reviewCount > 0 ? 'review-home-card--active' : ''}`}
          onClick={onOpenReview}
        >
          <span className="learn-icon">🔁</span>
          <div className="learn-body">
            <span className="learn-name">À revoir</span>
            <span className="learn-desc">
              {reviewCount === 0
                ? 'Les erreurs de pratique s’accumulent ici'
                : `${reviewCount} élément${reviewCount > 1 ? 's' : ''} à retravailler`}
            </span>
          </div>
          {reviewCount > 0 && <span className="review-badge">{reviewCount}</span>}
          <span className="learn-arrow">→</span>
        </button>
        </div>
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
