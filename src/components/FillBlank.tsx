import { useMemo, useState } from 'react';
import type { FillBlankExercise, SessionStepId } from '../data/types';
import { FILL_SESSION_SIZE } from '../data/types';
import { sampleSession } from '../lib/exerciseSession';
import { answersMatch } from '../lib/normalize';
import { ResultActions } from './ResultActions';

export type FillResult = {
  score: number;
  missedIds: string[];
  correctIds: string[];
};

type Props = {
  exercises: FillBlankExercise[];
  nextStep: SessionStepId | null;
  onComplete: (result: FillResult) => void;
  onHome: () => void;
  onNext: (id: SessionStepId) => void;
};

export function FillBlank({ exercises, nextStep, onComplete, onHome, onNext }: Props) {
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
  const [reported, setReported] = useState(false);

  const ex = session[index];

  const check = () => {
    if (!ex || feedback) return;
    const ok = answersMatch(input, ex.answer);
    setFeedback(ok ? 'correct' : 'wrong');
    if (ok) setCorrect((n) => n + 1);
    setMissedIds((ids) => (ok ? ids : [...ids, ex.id]));
    setCorrectIds((ids) => (ok ? [...ids, ex.id] : ids));
  };

  const goNext = () => {
    if (!ex || !feedback) return;
    if (index + 1 >= session.length) {
      setFinished(true);
      if (!reported) {
        setReported(true);
        onComplete({
          score: correct,
          missedIds,
          correctIds,
        });
      }
      return;
    }
    setIndex((i) => i + 1);
    setInput('');
    setFeedback(null);
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
        <ResultActions nextStep={nextStep} onHome={onHome} onNext={onNext} />
      </div>
    );
  }

  if (!ex) return null;

  const parts = ex.prompt.split('___');
  const last = index + 1 >= session.length;

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
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            if (feedback) goNext();
            else check();
          }}
          disabled={feedback !== null}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Votre réponse"
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
        onClick={feedback ? goNext : check}
        disabled={!feedback && !input.trim()}
      >
        {feedback ? (last ? 'Voir le résultat' : 'Suivant') : 'Vérifier'}
      </button>
    </div>
  );
}
