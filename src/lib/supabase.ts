import { createClient } from '@supabase/supabase-js';
import { secureStore } from './secureStore';
import Constants from 'expo-constants';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// Configure WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

const SUPABASE_URL = Constants.expoConfig?.extra?.supabseUrl;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey;

export const supabase = createClient(
  'https://dyqzqylodyzpghqtqbri.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5cXpxeWxvZHl6cGdocXRxYnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTUxNDcsImV4cCI6MjA3NjA5MTE0N30.3-oPfZsI-I3PB4_CZkb2t0-e4MARtw7Xo1tbLRr2dQg',
  {
    auth: {
      storage: secureStore as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      // Remove PKCE flow for anonymous auth as it might not be supported
      // flowType: 'pkce',
    },
  },
);

// OAuth configuration
const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'liftlog',
  path: 'auth',
});

export const authConfig = {
  redirectUri,
  scopes: ['openid', 'profile', 'email'],
};

export const apiUrl = `${SUPABASE_URL}/function /v1/make-server-c863b939`;

export const getAccessToken = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
};
