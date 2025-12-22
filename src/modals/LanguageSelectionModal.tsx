import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { spacing, radii, typography } from '../lib/theme';
import { Language } from '../../redux/languageSlice';
import { useTranslation } from '../hooks/useTranslation';

interface LanguageSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onSelectLanguage: (language: Language) => void;
}

const languageOptions: Array<{
  id: Language;
  name: string;
  nativeName: string;
  flag: string;
  icon: string;
}> = [
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    icon: 'globe-outline',
  },
  {
    id: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    icon: 'globe-outline',
  },
  {
    id: 'el',
    name: 'Greek',
    nativeName: 'Ελληνικά',
    flag: '🇬🇷',
    icon: 'globe-outline',
  },
];

export default function LanguageSelectionModal({
  visible,
  onClose,
  currentLanguage,
  onSelectLanguage,
}: LanguageSelectionModalProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handleSelect = (languageId: Language) => {
    onSelectLanguage(languageId);
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={[
          styles.overlay,
          {
            backgroundColor:
              theme.name === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.5)',
          },
        ]}
        onPress={onClose}
      >
        <Pressable
          style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.outline }]}>
                <View style={styles.headerContent}>
                  <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                    {t('settings.selectLanguage')}
                  </Text>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.closeButton, { backgroundColor: theme.colors.surfaceVariant }]}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={22} color={theme.colors.onSurface} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Language List */}
          <View style={styles.content}>
            {languageOptions.map((option) => {
              const isSelected = currentLanguage === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.languageItem,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.primaryLight
                        : theme.colors.surfaceVariant,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
                    },
                  ]}
                  onPress={() => handleSelect(option.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.languageItemLeft}>
                    <Text style={styles.flag}>{option.flag}</Text>
                    <View style={styles.languageText}>
                      <Text
                        style={[
                          styles.languageName,
                          {
                            color: theme.colors.onSurface,
                            fontWeight: isSelected ? '600' : '500',
                          },
                        ]}
                      >
                        {option.name}
                      </Text>
                      <Text style={[styles.languageNativeName, { color: theme.colors.onSurfaceVariant }]}>
                        {option.nativeName}
                      </Text>
                    </View>
                  </View>
                  {isSelected && (
                    <View
                      style={[
                        styles.selectedIndicator,
                        { backgroundColor: theme.colors.primary },
                      ]}
                    >
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: radii.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.heading3.fontSize,
    fontWeight: '600' as const,
    lineHeight: typography.heading3.lineHeight,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1.5,
  },
  languageItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  flag: {
    fontSize: 28,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: typography.body.fontSize,
    marginBottom: 2,
  },
  languageNativeName: {
    fontSize: typography.bodySmall.fontSize,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

