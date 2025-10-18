import { createClient } from "@supabase/supabase-js";
import { secureStore } from "./secureStore";
import Constants from "expo-constants";

const SUPABASE_URL = Constants.expoConfig?.extra?.supabseUrl;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: secureStore as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const apiUrl = `${SUPABASE_URL}/function /v1/make-server-c863b939`;

export const getAccessToken = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
};
