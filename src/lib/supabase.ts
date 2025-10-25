import { createClient } from '@supabase/supabase-js';
import { secureStore } from './secureStore';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: Platform.OS === 'web' ? null : (secureStore as any),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export const apiUrl = `${SUPABASE_URL}/function /v1/make-server-c863b939`;

export const getAccessToken = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
};

export const getUserId = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id;
};
