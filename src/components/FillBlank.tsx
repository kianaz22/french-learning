import { useMemo, useState } from 'react';
import type { FillBlankExercise } from '../data/types';
import { FILL_SESSION_SIZE } from '../data/types';
import { sampleSession } from '../lib/exerciseSession';
import { normalizeAnswer } from '../lib/normalize';

export type FillResult = {
  score: number;
  missedIds: string[];
  correctIds: string[];
};

type Props = {
  exercises: FillBlankExercise[];
  onComplete: (result: FillResult) => void;
};

export function FillBlank({ exercises, onComplete }: Props) {
  const session = useMemo(
    () => sampleSession(exercises, FILL_SESSION_SIZE),
    [exercises],
  );
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [correct, setCorrect] = useState(0);
  const [missedIds, setMissedIds] = useState<string[]>([]);
  const [correctIds, setCorrectIds] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const ex = session[index];

  const check = () => {
    if (!ex || feedback) return;
    const ok = normalizeAnswer(input) === normalizeAnswer(ex.answer);
    setFeedback(ok ? 'correct' : 'wrong');
    const newCorrect = ok ? correct + 1 : correct;
    const nextMissed = ok ? missedIds : [...missedIds, ex.id];
    const nextCorrectIds = ok ? [...correctIds, ex.id] : correctIds;
    if (ok) setCorrect(newCorrect);
    setMissedIds(nextMissed);
    setCorrectIds(nextCorrectIds);

    setTimeout(() => {
      if (index + 1 >= session.length) {
        setFinished(true);
        onComplete({ score: newCorrect, missedIds: nextMissed, correctIds: nextCorrectIds });
      } else {
        setIndex((i) => i + 1);
        setInput('');
        setFeedback(null);
      }
    }, 1000);
  };

  if (finished) {
    return (
      <div className="result-screen">
        <div className="result-icon">✎</div>
        <h2>Phrases terminées</h2>
        <p>
          {correct}/{session.length} correct
        </p>
        {exercises.length > session.length && (
          <p className="hint">Banque : {exercises.length} phrases — un nouveau set à chaque session</p>
        )}
      </div>
    );
  }

  if (!ex) return null;

  const parts = ex.prompt.split('___');

  return (
    <div className="study-view">
      <div className="session-meta">
        <span className="counter">
          {index + 1}/{session.length}
        </span>
        {exercises.length > session.length && (
          <span className="session-pool">banque de {exercises.length}</span>
        )}
      </div>

      <div className="fill-prompt">
        {parts[0]}
        <input
          type="text"
          className={`fill-input ${feedback === 'correct' ? 'fill-input--ok' : ''} ${feedback === 'wrong' ? 'fill-input--bad' : ''}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && check()}
          disabled={feedback !== null}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Your answer"
        />
        {parts[1] ?? ''}
      </div>

      {ex.hint && !feedback && <p className="hint">Indice : {ex.hint}</p>}

      {feedback === 'wrong' && (
        <p className="feedback feedback--wrong">Réponse : {ex.answer}</p>
      )}
      {feedback === 'correct' && <p className="feedback feedback--correct">Correct !</p>}

      <button
        type="button"
        className="btn btn--primary btn--full"
        onClick={check}
        disabled={!input.trim() || feedback !== null}
      >
        Vérifier
      </button>
    </div>
  );
}
