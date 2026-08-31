import { useState } from 'react';
import type { MissionPrompt } from '../data/types';

type Props = {
  prompts: MissionPrompt[];
  completedIds: string[];
  onComplete: (missionId: string) => void;
};

export function Mission({ prompts, completedIds, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const mission = prompts[index];

  const submit = () => {
    if (!text.trim() || !mission) return;
    setSubmitted(true);
    onComplete(mission.id);
  };

  const next = () => {
    if (index + 1 < prompts.length) {
      setIndex((i) => i + 1);
      setText('');
      setSubmitted(false);
    }
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
            onClick={() => {
              setIndex(i);
              setText('');
              setSubmitted(false);
            }}
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
              Terminer la mission
            </button>
          ) : (
            <div className="mission-done">
              <p className="feedback feedback--correct">Mission enregistrée — bravo !</p>
              {index + 1 < prompts.length && (
                <button type="button" className="btn btn--secondary btn--full" onClick={next}>
                  Mission suivante →
                </button>
              )}
            </div>
          )}

          <p className="hint">
            Pas de correction automatique — relisez avec la checklist ou montrez à votre professeur(e).
          </p>
        </div>

        <aside className="mission-sidebar">
          <details className="example-box">
            <summary>Exemple</summary>
            <p>{mission.example}</p>
          </details>

          <h3 className="section-title">Checklist</h3>
          <ul className="checklist">
            {mission.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
