import { useCallback, useEffect, useRef, useState } from 'react';
import type { SessionStepId } from '../data/unit1';
import { useAuth } from '../contexts/AuthProvider';
import {
  loadLocalProgress,
  saveLocalProgress,
  saveRemoteProgress,
  syncProgressForUser,
} from '../lib/progressSync';
import { defaultProgress, type ProgressState, type SyncStatus } from '../types/progress';

export type { ProgressState } from '../types/progress';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useProgress() {
  const { user, isGuest, onLoginSync } = useAuth();
  const [progress, setProgress] = useState<ProgressState>(loadLocalProgress);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [ready, setReady] = useState(false);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncedUser = useRef<string | null>(null);

  // Load & merge from cloud when user signs in
  useEffect(() => {
    if (!user) {
      setReady(true);
      setSyncStatus('idle');
      return;
    }

    if (lastSyncedUser.current === user.id) {
      setReady(true);
      return;
    }

    let cancelled = false;
    setReady(false);
    setSyncStatus('syncing');

    syncProgressForUser(user.id)
      .then((merged) => {
        if (cancelled) return;
        setProgress(merged);
        setSyncStatus('synced');
        lastSyncedUser.current = user.id;
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setSyncStatus('error');
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Persist locally on every change
  useEffect(() => {
    if (!ready) return;
    saveLocalProgress(progress);
  }, [progress, ready]);

  // Debounced cloud save when logged in
  useEffect(() => {
    if (!ready || !user || isGuest) return;

    if (syncTimer.current) clearTimeout(syncTimer.current);
    setSyncStatus('syncing');

    syncTimer.current = setTimeout(async () => {
      try {
        await saveRemoteProgress(user.id, progress);
        setSyncStatus(navigator.onLine ? 'synced' : 'offline');
      } catch {
        setSyncStatus('error');
      }
    }, 800);

    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [progress, user, isGuest, ready]);

  useEffect(() => {
    const goOffline = () => {
      if (user && !isGuest) setSyncStatus('offline');
    };
    const goOnline = () => {
      if (user && !isGuest) onLoginSync().then(() => setSyncStatus('synced')).catch(() => setSyncStatus('error'));
    };
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, [user, isGuest, onLoginSync]);

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

  const resetProgress = useCallback(async () => {
    setProgress({ ...defaultProgress });
    if (user && !isGuest) {
      setSyncStatus('syncing');
      try {
        await saveRemoteProgress(user.id, defaultProgress);
        setSyncStatus('synced');
      } catch {
        setSyncStatus('error');
      }
    }
  }, [user, isGuest]);

  const sessionComplete = progress.completedSteps.length >= 5;
  const todayComplete = progress.lastSessionDate === today() && sessionComplete;

  return {
    progress,
    syncStatus,
    progressReady: ready,
    updateProgress,
    markStepComplete,
    resetProgress,
    sessionComplete,
    todayComplete,
  };
}
