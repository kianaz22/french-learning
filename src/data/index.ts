import { unit1 } from './unit1';
import { unit2 } from './unit2';
import { unit3 } from './unit3';
import type { UnitContent } from './types';

export * from './types';
export { unit1, unit2, unit3 };

export const units: UnitContent[] = [unit1, unit2, unit3];

export const UNIT_NUMBERS = units.map((u) => u.meta.number);

export function getUnit(number: number): UnitContent {
  const unit = units.find((u) => u.meta.number === number);
  if (!unit) throw new Error(`Unit ${number} not found`);
  return unit;
}

export const CURRENT_UNIT_KEY = 'latelier-current-unit';

export function loadCurrentUnitNumber(): number {
  try {
    const raw = localStorage.getItem(CURRENT_UNIT_KEY);
    const n = raw ? Number(raw) : 1;
    return UNIT_NUMBERS.includes(n) ? n : 1;
  } catch {
    return 1;
  }
}

export function saveCurrentUnitNumber(number: number) {
  localStorage.setItem(CURRENT_UNIT_KEY, String(number));
}
