import { useMemo, useState } from 'react';
import { flashcards, flashcardCategories } from '../data/unit1';

type Props = {
  onComplete: (scores: Record<string, 'know' | 'learning'>) => void;
};

export function Flashcards({ onComplete }: Props) {
  const [category, setCategory] = useState<string>('all');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [scores, setScores] = useState<Record<string, 'know' | 'learning'>>({});
  const [finished, setFinished] = useState(false);

  const deck = useMemo(() => {
    if (category === 'all') return flashcards;
    return flashcards.filter((c) => c.category === category);
  }, [category]);

  const card = deck[index];
  const reviewed = Object.keys(scores).filter((id) => deck.some((c) => c.id === id)).length;

  const rate = (rating: 'know' | 'learning') => {
    if (!card) return;
    const nextScores = { ...scores, [card.id]: rating };
    setScores(nextScores);
    setFlipped(false);

    if (index + 1 >= deck.length) {
      setFinished(true);
      onComplete(nextScores);
    } else {
      setIndex((i) => i + 1);
    }
  };

  if (finished) {
    const know = Object.values(scores).filter((s) => s === 'know').length;
    return (
      <div className="result-screen">
        <div className="result-icon">🃏</div>
        <h2>Cartes terminées</h2>
        <p>
          {know}/{deck.length} que vous connaissez bien
        </p>
        <p className="hint">Les cartes « Encore » reviendront en priorité la prochaine fois.</p>
      </div>
    );
  }

  return (
    <div className="study-view">
      <div className="filter-row">
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setIndex(0);
            setFlipped(false);
          }}
          className="select"
        >
          <option value="all">Toutes les catégories</option>
          {flashcardCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <span className="counter">
          {index + 1}/{deck.length}
        </span>
      </div>

      {card && (
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
              <button type="button" className="btn btn--secondary" onClick={() => rate('learning')}>
                Encore
              </button>
              <button type="button" className="btn btn--primary" onClick={() => rate('know')}>
                Je sais
              </button>
            </div>
          )}
        </>
      )}

      <p className="footer-stat">{reviewed} cartes notées</p>
    </div>
  );
}
