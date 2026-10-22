import { dailySessionSteps, type UnitContent, type SessionStepId } from '../data/types';
import { liveReviewItems } from '../lib/reviewList';
import type { CourseState, CourseStatus } from '../lib/course';
import { statusLabel } from '../lib/course';
import { nextSessionStep, stepLabel } from '../lib/session';
import type { ProgressState } from '../types/progress';

type Props = {
  unit: UnitContent;
  units: UnitContent[];
  course: CourseState;
  progress: ProgressState;
  todayComplete: boolean;
  onSetStatus: (unitNumber: number, status: CourseStatus) => void;
  onOpenLesson: (unitNumber: number, situationId?: string) => void;
  onOpenReview: () => void;
  onSelectStep: (id: SessionStepId) => void;
  onReset: () => void;
};

const statuses: CourseStatus[] = ['upcoming', 'current', 'done'];

export function Home({
  unit,
  units,
  course,
  progress,
  todayComplete,
  onSetStatus,
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
  const situations = unit.lesson.situations ?? [];
  const next = nextSessionStep(progress.completedSteps);

  return (
    <div className="home">
      {todayComplete && (
        <div className="banner banner--success">
          Bravo ! Session du jour terminée 🎉
        </div>
      )}

      <section className="card hero-card">
        <p className="eyebrow">Pratique</p>
        <p className="hero-week-label">Tu révises l’unité {meta.number}</p>
        <h2 className="hero-title">{meta.title}</h2>
        <p className="hero-sub">
          Ouvre une autre leçon sans changer la pratique. Marque une unité Terminé pour y
          entraîner.
        </p>
        <div className="progress-bar-wrap">
          <div className="progress-bar" style={{ width: `${pct}%` }} />
        </div>
        <p className="progress-label">
          {completed}/{total} activités aujourd’hui · {pct}%
        </p>
        {next ? (
          <button type="button" className="btn btn--hero btn--full" onClick={() => onSelectStep(next)}>
            Continuer · {stepLabel(next)}
          </button>
        ) : (
          <button type="button" className="btn btn--hero btn--full" onClick={onOpenReview}>
            Session finie · à revoir
          </button>
        )}
      </section>

      <section className="session-section">
        <h3 className="section-title">Session — Unité {meta.number}</h3>
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

      <section>
        <h3 className="section-title">À revoir</h3>
        <button
          type="button"
          className={`unit-lesson-card review-home-card ${reviewCount > 0 ? 'review-home-card--active' : ''}`}
          onClick={onOpenReview}
        >
          <span className="unit-lesson-top">
            <span className="unit-lesson-badge">Unité {meta.number}</span>
            {reviewCount > 0 && <span className="review-badge">{reviewCount}</span>}
            <span className="lesson-topic-arrow" aria-hidden="true">→</span>
          </span>
          <span className="unit-lesson-title">Erreurs de la semaine</span>
          <span className="unit-lesson-meta">
            {reviewCount === 0
              ? 'Rien en attente — les fautes de pratique s’accumulent ici'
              : `${reviewCount} élément${reviewCount > 1 ? 's' : ''} à retravailler`}
          </span>
        </button>
      </section>

      <section className="lessons-section">
        <h3 className="section-title">Tableau</h3>
        <div className="unit-lesson-grid">
          {units.map((u) => {
            const status: CourseStatus = course.statuses[u.meta.number] ?? 'upcoming';
            const practicing = u.meta.number === meta.number;
            return (
              <div
                key={u.meta.number}
                className={`unit-lesson-card unit-lesson-card--${status} ${practicing ? 'unit-lesson-card--current' : ''}`}
              >
                <span className="unit-lesson-top">
                  <span className="unit-lesson-badge">Unité {u.meta.number}</span>
                  <label className="unit-status-label">
                    <span className="visually-hidden">Statut de l’unité {u.meta.number}</span>
                    <select
                      className={`unit-status unit-status--${status}`}
                      value={status}
                      onChange={(e) => onSetStatus(u.meta.number, e.target.value as CourseStatus)}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {statusLabel[s]}
                        </option>
                      ))}
                    </select>
                  </label>
                </span>
                <button
                  type="button"
                  className="unit-lesson-open"
                  onClick={() => onOpenLesson(u.meta.number)}
                >
                  <span className="unit-lesson-title">{u.meta.title}</span>
                  <span className="unit-lesson-meta">
                    {practicing
                      ? 'Unité en pratique · ouvrir le mémo'
                      : u.lesson.situations
                        ? `${u.lesson.situations.length} situations · mémo seulement`
                        : 'Mémo de l’unité'}
                  </span>
                  <span className="lesson-topic-arrow" aria-hidden="true">→</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {situations.length > 0 && (
        <section className="week-situations">
          <h3 className="section-title">Mémo — Unité {meta.number}</h3>
          <div className="situation-grid">
            {situations.map((sit) => (
              <button
                key={sit.id}
                type="button"
                className="situation-card"
                onClick={() => onOpenLesson(meta.number, sit.id)}
              >
                <span className="situation-num">Situation {sit.number}</span>
                <span className="situation-title">{sit.title}</span>
                <span className="situation-goal">{sit.goal}</span>
              </button>
            ))}
          </div>
          <p className="week-situations-hint">La leçon remplace le livre — une situation à la fois.</p>
        </section>
      )}

      <button
        type="button"
        className="text-btn"
        onClick={() => {
          if (
            window.confirm(
              `Réinitialiser la progression de l’unité ${meta.number} ? Les erreurs à revoir de cette unité seront effacées.`,
            )
          ) {
            onReset();
          }
        }}
      >
        Réinitialiser la progression
      </button>
    </div>
  );
}
