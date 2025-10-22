import { supabase } from './supabase';
import { Alert, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

// --- Email + Password Functions ---

export const signInWithEmail = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    Alert.alert('Error', error.message);
  }
  // No need to return anything, the onAuthStateChange listener
  // in AuthContext.tsx will handle the session update.
};

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    Alert.alert('Error', error.message);
  } else if (!data.session) {
    // This happens when you have "Confirm email" enabled in Supabase
    Alert.alert('Success', 'Please check your email to confirm your sign up!');
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    Alert.alert('Error', error.message);
  }
  // The onAuthStateChange listener will detect this and set the session to null.
};

// --- Google Sign-In Function (Incomplete) ---
export const signInWithGoogle = async () => {
  try {
    if (Platform.OS === 'web') {
      const redirectUri = makeRedirectUri({
        path: 'login-callback',
      });
      console.log('Using WEB redirect URI:', redirectUri);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
        },
      });
      if (error) {
        Alert.alert('Error', error.message);
      }
    } else {
      try {
        // 1. Define redirectUri for mobile, using our app's scheme
        const redirectUri = makeRedirectUri({
          scheme: 'liftlog', // Tell it to use our app's scheme
          path: 'login-callback',
        });
        console.log('Using MOBILE redirect URI:', redirectUri);
        // 2. Get the Google sign-in URL from Supabase
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUri,
            skipBrowserRedirect: false, // We'll handle the redirect manually
          },
        });

        if (error) {
          Alert.alert('Error', error.message);
          return;
        }

        if (!data.url) {
          Alert.alert('Error', 'No URL returned from Supabase');
          return;
        }

        // 3. Open the web browser to the Supabase URL
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

        // 4. Handle the result from the web browser
        if (result.type === 'success') {
          // The URL will have a hash fragment (#) with the tokens
          // We need to parse this fragment
          const { access_token, refresh_token } = parseUrlFragment(result.url);

          if (!access_token || !refresh_token) {
            Alert.alert('Error', 'Invalid URL fragment. Could not extract tokens.');
            return;
          }

          // 5. Set the session in Supabase with the tokens
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (sessionError) {
            Alert.alert('Error', sessionError.message);
          }
          // If successful, the onAuthStateChange listener in AuthContext
          // will pick up the new session automatically!
        } else if (result.type === 'cancel') {
          // User cancelled the login
        } else {
          Alert.alert('Error', 'WebBrowser session failed.');
        }
      } catch (err) {
        Alert.alert('Error', 'An unexpected error occurred.');
        console.error(err);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

// A helper function to parse the URL fragment
const parseUrlFragment = (url: string): { [key: string]: string } => {
  const fragment = url.split('#')[1];
  if (!fragment) {
    return {};
  }

  const params = new URLSearchParams(fragment);
  const result: { [key: string]: string } = {};
  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
};
