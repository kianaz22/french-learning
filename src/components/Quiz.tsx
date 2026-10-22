import { useMemo, useState } from 'react';
import type { MultipleChoiceExercise, SessionStepId } from '../data/types';
import { QUIZ_SESSION_SIZE } from '../data/types';
import { sampleSession } from '../lib/exerciseSession';
import { ResultActions } from './ResultActions';

export type QuizResult = {
  score: number;
  missedIds: string[];
  correctIds: string[];
};

type Props = {
  questions: MultipleChoiceExercise[];
  nextStep: SessionStepId | null;
  onComplete: (result: QuizResult) => void;
  onHome: () => void;
  onNext: (id: SessionStepId) => void;
};

export function Quiz({ questions, nextStep, onComplete, onHome, onNext }: Props) {
  const session = useMemo(
    () => sampleSession(questions, QUIZ_SESSION_SIZE),
    [questions],
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [missedIds, setMissedIds] = useState<string[]>([]);
  const [correctIds, setCorrectIds] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [reported, setReported] = useState(false);

  const q = session[index];

  const choose = (optionIndex: number) => {
    if (selected !== null || !q) return;
    setSelected(optionIndex);
    const isCorrect = optionIndex === q.correctIndex;
    if (isCorrect) setCorrect((n) => n + 1);
    setMissedIds((ids) => (isCorrect ? ids : [...ids, q.id]));
    setCorrectIds((ids) => (isCorrect ? [...ids, q.id] : ids));
  };

  const goNext = () => {
    if (selected === null || !q) return;
    if (index + 1 >= session.length) {
      const score = correct;
      const missed = missedIds;
      const okIds = correctIds;
      setFinished(true);
      if (!reported) {
        setReported(true);
        onComplete({ score, missedIds: missed, correctIds: okIds });
      }
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  if (finished) {
    const pct = Math.round((correct / session.length) * 100);
    return (
      <div className="result-screen">
        <div className="result-icon">{pct >= 70 ? '🌟' : '📚'}</div>
        <h2>Quiz terminé</h2>
        <p>
          {correct}/{session.length} correct ({pct}%)
        </p>
        {questions.length > session.length && (
          <p className="hint">Banque : {questions.length} questions — un nouveau set à chaque session</p>
        )}
        <ResultActions nextStep={nextStep} onHome={onHome} onNext={onNext} />
      </div>
    );
  }

  if (!q) return null;

  const last = index + 1 >= session.length;

  return (
    <div className="study-view">
      <div className="session-meta">
        <span className="counter">
          {index + 1}/{session.length}
        </span>
        {questions.length > session.length && (
          <span className="session-pool">banque de {questions.length}</span>
        )}
      </div>

      <div className="progress-dots">
        {session.map((item, i) => (
          <span
            key={item.id}
            className={`dot ${i < index ? 'dot--done' : ''} ${i === index ? 'dot--active' : ''}`}
          />
        ))}
      </div>

      <p className="question">{q.question}</p>

      <div className="options">
        {q.options.map((opt, i) => {
          let cls = 'option-btn';
          if (selected !== null) {
            if (i === q.correctIndex) cls += ' option-btn--correct';
            else if (i === selected) cls += ' option-btn--wrong';
          }
          return (
            <button
              key={`${q.id}-${i}`}
              type="button"
              className={cls}
              onClick={() => choose(i)}
              disabled={selected !== null}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && q.explanation && (
        <p className="explanation">{q.explanation}</p>
      )}

      {selected !== null && (
        <button type="button" className="btn btn--primary btn--full" onClick={goNext}>
          {last ? 'Voir le résultat' : 'Suivant'}
        </button>
      )}
    </div>
  );
}
