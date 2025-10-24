import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';

const LoginCallback = () => {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This effect runs when the auth state changes
    if (!loading) {
      if (session) {
        // Auth is complete! Redirect to the main app.
        // use 'replace' to prevent the user from going "back" to the callback screen.
        router.replace('/(tabs)');
      } else {
        // Something went wrong, or user is not logged in
        // Send them back to the login page
        router.replace('/login');
      }
    }
  }, [session, loading, router]);

  // While loading, just show a spinner
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default LoginCallback;
