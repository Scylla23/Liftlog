import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmail, signInWithGoogle } from '@/lib/auth'; // Adjust path as needed

// Assuming you have these colors in your constants
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontSize } from '@/constants/typography';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // TODO: Update for es language

  const handleEmailLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }
    setLoading(true);
    await signInWithEmail(email, password);
    setLoading(false);
    // The AuthContext listener will handle the redirect on success
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
    // The AuthContext listener will handle the redirect on success
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={handleEmailLogin}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? 'Signing In...' : 'Sign In with Email'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.googleButton]}
        onPress={handleGoogleLogin}
        disabled={loading}
      >
        <Text style={styles.googleButtonText}>
          {loading ? 'Loading...' : 'Sign In with Google'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
        <Text style={styles.linkText}>
          Don't have an account? <Text style={styles.link}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// You can customize these styles to match your app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  input: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 8,
    color: colors.text,
    fontSize: fontSize.base,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: fontSize.base,
  },
  googleButton: {
    backgroundColor: colors.white, // Or your specific Google brand color
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  googleButtonText: {
    color: colors.background, // Or your specific Google brand color
    fontWeight: 'bold',
    fontSize: fontSize.base,
  },
  linkText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  link: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});
