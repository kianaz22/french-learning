import { stepLabel } from '../lib/session';
import type { SessionStepId } from '../data/types';

type Props = {
  nextStep: SessionStepId | null;
  onHome: () => void;
  onNext?: (id: SessionStepId) => void;
};

export function ResultActions({ nextStep, onHome, onNext }: Props) {
  return (
    <div className="result-actions">
      {nextStep && onNext && (
        <button type="button" className="btn btn--primary btn--full" onClick={() => onNext(nextStep)}>
          Activité suivante · {stepLabel(nextStep)}
        </button>
      )}
      <button type="button" className={nextStep ? 'btn btn--secondary btn--full' : 'btn btn--primary btn--full'} onClick={onHome}>
        Retour à l’accueil
      </button>
    </div>
  );
}
