import { useState } from 'react';
import type { ConjugationExercise } from '../data/types';

type Props = {
  exercises: ConjugationExercise[];
  onComplete: () => void;
};

function normalize(s: string) {
  return s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function Conjugation({ exercises, onComplete }: Props) {
  const [verbIndex, setVerbIndex] = useState(0);
  const [rowIndex, setRowIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [finished, setFinished] = useState(false);

  const exercise = exercises[verbIndex];
  const row = exercise?.rows[rowIndex];

  const check = () => {
    if (!row || feedback) return;
    const ok = normalize(input) === normalize(row.answer);
    setFeedback(ok ? 'correct' : 'wrong');

    setTimeout(() => {
      setInput('');
      setFeedback(null);

      if (rowIndex + 1 >= exercise.rows.length) {
        if (verbIndex + 1 >= exercises.length) {
          setFinished(true);
          onComplete();
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
        <p>{exercises.map((e) => e.verb).join(', ')} — présent ✓</p>
      </div>
    );
  }

  if (!exercise || !row) return null;

  const totalRows = exercises.reduce((n, e) => n + e.rows.length, 0);
  const doneRows =
    exercises.slice(0, verbIndex).reduce((n, e) => n + e.rows.length, 0) + rowIndex;

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
