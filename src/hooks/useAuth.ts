import { User, AuthError, OAuthProvider } from '@/types';
import { useState, useEffect } from 'react';
import { supabase, authConfig } from '@/lib/supabase';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : 'Failed to get session',
        });
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
      if (event === 'SIGNED_OUT') {
        setError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithOAuth = async (provider: OAuthProvider) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: authConfig.redirectUri,
          scopes: authConfig.scopes.join(' '),
        },
      });

      if (error) {
        throw error;
      }

      if (data.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, authConfig.redirectUri);

        if (result.type === 'success') {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            throw sessionError;
          }
          setUser(sessionData.session?.user ?? null);
        } else if (result.type === 'cancel') {
          setError({ message: 'Authentication was cancelled' });
        }
      }
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Authentication failed',
        code: err instanceof Error && 'code' in err ? String(err.code) : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => await signInWithOAuth('google');
  const signInWithApple = async () => await signInWithOAuth('apple');

  const signInAnonymously = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        throw error;
      }

      setUser(data.user);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Anonymous sign-in failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Logout failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    signInWithGoogle,
    signInWithApple,
    signInAnonymously,
    logout,
  };
}
