import { useMemo, useState } from 'react';
import type { ConjugationExercise } from '../data/types';
import { CONJ_SESSION_SIZE } from '../data/types';
import { sampleSession } from '../lib/exerciseSession';
import { normalizeAnswer } from '../lib/normalize';

export type ConjugationRowResult = {
  id: string;
  pronoun: string;
};

export type ConjugationResult = {
  missed: ConjugationRowResult[];
  correct: ConjugationRowResult[];
};

type Props = {
  exercises: ConjugationExercise[];
  onComplete: (result: ConjugationResult) => void;
};

export function Conjugation({ exercises, onComplete }: Props) {
  const session = useMemo(
    () => sampleSession(exercises, CONJ_SESSION_SIZE),
    [exercises],
  );
  const [verbIndex, setVerbIndex] = useState(0);
  const [rowIndex, setRowIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [finished, setFinished] = useState(false);
  const [missed, setMissed] = useState<ConjugationRowResult[]>([]);
  const [correctRows, setCorrectRows] = useState<ConjugationRowResult[]>([]);

  const exercise = session[verbIndex];
  const row = exercise?.rows[rowIndex];

  const check = () => {
    if (!row || feedback) return;
    const ok = normalizeAnswer(input) === normalizeAnswer(row.answer);
    setFeedback(ok ? 'correct' : 'wrong');
    const entry = { id: exercise.id, pronoun: row.pronoun };
    const nextMissed = ok ? missed : [...missed, entry];
    const nextCorrect = ok ? [...correctRows, entry] : correctRows;
    setMissed(nextMissed);
    setCorrectRows(nextCorrect);

    setTimeout(() => {
      setInput('');
      setFeedback(null);

      if (rowIndex + 1 >= exercise.rows.length) {
        if (verbIndex + 1 >= session.length) {
          setFinished(true);
          onComplete({ missed: nextMissed, correct: nextCorrect });
        } else {
          setVerbIndex((v) => v + 1);
          setRowIndex(0);
        }
      } else {
        setRowIndex((r) => r + 1);
      }
    }, ok ? 600 : 1200);
  };

  if (finished) {
    return (
      <div className="result-screen">
        <div className="result-icon">↻</div>
        <h2>Conjugaison terminée</h2>
        <p>{session.map((e) => e.verb).join(', ')} — présent ✓</p>
        {exercises.length > session.length && (
          <p className="hint">Banque : {exercises.length} verbes — un nouveau set à chaque session</p>
        )}
      </div>
    );
  }

  if (!exercise || !row) return null;

  const totalRows = session.reduce((n, e) => n + e.rows.length, 0);
  const doneRows =
    session.slice(0, verbIndex).reduce((n, e) => n + e.rows.length, 0) + rowIndex;

  return (
    <div className="study-view">
      <div className="conj-header">
        <span className="conj-verb">{exercise.verb}</span>
        <span className="conj-meta">{exercise.tense} · {exercise.english}</span>
      </div>

      <span className="counter">
        {doneRows + 1}/{totalRows}
      </span>

      <div className="conj-layout">
        <div className="conj-drill">
          <div className="conj-prompt">
            <span className="conj-pronoun">{row.pronoun}</span>
            <input
              type="text"
              className={`fill-input conj-input ${feedback === 'correct' ? 'fill-input--ok' : ''} ${feedback === 'wrong' ? 'fill-input--bad' : ''}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && check()}
              disabled={feedback !== null}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="…"
              aria-label="Conjugation"
            />
          </div>

          {feedback === 'wrong' && (
            <p className="feedback feedback--wrong">→ {row.answer}</p>
          )}

          <button
            type="button"
            className="btn btn--primary btn--full"
            onClick={check}
            disabled={!input.trim() || feedback !== null}
          >
            Vérifier
          </button>
        </div>

        <div className="conj-table-preview">
          {exercise.rows.map((r, i) => (
            <div key={r.pronoun} className={`conj-row ${i < rowIndex ? 'conj-row--done' : ''} ${i === rowIndex ? 'conj-row--active' : ''}`}>
              <span>{r.pronoun}</span>
              <span>{i < rowIndex ? r.answer : i === rowIndex && feedback === 'correct' ? r.answer : '…'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
