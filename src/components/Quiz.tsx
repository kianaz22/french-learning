import { useMemo, useState } from 'react';
import type { MultipleChoiceExercise } from '../data/types';
import { QUIZ_SESSION_SIZE } from '../data/types';
import { sampleSession } from '../lib/exerciseSession';

export type QuizResult = {
  score: number;
  missedIds: string[];
  correctIds: string[];
};

type Props = {
  questions: MultipleChoiceExercise[];
  onComplete: (result: QuizResult) => void;
};

export function Quiz({ questions, onComplete }: Props) {
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

  const q = session[index];

  const choose = (optionIndex: number) => {
    if (selected !== null || !q) return;
    setSelected(optionIndex);
    const isCorrect = optionIndex === q.correctIndex;
    const newCorrect = isCorrect ? correct + 1 : correct;
    const nextMissed = isCorrect ? missedIds : [...missedIds, q.id];
    const nextCorrectIds = isCorrect ? [...correctIds, q.id] : correctIds;
    if (isCorrect) setCorrect(newCorrect);
    setMissedIds(nextMissed);
    setCorrectIds(nextCorrectIds);

    setTimeout(() => {
      if (index + 1 >= session.length) {
        setFinished(true);
        onComplete({ score: newCorrect, missedIds: nextMissed, correctIds: nextCorrectIds });
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
      }
    }, 1200);
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
      </div>
    );
  }

  if (!q) return null;

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
              key={opt}
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
    </div>
  );
}
