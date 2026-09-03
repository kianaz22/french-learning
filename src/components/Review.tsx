import { useMemo, useState } from 'react';
import type { UnitContent } from '../data/types';
import { normalizeAnswer } from '../lib/normalize';
import { shuffle } from '../lib/exerciseSession';
import {
  liveReviewItems,
  resolveReviewPreview,
  reviewKindLabel,
  reviewKey,
} from '../lib/reviewList';
import type { ReviewItem, ReviewKind } from '../types/progress';

const ROUND_SIZE = 20;

type Filter = 'all' | ReviewKind;

type PracticeItem =
  | { kind: 'quiz'; review: ReviewItem; question: UnitContent['multipleChoice'][number] }
  | { kind: 'fill'; review: ReviewItem; exercise: UnitContent['fillBlank'][number] }
  | { kind: 'flashcard'; review: ReviewItem; card: UnitContent['flashcards'][number] }
  | {
      kind: 'conjugate';
      review: ReviewItem;
      verb: UnitContent['conjugationExercises'][number];
      row: UnitContent['conjugationExercises'][number]['rows'][number];
    };

type Props = {
  unit: UnitContent;
  items: ReviewItem[];
  onRecord: (missed: ReviewItem[], correct: ReviewItem[]) => void;
};

function resolvePractice(unit: UnitContent, item: ReviewItem): PracticeItem | null {
  if (item.kind === 'quiz') {
    const question = unit.multipleChoice.find((q) => q.id === item.id);
    return question ? { kind: 'quiz', review: item, question } : null;
  }
  if (item.kind === 'fill') {
    const exercise = unit.fillBlank.find((q) => q.id === item.id);
    return exercise ? { kind: 'fill', review: item, exercise } : null;
  }
  if (item.kind === 'flashcard') {
    const card = unit.flashcards.find((c) => c.id === item.id);
    return card ? { kind: 'flashcard', review: item, card } : null;
  }
  const verb = unit.conjugationExercises.find((v) => v.id === item.id);
  const row = verb?.rows.find((r) => r.pronoun === item.pronoun);
  if (!verb || !row) return null;
  return { kind: 'conjugate', review: item, verb, row };
}

export function Review({ unit, items, onRecord }: Props) {
  const live = useMemo(() => liveReviewItems(unit, items), [unit, items]);
  const [filter, setFilter] = useState<Filter>('all');
  const [queue, setQueue] = useState<PracticeItem[] | null>(null);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [kept, setKept] = useState(0);
  const [cleared, setCleared] = useState(0);

  const visible = filter === 'all' ? live : live.filter((i) => i.kind === filter);
  const counts = {
    quiz: live.filter((i) => i.kind === 'quiz').length,
    fill: live.filter((i) => i.kind === 'fill').length,
    flashcard: live.filter((i) => i.kind === 'flashcard').length,
    conjugate: live.filter((i) => i.kind === 'conjugate').length,
  };

  const start = (pool: ReviewItem[]) => {
    const resolved = shuffle(pool)
      .map((item) => resolvePractice(unit, item))
      .filter((item): item is PracticeItem => item !== null)
      .slice(0, ROUND_SIZE);
    if (resolved.length === 0) return;
    setQueue(resolved);
    setIndex(0);
    setDone(false);
    setKept(0);
    setCleared(0);
  };

  const finishItem = (correct: boolean) => {
    if (!queue) return;
    const current = queue[index];
    if (correct) {
      onRecord([], [current.review]);
      setCleared((n) => n + 1);
    } else {
      onRecord([current.review], []);
      setKept((n) => n + 1);
    }

    if (index + 1 >= queue.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  if (queue && done) {
    return (
      <div className="result-screen">
        <div className="result-icon">🔁</div>
        <h2>Révision terminée</h2>
        <p>
          {cleared} retiré{cleared === 1 ? '' : 's'} · {kept} encore à revoir
        </p>
        <button
          type="button"
          className="btn btn--primary btn--full"
          onClick={() => setQueue(null)}
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  if (queue) {
    const current = queue[index];
    return (
      <div className="study-view">
        <div className="session-meta">
          <span className="counter">
            {index + 1}/{queue.length}
          </span>
          <span className="session-pool">{reviewKindLabel[current.kind]}</span>
        </div>
        <PracticeCard
          key={reviewKey(current.review)}
          item={current}
          onResult={finishItem}
        />
      </div>
    );
  }

  return (
    <div className="review">
      <header className="review-hero card">
        <p className="eyebrow">À revoir</p>
        <h2 className="review-title">
          {live.length === 0
            ? 'Rien à revoir pour le moment'
            : `${live.length} élément${live.length > 1 ? 's' : ''} à retravailler`}
        </h2>
        <p className="review-lead">
          Les erreurs de quiz, phrases, cartes et verbes s’accumulent ici. Une bonne réponse les
          retire de la liste.
        </p>
        {live.length > 0 && (
          <button type="button" className="btn btn--primary btn--full" onClick={() => start(visible)}>
            {filter === 'all' ? 'Réviser tout' : `Réviser · ${reviewKindLabel[filter]}`}
          </button>
        )}
      </header>

      <div className="review-filters" role="tablist" aria-label="Filtrer la liste">
        {(['all', 'quiz', 'fill', 'flashcard', 'conjugate'] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={filter === id}
            className={`review-filter ${filter === id ? 'review-filter--active' : ''}`}
            onClick={() => setFilter(id)}
          >
            {id === 'all' ? 'Tout' : reviewKindLabel[id]}
            <span className="review-filter-count">
              {id === 'all' ? live.length : counts[id]}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="hint review-empty">
          {live.length === 0
            ? 'Faites un quiz, des phrases ou des cartes — les réponses fausses apparaîtront ici.'
            : 'Aucun élément dans ce filtre.'}
        </p>
      ) : (
        <ul className="review-list">
          {visible.map((item) => (
            <li key={reviewKey(item)} className="review-row card">
              <div className="review-row-body">
                <span className="review-row-kind">{reviewKindLabel[item.kind]}</span>
                <p className="review-row-text">{resolveReviewPreview(unit, item)}</p>
              </div>
              <div className="review-row-actions">
                <button
                  type="button"
                  className="text-btn"
                  onClick={() => onRecord([], [item])}
                >
                  Je sais
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => start([item])}
                >
                  Réviser
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PracticeCard({
  item,
  onResult,
}: {
  item: PracticeItem;
  onResult: (correct: boolean) => void;
}) {
  if (item.kind === 'quiz') {
    return <QuizPractice question={item.question} onResult={onResult} />;
  }
  if (item.kind === 'fill') {
    return <FillPractice exercise={item.exercise} onResult={onResult} />;
  }
  if (item.kind === 'flashcard') {
    return <CardPractice card={item.card} onResult={onResult} />;
  }
  return <ConjPractice verb={item.verb} row={item.row} onResult={onResult} />;
}

function QuizPractice({
  question,
  onResult,
}: {
  question: UnitContent['multipleChoice'][number];
  onResult: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const ok = i === question.correctIndex;
    setTimeout(() => onResult(ok), 1100);
  };

  return (
    <>
      <p className="question">{question.question}</p>
      <div className="options">
        {question.options.map((opt, i) => {
          let cls = 'option-btn';
          if (selected !== null) {
            if (i === question.correctIndex) cls += ' option-btn--correct';
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
      {selected !== null && question.explanation && (
        <p className="explanation">{question.explanation}</p>
      )}
    </>
  );
}

function FillPractice({
  exercise,
  onResult,
}: {
  exercise: UnitContent['fillBlank'][number];
  onResult: (correct: boolean) => void;
}) {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const parts = exercise.prompt.split('___');

  const check = () => {
    if (feedback) return;
    const ok = normalizeAnswer(input) === normalizeAnswer(exercise.answer);
    setFeedback(ok ? 'correct' : 'wrong');
    setTimeout(() => onResult(ok), ok ? 700 : 1200);
  };

  return (
    <>
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
      {exercise.hint && !feedback && <p className="hint">Indice : {exercise.hint}</p>}
      {feedback === 'wrong' && (
        <p className="feedback feedback--wrong">Réponse : {exercise.answer}</p>
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
    </>
  );
}

function CardPractice({
  card,
  onResult,
}: {
  card: UnitContent['flashcards'][number];
  onResult: (correct: boolean) => void;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`flashcard ${flipped ? 'flashcard--flipped' : ''}`}
        onClick={() => setFlipped((f) => !f)}
        aria-label="Flip card"
      >
        <div className="flashcard-inner">
          <div className="flashcard-face flashcard-front">
            <span className="flashcard-cat">{card.category}</span>
            <p className="flashcard-text">{card.french}</p>
            <span className="flashcard-tap">Toucher pour retourner</span>
          </div>
          <div className="flashcard-face flashcard-back">
            <p className="flashcard-text">{card.english}</p>
            {card.hint && <p className="flashcard-hint">{card.hint}</p>}
          </div>
        </div>
      </button>
      {flipped && (
        <div className="rating-row">
          <button type="button" className="btn btn--secondary" onClick={() => onResult(false)}>
            Encore
          </button>
          <button type="button" className="btn btn--primary" onClick={() => onResult(true)}>
            Je sais
          </button>
        </div>
      )}
    </>
  );
}

function ConjPractice({
  verb,
  row,
  onResult,
}: {
  verb: UnitContent['conjugationExercises'][number];
  row: UnitContent['conjugationExercises'][number]['rows'][number];
  onResult: (correct: boolean) => void;
}) {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const check = () => {
    if (feedback) return;
    const ok = normalizeAnswer(input) === normalizeAnswer(row.answer);
    setFeedback(ok ? 'correct' : 'wrong');
    setTimeout(() => onResult(ok), ok ? 700 : 1200);
  };

  return (
    <>
      <div className="conj-header">
        <span className="conj-verb">{verb.verb}</span>
        <span className="conj-meta">{verb.tense} · {verb.english}</span>
      </div>
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
    </>
  );
}
