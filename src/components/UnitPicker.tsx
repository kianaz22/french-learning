import type { UnitContent } from '../data/types';

type Props = {
  units: UnitContent[];
  currentUnit: number;
  onSelect: (unitNumber: number) => void;
};

export function UnitPicker({ units, currentUnit, onSelect }: Props) {
  return (
    <div className="unit-picker" role="tablist" aria-label="Choisir une unité">
      {units.map((unit) => {
        const active = unit.meta.number === currentUnit;
        return (
          <button
            key={unit.meta.number}
            type="button"
            role="tab"
            aria-selected={active}
            className={`unit-pill ${active ? 'unit-pill--active' : ''}`}
            onClick={() => onSelect(unit.meta.number)}
          >
            <span className="unit-pill-num">Unité {unit.meta.number}</span>
            <span className="unit-pill-title">{unit.meta.title}</span>
          </button>
        );
      })}
    </div>
  );
}
