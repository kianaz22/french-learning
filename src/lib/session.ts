import { dailySessionSteps, type SessionStepId } from '../data/types';

export function isSessionStep(view: string): view is SessionStepId {
  return dailySessionSteps.some((step) => step.id === view);
}

export function stepLabel(id: SessionStepId): string {
  return dailySessionSteps.find((step) => step.id === id)?.label ?? id;
}

export function nextSessionStep(
  completed: SessionStepId[],
  from?: SessionStepId,
): SessionStepId | null {
  const remaining = dailySessionSteps.filter((step) => !completed.includes(step.id));
  if (remaining.length === 0) return null;
  if (!from) return remaining[0].id;
  const start = dailySessionSteps.findIndex((step) => step.id === from);
  return (
    remaining.find((step) => dailySessionSteps.findIndex((s) => s.id === step.id) > start)?.id ??
    remaining[0].id
  );
}
