import { useCallback, useEffect, useRef, useState } from 'react';
import type { SessionStepId } from '../data/types';
import { useAuth } from '../contexts/AuthProvider';
import {
  loadLocalProgress,
  mergeProgress,
  saveLocalProgress,
  saveRemoteProgress,
  syncProgressForUser,
} from '../lib/progressSync';
import { applyReviewDelta } from '../lib/reviewList';
import { defaultProgress, type ProgressState, type ReviewItem, type SyncStatus } from '../types/progress';

export type { ProgressState } from '../types/progress';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useProgress(unitNumber: number) {
  const { user, isGuest, onLoginSync } = useAuth();
  const [progress, setProgress] = useState<ProgressState>(() => loadLocalProgress(unitNumber));
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(user ? 'syncing' : 'idle');
  const [cloudReady, setCloudReady] = useState(!user);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSynced = useRef<string | null>(null);
  const progressForUnit = useRef(unitNumber);

  const syncKey = user ? `${user.id}:${unitNumber}` : null;

  // Always write to the unit this progress belongs to, before any unit switch.
  useEffect(() => {
    saveLocalProgress(progressForUnit.current, progress);
  }, [progress]);

  useEffect(() => {
    if (progressForUnit.current !== unitNumber) {
      progressForUnit.current = unitNumber;
      setProgress(loadLocalProgress(unitNumber));
    }
    lastSynced.current = null;
    setCloudReady(!user);
    setSyncStatus(user ? 'syncing' : 'idle');
  }, [unitNumber, user]);

  // Merge from cloud in the background — the app stays usable on local data.
  useEffect(() => {
    if (!user) {
      setCloudReady(true);
      setSyncStatus('idle');
      return;
    }

    if (lastSynced.current === syncKey) {
      setCloudReady(true);
      return;
    }

    let cancelled = false;
    setCloudReady(false);
    setSyncStatus('syncing');

    syncProgressForUser(user.id, unitNumber)
      .then((merged) => {
        if (cancelled) return;
        setProgress((current) => mergeProgress(current, merged));
        setSyncStatus('synced');
        lastSynced.current = syncKey;
        setCloudReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setSyncStatus('error');
        setCloudReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [user, unitNumber, syncKey]);

  useEffect(() => {
    if (!cloudReady || !user || isGuest) return;

    if (syncTimer.current) clearTimeout(syncTimer.current);

    syncTimer.current = setTimeout(async () => {
      setSyncStatus('syncing');
      try {
        await saveRemoteProgress(user.id, unitNumber, progress);
        setSyncStatus(navigator.onLine ? 'synced' : 'offline');
      } catch {
        setSyncStatus('error');
      }
    }, 800);

    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [progress, user, isGuest, cloudReady, unitNumber]);

  useEffect(() => {
    const goOffline = () => {
      if (user && !isGuest) setSyncStatus('offline');
    };
    const goOnline = () => {
      if (user && !isGuest) {
        onLoginSync(unitNumber)
          .then(() => setSyncStatus('synced'))
          .catch(() => setSyncStatus('error'));
      }
    };
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, [user, isGuest, onLoginSync, unitNumber]);

  const updateProgress = useCallback((patch: Partial<ProgressState>) => {
    setProgress((prev) => {
      const next = { ...prev, ...patch };
      const date = today();

      if (patch.completedSteps && patch.completedSteps.length > prev.completedSteps.length) {
        if (prev.lastSessionDate === date) {
          next.streak = prev.streak;
        } else if (prev.lastSessionDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yStr = yesterday.toISOString().slice(0, 10);
          next.streak = prev.lastSessionDate === yStr ? prev.streak + 1 : 1;
        } else {
          next.streak = 1;
        }
        next.lastSessionDate = date;
      }

      return next;
    });
  }, []);

  const markStepComplete = useCallback((stepId: SessionStepId) => {
    setProgress((prev) => {
      if (prev.completedSteps.includes(stepId)) return prev;
      const completedSteps = [...prev.completedSteps, stepId];
      const date = today();
      let streak = prev.streak;

      if (prev.lastSessionDate !== date) {
        if (prev.lastSessionDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          streak =
            prev.lastSessionDate === yesterday.toISOString().slice(0, 10) ? prev.streak + 1 : 1;
        } else {
          streak = 1;
        }
      }

      return { ...prev, completedSteps, lastSessionDate: date, streak };
    });
  }, []);

  const recordReview = useCallback((missed: ReviewItem[], correct: ReviewItem[]) => {
    setProgress((prev) => ({
      ...prev,
      ...applyReviewDelta(prev.reviewItems ?? [], prev.reviewCleared ?? [], missed, correct),
    }));
  }, []);

  const resetProgress = useCallback(async () => {
    setProgress({ ...defaultProgress });
    if (user && !isGuest) {
      setSyncStatus('syncing');
      try {
        await saveRemoteProgress(user.id, unitNumber, defaultProgress);
        setSyncStatus('synced');
      } catch {
        setSyncStatus('error');
      }
    }
  }, [user, isGuest, unitNumber]);

  const sessionComplete = progress.completedSteps.length >= 5;
  const todayComplete = progress.lastSessionDate === today() && sessionComplete;

  return {
    progress,
    syncStatus,
    progressReady: cloudReady,
    updateProgress,
    recordReview,
    markStepComplete,
    resetProgress,
    sessionComplete,
    todayComplete,
  };
}
