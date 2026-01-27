import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, radii, radius } from '../lib/theme';
import { useTheme } from '../lib/themeContext';
import { useNavigation } from '@react-navigation/native';
import ThemeSelectionModal from '../modals/ThemeSelectionModal';
import LanguageSelectionModal from '../modals/LanguageSelectionModal';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setLanguage, Language } from '../../redux/languageSlice';
import { useTranslation } from '../hooks/useTranslation';
// import { logout } from '../../redux/authSlice';
import AuthModal from '../modals/AuthModal';

/* eslint-disable react-native/no-inline-styles */

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { currentTheme, setTheme, theme } = useTheme();
  const navigation = useNavigation();
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.language.language);
  // const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [authModalVisible, setAuthModalVisible] = useState(false);

  // Get current theme info for display
  const getCurrentThemeInfo = () => {
    const themes: Record<string, { name: string; backgroundColor: string; accentColor: string }> = {
      light: { name: 'Light', backgroundColor: '#FFFFFF', accentColor: '#0B84FF' },
      warm: { name: 'Warm', backgroundColor: '#FFF8F0', accentColor: '#FF6B35' },
      dark: { name: 'Dark', backgroundColor: '#0F0F1E', accentColor: '#6C63FF' },
      blue: { name: 'Blue', backgroundColor: '#E8F4FD', accentColor: '#0066CC' },
      green: { name: 'Green', backgroundColor: '#E8F5E9', accentColor: '#2E7D32' },
      purple: { name: 'Purple', backgroundColor: '#F3E5F5', accentColor: '#7B1FA2' },
      pink: { name: 'Pink', backgroundColor: '#FCE4EC', accentColor: '#C2185B' },
      ocean: { name: 'Ocean', backgroundColor: '#E0F2F1', accentColor: '#00695C' },
      amber: { name: 'Amber', backgroundColor: '#FFF8E1', accentColor: '#FF6F00' },
    };
    return themes[currentTheme] || themes.light;
  };

  const currentThemeInfo = getCurrentThemeInfo();

  // Get current language info for display
  const getCurrentLanguageInfo = () => {
    const languages: Record<string, { name: string; nativeName: string; flag: string }> = {
      en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
      es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
      el: { name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
    };
    return languages[currentLanguage] || languages.en;
  };

  const currentLanguageInfo = getCurrentLanguageInfo();

  const handleLanguageChange = (language: Language) => {
    dispatch(setLanguage(language));
  };

  // const handleLogout = async () => {
  //   await dispatch(logout());
  // };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.outline }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { backgroundColor: theme.colors.surfaceVariant }]}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
            {t('settings.title')}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Theme Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              {t('settings.appearance')}
            </Text>
            <Text style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
              {t('settings.appearanceDescription')}
            </Text>

            <TouchableOpacity
              style={[styles.themeButton, { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              }]}
              onPress={() => setThemeModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.themeButtonLeft}>
                <View
                  style={[
                    styles.themePreviewCircle,
                    {
                      backgroundColor: currentThemeInfo.backgroundColor,
                      borderColor: currentThemeInfo.accentColor,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.themeAccentDot,
                      { backgroundColor: currentThemeInfo.accentColor },
                    ]}
                  />
                </View>
                <View style={styles.themeButtonText}>
                  <Text style={[styles.themeButtonTitle, { color: theme.colors.onSurface }]}>
                    {t('settings.theme')}
                  </Text>
                  <Text style={[styles.themeButtonSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                    {currentThemeInfo.name}
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeButton,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  marginTop: spacing.md,
                },
              ]}
              onPress={() => setLanguageModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.themeButtonLeft}>
                <View
                  style={[
                    styles.languagePreview,
                    {
                      backgroundColor: theme.colors.surfaceVariant,
                      borderColor: theme.colors.outline,
                    },
                  ]}
                >
                  <Text style={styles.flagEmoji}>{currentLanguageInfo.flag}</Text>
                </View>
                <View style={styles.themeButtonText}>
                  <Text style={[styles.themeButtonTitle, { color: theme.colors.onSurface }]}>
                    {t('settings.language')}
                  </Text>
                  <Text style={[styles.themeButtonSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                    {currentLanguageInfo.name}
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>
          </View>

          {/* Account Section */}
          {/* <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Account
            </Text>
            {isAuthenticated ? (
              <>
                <View
                  style={[
                    styles.accountCard,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <View style={styles.accountInfo}>
                    <Ionicons
                      name="person-circle-outline"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <View style={styles.accountText}>
                      <Text style={[styles.accountName, { color: theme.colors.onSurface }]}>
                        {user?.name || user?.email || 'User'}
                      </Text>
                      <Text style={[styles.accountEmail, { color: theme.colors.onSurfaceVariant }]}>
                        {user?.email}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.logoutButton,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={handleLogout}
                  activeOpacity={0.7}
                >
                  <Ionicons name="log-out-outline" size={20} color={theme.colors.error || '#c62828'} />
                  <Text style={[styles.logoutButtonText, { color: theme.colors.error || '#c62828' }]}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
                onPress={() => setAuthModalVisible(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="log-in-outline" size={20} color={theme.colors.onPrimary} />
                <Text style={[styles.loginButtonText, { color: theme.colors.onPrimary }]}>
                  Login / Sign Up
                </Text>
              </TouchableOpacity>
            )}
          </View> */}

          {/* About Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              {t('settings.about')}
            </Text>
            <View
              style={[
                styles.aboutCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text style={[styles.aboutText, { color: theme.colors.onSurface }]}>
                Shopping List App
              </Text>
              <Text style={[styles.aboutVersion, { color: theme.colors.onSurfaceVariant }]}>
                Version 1.0.0
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <ThemeSelectionModal
        visible={themeModalVisible}
        onClose={() => setThemeModalVisible(false)}
        currentTheme={currentTheme}
        onSelectTheme={setTheme}
      />

      <LanguageSelectionModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={handleLanguageChange}
      />

      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // accountCard: {
  //   borderRadius: radius.md,
  //   borderWidth: 1,
  //   padding: spacing.md,
  // },
  // accountEmail: {
  //   fontSize: typography.bodySmall.fontSize,
  //   fontWeight: typography.bodySmall.fontWeight as 400,
  //   lineHeight: typography.bodySmall.lineHeight,
  // },
  // accountInfo: {
  //   alignItems: 'center',
  //   flexDirection: 'row',
  //   gap: spacing.md,
  // },
  // accountName: {
  //   ...typography.body,
  //   fontWeight: '600',
  //   marginBottom: 2,
  // },
  // accountText: {
  //   flex: 1,
  // },
  aboutCard: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  aboutText: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight as 600,
    lineHeight: typography.button.lineHeight,
  },
  aboutVersion: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.bodySmall.fontWeight as 400,
    lineHeight: typography.bodySmall.lineHeight,
  },
  backButton: {
    alignItems: 'center',
    borderRadius: radii.sm,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  container: {
    flex: 1,
  },
  flagEmoji: {
    fontSize: 24,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.heading2.fontSize,
    fontWeight: typography.heading2.fontWeight as 700,
    lineHeight: typography.heading2.lineHeight,
  },
  languagePreview: {
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1.5,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionDescription: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.bodySmall.fontWeight as 400,
    lineHeight: typography.bodySmall.lineHeight,
  },
  sectionTitle: {
    fontSize: typography.heading3.fontSize,
    fontWeight: typography.heading3.fontWeight as 600,
    lineHeight: typography.heading3.lineHeight,
  },
  themeAccentDot: {
    borderColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 2.5,
    height: 20,
    width: 20,
  },
  themeButton: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    elevation: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  themeButtonLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: spacing.md,
  },
  themeButtonSubtitle: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.bodySmall.fontWeight as 400,
    lineHeight: typography.bodySmall.lineHeight,
  },
  themeButtonText: {
    flex: 1,
  },
  themeButtonTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  themePreviewCircle: {
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 2,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  // loginButton: {
  //   alignItems: 'center',
  //   borderRadius: radii.md,
  //   flexDirection: 'row',
  //   gap: spacing.sm,
  //   justifyContent: 'center',
  //   paddingVertical: spacing.md,
  // },
  // loginButtonText: {
  //   ...typography.button,
  //   fontWeight: '600',
  // },
  // logoutButton: {
  //   alignItems: 'center',
  //   borderRadius: radii.md,
  //   borderWidth: 1,
  //   flexDirection: 'row',
  //   gap: spacing.sm,
  //   justifyContent: 'center',
  //   marginTop: spacing.md,
  //   paddingVertical: spacing.md,
  // },
  // logoutButtonText: {
  //   ...typography.button,
  //   fontWeight: '600',
  // },
});