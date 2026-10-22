import { useMemo, useState } from 'react';
import type { ConjugationExercise, SessionStepId } from '../data/types';
import { CONJ_SESSION_SIZE } from '../data/types';
import { sampleSession, shuffle } from '../lib/exerciseSession';
import { conjugationMatches, verbGroupLabel } from '../lib/conjugation';
import { ConjForm } from './ConjForm';
import { ResultActions } from './ResultActions';

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
  nextStep: SessionStepId | null;
  onComplete: (result: ConjugationResult) => void;
  onHome: () => void;
  onNext: (id: SessionStepId) => void;
};

type Pass = 'chart' | 'shuffle';

export function Conjugation({ exercises, nextStep, onComplete, onHome, onNext }: Props) {
  const session = useMemo(
    () => sampleSession(exercises, CONJ_SESSION_SIZE),
    [exercises],
  );
  const [verbIndex, setVerbIndex] = useState(0);
  const [pass, setPass] = useState<Pass>('chart');
  const [order, setOrder] = useState<number[]>(() => session[0]?.rows.map((_, i) => i) ?? []);
  const [values, setValues] = useState<string[]>(() => session[0]?.rows.map(() => '') ?? []);
  const [results, setResults] = useState<boolean[] | null>(null);
  const [finished, setFinished] = useState(false);
  const [missed, setMissed] = useState<ConjugationRowResult[]>([]);
  const [correctRows, setCorrectRows] = useState<ConjugationRowResult[]>([]);

  const exercise = session[verbIndex];

  const loadVerb = (index: number, nextPass: Pass) => {
    const verb = session[index];
    const idxs = verb.rows.map((_, i) => i);
    setVerbIndex(index);
    setPass(nextPass);
    setOrder(nextPass === 'shuffle' ? shuffle(idxs) : idxs);
    setValues(verb.rows.map(() => ''));
    setResults(null);
  };

  const allFilled = exercise ? exercise.rows.every((_, i) => values[i]?.trim()) : false;

  const check = () => {
    if (!exercise || results || !allFilled) return;
    const next = exercise.rows.map((row, i) =>
      conjugationMatches(values[i] ?? '', row.answer, row.pronoun),
    );
    setResults(next);

    if (pass === 'chart') {
      const extraMissed: ConjugationRowResult[] = [];
      const extraCorrect: ConjugationRowResult[] = [];
      exercise.rows.forEach((row, i) => {
        const entry = { id: exercise.id, pronoun: row.pronoun };
        if (next[i]) extraCorrect.push(entry);
        else extraMissed.push(entry);
      });
      setMissed((m) => [...m, ...extraMissed]);
      setCorrectRows((c) => [...c, ...extraCorrect]);
    }
  };

  const goNext = () => {
    if (!exercise || !results) return;
    const hasWrong = results.some((ok) => !ok);
    if (pass === 'chart' && hasWrong) {
      loadVerb(verbIndex, 'shuffle');
      return;
    }
    if (verbIndex + 1 >= session.length) {
      setFinished(true);
      onComplete({ missed, correct: correctRows });
      return;
    }
    loadVerb(verbIndex + 1, 'chart');
  };

  if (finished) {
    const score = correctRows.length;
    const total = session.reduce((n, e) => n + e.rows.length, 0);
    return (
      <div className="result-screen">
        <div className="result-icon">↻</div>
        <h2>Conjugaison terminée</h2>
        <p>{score}/{total} formes · {session.map((e) => e.verb).join(', ')}</p>
        {exercises.length > session.length && (
          <p className="hint">Banque : {exercises.length} verbes — un nouveau set à chaque session</p>
        )}
        <ResultActions nextStep={nextStep} onHome={onHome} onNext={onNext} />
      </div>
    );
  }

  if (!exercise) return null;

  const hasWrong = results?.some((ok) => !ok) ?? false;
  const correctCount = results?.filter(Boolean).length ?? 0;

  let actionLabel = 'Vérifier';
  if (results) {
    if (pass === 'chart' && hasWrong) actionLabel = 'Continuer — ordre mélangé';
    else if (verbIndex + 1 >= session.length) actionLabel = 'Terminer';
    else actionLabel = 'Verbe suivant';
  }

  return (
    <div className="study-view">
      <div className="conj-header">
        <span className="verb-group-badge verb-group-badge--center">{verbGroupLabel[exercise.group]}</span>
        <span className="conj-verb">{exercise.verb}</span>
        <span className="conj-meta">{exercise.tense} · {exercise.english}</span>
      </div>

      <span className="counter">
        Verbe {verbIndex + 1}/{session.length}
        {pass === 'shuffle' ? ' · mélange' : ''}
      </span>

      {exercise.patternNote && !results && (
        <p className="verb-note verb-note--drill">{exercise.patternNote}</p>
      )}

      {exercise.stem && !results && (
        <p className="verb-legend">
          <span className="conj-stem">radical</span>
          {' · '}
          <span className="conj-ending">terminaison</span>
        </p>
      )}

      <div className="conj-chart" role="group" aria-label={`Conjuguer ${exercise.verb}`}>
        {order.map((rowIdx) => {
          const row = exercise.rows[rowIdx];
          const checked = results?.[rowIdx];
          return (
            <label key={`${pass}-${row.pronoun}`} className={`conj-chart-row ${checked === false ? 'conj-chart-row--bad' : ''} ${checked === true ? 'conj-chart-row--ok' : ''}`}>
              <span className="conj-pr">{row.pronoun}</span>
              {results ? (
                <span className="conj-chart-reveal">
                  {checked ? (
                    <ConjForm form={row.answer} stem={exercise.stem} />
                  ) : (
                    <>
                      <span className="conj-chart-guess">{values[rowIdx] || '—'}</span>
                      <span className="conj-chart-answer">
                        → <ConjForm form={row.answer} stem={exercise.stem} />
                      </span>
                    </>
                  )}
                </span>
              ) : (
                <input
                  type="text"
                  className="fill-input conj-chart-input"
                  autoFocus={rowIdx === order[0]}
                  value={values[rowIdx] ?? ''}
                  onChange={(e) => {
                    const next = [...values];
                    next[rowIdx] = e.target.value;
                    setValues(next);
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;
                    e.preventDefault();
                    if (allFilled) check();
                  }}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  placeholder="…"
                  aria-label={`${row.pronoun} ${exercise.verb}`}
                />
              )}
            </label>
          );
        })}
      </div>

      {results && (
        <p className={`feedback ${hasWrong ? 'feedback--wrong' : 'feedback--correct'}`}>
          {correctCount}/{exercise.rows.length} correct{correctCount > 1 ? 's' : ''}
        </p>
      )}

      <button
        type="button"
        className="btn btn--primary btn--full"
        onClick={results ? goNext : check}
        disabled={!results && !allFilled}
      >
        {actionLabel}
      </button>
    </div>
  );
}
