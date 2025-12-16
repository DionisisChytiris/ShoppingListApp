import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, radii } from '../lib/theme';
import { useTheme } from '../lib/themeContext';
import { useNavigation } from '@react-navigation/native';
import ThemeSelectionModal from '../modals/ThemeSelectionModal';

export default function SettingsScreen() {
  const { currentTheme, setTheme, theme } = useTheme();
  const navigation = useNavigation();
  const [themeModalVisible, setThemeModalVisible] = useState(false);

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
            Settings
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
              Appearance
            </Text>
            <Text style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
              Customize the app appearance
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
                    Theme
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
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              About
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radii.sm,
  },
  headerTitle: {
    ...typography.heading2,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.heading3,
  },
  sectionDescription: {
    ...typography.bodySmall,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  themeButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  themePreviewCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeAccentDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  themeButtonText: {
    flex: 1,
  },
  themeButtonTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  themeButtonSubtitle: {
    ...typography.bodySmall,
  },
  aboutCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  aboutText: {
    ...typography.button,
  },
  aboutVersion: {
    ...typography.bodySmall,
  },
});