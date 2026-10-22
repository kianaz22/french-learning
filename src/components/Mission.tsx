import { useState } from 'react';
import type { MissionPrompt, SessionStepId } from '../data/types';
import { ResultActions } from './ResultActions';

type Props = {
  prompts: MissionPrompt[];
  completedIds: string[];
  nextStep: SessionStepId | null;
  onComplete: (missionId: string) => void;
  onHome: () => void;
  onNext: (id: SessionStepId) => void;
};

export function Mission({ prompts, completedIds, nextStep, onComplete, onHome, onNext }: Props) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(() => completedIds.includes(prompts[0]?.id ?? ''));
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const mission = prompts[index];

  const open = (i: number) => {
    const next = prompts[i];
    setIndex(i);
    setText('');
    setSubmitted(completedIds.includes(next?.id ?? ''));
  };

  const submit = () => {
    if (!text.trim() || !mission) return;
    setSubmitted(true);
    onComplete(mission.id);
  };

  if (!mission) return null;

  return (
    <div className="study-view">
      <div className="mission-tabs">
        {prompts.map((m, i) => (
          <button
            key={m.id}
            type="button"
            className={`mission-tab ${i === index ? 'mission-tab--active' : ''} ${completedIds.includes(m.id) ? 'mission-tab--done' : ''}`}
            onClick={() => open(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="mission-layout">
        <div className="mission-main">
          <h2 className="mission-title">{mission.title}</h2>
          <p className="mission-instruction">{mission.instruction}</p>

          <textarea
            className="mission-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Écrivez en français…"
            rows={5}
            disabled={submitted}
          />

          {!submitted ? (
            <button
              type="button"
              className="btn btn--primary btn--full"
              onClick={submit}
              disabled={text.trim().length < 10}
            >
              Enregistrer la mission
            </button>
          ) : (
            <div className="mission-done">
              <p className="feedback feedback--correct">Mission enregistrée — bravo !</p>
              {index + 1 < prompts.length && (
                <button type="button" className="btn btn--secondary btn--full" onClick={() => open(index + 1)}>
                  Mission suivante →
                </button>
              )}
              <ResultActions nextStep={nextStep} onHome={onHome} onNext={onNext} />
            </div>
          )}

          <p className="hint">
            Pas de correction automatique — cochez la checklist ou montrez à votre professeur(e).
          </p>
        </div>

        <aside className="mission-sidebar">
          <details className="example-box">
            <summary>Exemple</summary>
            <p>{mission.example}</p>
          </details>

          <h3 className="section-title">Checklist</h3>
          <ul className="checklist">
            {mission.checklist.map((item) => {
              const key = `${mission.id}:${item}`;
              const on = Boolean(checked[key]);
              return (
                <li key={item}>
                  <button
                    type="button"
                    className={`checklist-btn ${on ? 'checklist-btn--on' : ''}`}
                    onClick={() => setChecked((prev) => ({ ...prev, [key]: !on }))}
                    aria-pressed={on}
                  >
                    <span aria-hidden="true">{on ? '✓' : '○'}</span>
                    {item}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
