import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../hooks';
import { login, signup, clearError } from '../../redux/authSlice';
import { colors, spacing, radii, typography } from '../lib/theme';
import { useTheme } from '../lib/themeContext';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({
  visible,
  onClose,
  initialMode = 'login',
}: AuthModalProps) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = (): boolean => {
    setValidationError(null);
    dispatch(clearError());

    // Email validation
    if (!email.trim()) {
      setValidationError('Email is required');
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      setValidationError('Please provide a valid email address');
      return false;
    }

    // Password validation
    if (!password.trim()) {
      setValidationError('Password is required');
      return false;
    }
    if (mode === 'signup' && password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return false;
    }

    // Name validation for signup
    if (mode === 'signup' && !name.trim()) {
      setValidationError('Name is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setValidationError(null);
    dispatch(clearError());

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    try {
      if (mode === 'login') {
        await dispatch(login({ email: email.trim(), password })).unwrap();
      } else {
        await dispatch(signup({ email: email.trim(), password, name: name.trim() })).unwrap();
      }
      handleClose();
    } catch (err: any) {
      // Error is handled by Redux state, but we can also set local error if needed
      if (err?.message) {
        setValidationError(err.message);
      }
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setName('');
    setShowPassword(false);
    dispatch(clearError());
    onClose();
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setValidationError(null);
    dispatch(clearError());
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => {}} // Prevent closing with back button
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]} />
        )}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
          style={styles.keyboardView}
          pointerEvents="box-none"
        >
          <View style={styles.modalWrapper}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                    {mode === 'login' ? 'Login' : 'Sign Up'}
                  </Text>
                  {/* Close button removed - modal can only be closed after successful auth */}
                </View>

                {/* Error Message */}
                {(error || validationError) && (
                  <View style={[styles.errorContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Ionicons name="alert-circle-outline" size={18} color={theme.colors.error} style={styles.errorIcon} />
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>
                      {validationError || error}
                    </Text>
                  </View>
                )}

                {/* Form */}
                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={styles.form}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {mode === 'signup' && (
                    <View style={styles.inputContainer}>
                      <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                        Name
                      </Text>
                      <View
                        style={[
                          styles.inputWrapper,
                          { backgroundColor: theme.colors.surfaceVariant },
                        ]}
                      >
                        <Ionicons
                          name="person-outline"
                          size={20}
                          color={theme.colors.onSurfaceVariant}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          placeholder="Your name"
                          placeholderTextColor={theme.colors.onSurfaceVariant}
                          value={name}
                          onChangeText={setName}
                          style={[styles.input, { color: theme.colors.onSurface }]}
                          autoCapitalize="words"
                          returnKeyType="next"
                        />
                      </View>
                    </View>
                  )}

                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                      Email
                    </Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        { backgroundColor: theme.colors.surfaceVariant },
                      ]}
                    >
                      <Ionicons
                        name="mail-outline"
                        size={20}
                        color={theme.colors.onSurfaceVariant}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        placeholder="your@email.com"
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        value={email}
                        onChangeText={setEmail}
                        style={[styles.input, { color: theme.colors.onSurface }]}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                      />
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                      Password
                    </Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        { backgroundColor: theme.colors.surfaceVariant },
                      ]}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={theme.colors.onSurfaceVariant}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        placeholder="Enter your password"
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        value={password}
                        onChangeText={setPassword}
                        style={[styles.input, { color: theme.colors.onSurface, flex: 1 }]}
                        secureTextEntry={!showPassword}
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeButton}
                      >
                        <Ionicons
                          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={20}
                          color={theme.colors.onSurfaceVariant}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isLoading || !email.trim() || !password.trim() || (mode === 'signup' && !name.trim())}
                    style={[
                      styles.submitButton,
                      {
                        backgroundColor:
                          email.trim() && password.trim() && (mode === 'login' || name.trim())
                            ? theme.colors.primary
                            : theme.colors.surfaceVariant,
                        opacity:
                          isLoading ||
                          !email.trim() ||
                          !password.trim() ||
                          (mode === 'signup' && !name.trim())
                            ? 0.5
                            : 1,
                      },
                    ]}
                  >
                    {isLoading ? (
                      <ActivityIndicator color={colors.onPrimary} />
                    ) : (
                      <Text
                        style={[
                          styles.submitButtonText,
                          {
                            color:
                              email.trim() && password.trim() && (mode === 'login' || name.trim())
                                ? colors.onPrimary
                                : theme.colors.onSurfaceVariant,
                          },
                        ]}
                      >
                        {mode === 'login' ? 'Login' : 'Sign Up'}
                      </Text>
                    )}
                  </TouchableOpacity>

                  <View style={styles.switchContainer}>
                    <Text style={[styles.switchText, { color: theme.colors.onSurfaceVariant }]}>
                      {mode === 'login'
                        ? "Don't have an account? "
                        : 'Already have an account? '}
                    </Text>
                    <TouchableOpacity onPress={switchMode}>
                      <Text style={[styles.switchLink, { color: theme.colors.primary }]}>
                        {mode === 'login' ? 'Sign Up' : 'Login'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </SafeAreaView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalWrapper: {
    width: '90%',
    height: '70%',
    maxHeight: 600,
  },
  modalContent: {
    borderRadius: radii.lg,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: typography.heading2.fontSize,
    fontWeight: typography.heading2.fontWeight as 600,
  },
  closeButton: {
    padding: spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    gap: spacing.sm,
  },
  errorIcon: {
    marginRight: spacing.xs,
  },
  errorText: {
    flex: 1,
    fontSize: typography.bodySmall.fontSize,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  inputContainer: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight as 500,
    marginLeft: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.body.fontSize,
    paddingVertical: spacing.sm,
  },
  eyeButton: {
    padding: spacing.xs,
  },
  submitButton: {
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    minHeight: 52,
  },
  submitButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight as 600,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  switchText: {
    fontSize: typography.bodySmall.fontSize,
  },
  switchLink: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.label.fontWeight as 600,
  },
});
