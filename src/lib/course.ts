export type CourseStatus = 'upcoming' | 'current' | 'done';

export type CourseState = {
  statuses: Record<number, CourseStatus>;
};

export const COURSE_KEY = 'latelier-course';

export const COURSE_UNITS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

/** Practice the last unit marked Terminé; if none, start at Unité 1. */
export const FOCUS_UNIT = 1;

export const statusLabel: Record<CourseStatus, string> = {
  upcoming: 'Pas encore',
  current: 'En cours',
  done: 'Terminé',
};

const defaultState = (): CourseState => ({
  statuses: {
    1: 'upcoming',
    2: 'done',
    3: 'upcoming',
    4: 'upcoming',
    5: 'upcoming',
    6: 'upcoming',
    7: 'upcoming',
    8: 'upcoming',
  },
});

export function loadCourse(): CourseState {
  try {
    const raw = localStorage.getItem(COURSE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<CourseState>;
    return {
      ...defaultState(),
      ...parsed,
      statuses: { ...defaultState().statuses, ...parsed.statuses },
    };
  } catch {
    return defaultState();
  }
}

export function saveCourse(state: CourseState) {
  localStorage.setItem(COURSE_KEY, JSON.stringify(state));
}

export function lastFinishedUnit(state: CourseState): number {
  const done = COURSE_UNITS.filter((n) => state.statuses[n] === 'done');
  return done.length ? done[done.length - 1] : FOCUS_UNIT;
}

