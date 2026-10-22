import { unit1 } from './unit1';
import { unit2 } from './unit2';
import { unit3 } from './unit3';
import { unit4 } from './unit4';
import { unit5 } from './unit5';
import { unit6 } from './unit6';
import { unit7 } from './unit7';
import { unit8 } from './unit8';
import type { UnitContent } from './types';

export * from './types';
export { unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8 };

export const units: UnitContent[] = [unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8];

export const UNIT_NUMBERS = units.map((u) => u.meta.number);

export const CURRENT_UNIT_KEY = 'latelier-current-unit';

export function getUnit(number: number): UnitContent {
  return units.find((u) => u.meta.number === number) ?? units[0];
}

export function loadCurrentUnitNumber(): number {
  try {
    const raw = localStorage.getItem(CURRENT_UNIT_KEY);
    const n = raw ? Number(raw) : 2;
    return UNIT_NUMBERS.includes(n) ? n : 2;
  } catch {
    return 2;
  }
}

export function saveCurrentUnitNumber(number: number) {
  localStorage.setItem(CURRENT_UNIT_KEY, String(number));
}
