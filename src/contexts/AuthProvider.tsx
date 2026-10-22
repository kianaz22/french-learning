import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { describeAuthError, getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { isGuestMode, setGuestMode, syncProgressForUser } from '../lib/progressSync';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
  authConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  continueAsGuest: () => void;
  clearGuest: () => void;
  signOut: () => Promise<void>;
  onLoginSync: (unitNumber: number) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [isGuest, setIsGuest] = useState(isGuestMode);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setIsGuest(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const finishLoading = () => {
      if (!cancelled) setLoading(false);
    };
    const timeout = window.setTimeout(finishLoading, 4000);

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (cancelled) return;
        setSession(data.session);
        setUser(data.session?.user ?? null);
        if (data.session?.user) setGuestMode(false);
        setIsGuest(isGuestMode());
      })
      .catch(() => {
        /* Supabase unreachable — show auth / guest instead of spinning forever */
      })
      .finally(() => {
        window.clearTimeout(timeout);
        finishLoading();
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        setGuestMode(false);
        setIsGuest(false);
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase is not configured.' };

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error ? describeAuthError(error) : null };
    } catch (error) {
      return { error: describeAuthError(error) };
    }
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase is not configured.', needsConfirmation: false };

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      const needsConfirmation = !error && !data.session;
      return { error: error ? describeAuthError(error) : null, needsConfirmation };
    } catch (error) {
      return { error: describeAuthError(error), needsConfirmation: false };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase is not configured.' };

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      return { error: error ? describeAuthError(error) : null };
    } catch (error) {
      return { error: describeAuthError(error) };
    }
  }, []);

  const continueAsGuest = useCallback(() => {
    setGuestMode(true);
    setIsGuest(true);
  }, []);

  const clearGuest = useCallback(() => {
    setGuestMode(false);
    setIsGuest(false);
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    setGuestMode(true);
    setIsGuest(true);
  }, []);

  const onLoginSync = useCallback(async (unitNumber: number) => {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data } = await supabase.auth.getUser();
    if (data.user) await syncProgressForUser(data.user.id, unitNumber);
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isGuest,
      authConfigured: isSupabaseConfigured,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      continueAsGuest,
      clearGuest,
      signOut,
      onLoginSync,
    }),
    [
      user,
      session,
      loading,
      isGuest,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      continueAsGuest,
      clearGuest,
      signOut,
      onLoginSync,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
