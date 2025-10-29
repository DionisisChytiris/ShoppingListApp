import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../lib/theme';
import { useTheme } from '../lib/themeContext';

export default function SettingsScreen() {
  const { currentTheme, setTheme, theme } = useTheme();

  const themeOptions = [
    {
      id: 'light',
      name: 'Light',
      description: 'Clean and bright',
      backgroundColor: '#FFFFFF',
      icon: 'sunny-outline',
    },
    {
      id: 'warm',
      name: 'Warm',
      description: 'Cozy and warm',
      backgroundColor: '#FFF8F0',
      icon: 'flame-outline',
    },
    {
      id: 'dark',
      name: 'Dark',
      description: 'Easy on the eyes',
      backgroundColor: '#1A1A2E',
      icon: 'moon-outline',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
            Settings
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Theme Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Choose Theme
            </Text>
            <Text style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
              Pick your favorite color scheme
            </Text>

            <View style={styles.themeGrid}>
              {themeOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.themeCard,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor:
                        currentTheme === option.id
                          ? theme.colors.primary
                          : theme.colors.border,
                      borderWidth: currentTheme === option.id ? 2 : 1,
                    },
                  ]}
                  onPress={() => setTheme(option.id as any)}
                  activeOpacity={0.7}
                >
                  {/* Color Preview Circle */}
                  <View
                    style={[
                      styles.colorPreview,
                      { backgroundColor: option.backgroundColor },
                    ]}
                  />

                  {/* Theme Name */}
                  <Text
                    style={[
                      styles.themeName,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {option.name}
                  </Text>

                  {/* Description */}
                  <Text
                    style={[
                      styles.themeDescription,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {option.description}
                  </Text>

                  {/* Check Icon */}
                  {currentTheme === option.id && (
                    <View style={styles.checkIcon}>
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={theme.colors.primary}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
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
  themeGrid: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  themeCard: {
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    position: 'relative',
  },
  colorPreview: {
    width: 80,
    height: 80,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  themeName: {
    ...typography.button,
  },
  themeDescription: {
    ...typography.bodySmall,
  },
  checkIcon: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
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