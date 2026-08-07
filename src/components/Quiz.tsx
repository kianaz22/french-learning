import { useState } from 'react';
import { multipleChoice } from '../data/unit1';

type Props = {
  onComplete: (score: number) => void;
};

export function Quiz({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = multipleChoice[index];

  const choose = (optionIndex: number) => {
    if (selected !== null || !q) return;
    setSelected(optionIndex);
    const isCorrect = optionIndex === q.correctIndex;
    const newCorrect = isCorrect ? correct + 1 : correct;
    if (isCorrect) setCorrect(newCorrect);

    setTimeout(() => {
      if (index + 1 >= multipleChoice.length) {
        setFinished(true);
        onComplete(newCorrect);
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
      }
    }, 1200);
  };

  if (finished) {
    const pct = Math.round((correct / multipleChoice.length) * 100);
    return (
      <div className="result-screen">
        <div className="result-icon">{pct >= 70 ? '🌟' : '📚'}</div>
        <h2>Quiz terminé</h2>
        <p>
          {correct}/{multipleChoice.length} correct ({pct}%)
        </p>
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className="study-view">
      <div className="progress-dots">
        {multipleChoice.map((_, i) => (
          <span
            key={i}
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
