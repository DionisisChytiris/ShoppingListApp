import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { spacing, radii, typography } from '../lib/theme';
import { ThemeVariant } from '../lib/theme';

interface ThemeSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  currentTheme: ThemeVariant;
  onSelectTheme: (theme: ThemeVariant) => void;
}

/* eslint-disable react-native/no-inline-styles */

const themeOptions = [
  {
    id: 'light' as ThemeVariant,
    name: 'Light',
    backgroundColor: '#FFFFFF',
    accentColor: '#E8F4FD',
    icon: 'sunny-outline',
  },
  {
    id: 'warm' as ThemeVariant,
    name: 'Warm',
    backgroundColor: '#FFF8F0',
    accentColor: '#FF6B35',
    icon: 'flame-outline',
  },
  {
    id: 'dark' as ThemeVariant,
    name: 'Dark',
    backgroundColor: '#0F0F1E',
    accentColor: '#6C63FF',
    icon: 'moon-outline',
  },
  {
    id: 'blue' as ThemeVariant,
    name: 'Blue',
    backgroundColor: '#E8F4FD',
    accentColor: '#0066CC',
    icon: 'water-outline',
  },
  {
    id: 'green' as ThemeVariant,
    name: 'Green',
    backgroundColor: '#E8F5E9',
    accentColor: '#2E7D32',
    icon: 'leaf-outline',
  },
  {
    id: 'purple' as ThemeVariant,
    name: 'Purple',
    backgroundColor: '#F3E5F5',
    accentColor: '#7B1FA2',
    icon: 'color-palette-outline',
  },
  {
    id: 'pink' as ThemeVariant,
    name: 'Pink',
    backgroundColor: '#FCE4EC',
    accentColor: '#C2185B',
    icon: 'heart-outline',
  },
  {
    id: 'ocean' as ThemeVariant,
    name: 'Ocean',
    backgroundColor: '#E0F2F1',
    accentColor: '#00695C',
    icon: 'fish-outline',
  },
  {
    id: 'amber' as ThemeVariant,
    name: 'Amber',
    backgroundColor: '#FFF8E1',
    accentColor: '#FF6F00',
    icon: 'star-outline',
  },
];

export default function ThemeSelectionModal({
  visible,
  onClose,
  currentTheme,
  onSelectTheme,
}: ThemeSelectionModalProps) {
  const { theme } = useTheme();

  const handleSelect = (themeId: ThemeVariant) => {
    onSelectTheme(themeId);
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
            backgroundColor: theme.name === 'dark' 
              ? 'rgba(0, 0, 0, 0.85)' 
              : 'rgba(0, 0, 0, 0.5)'
          }
        ]} 
        onPress={onClose}
      >
        <Pressable
          style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.safeAreaContent}>
              {/* Header */}
              <View style={[styles.header, { borderBottomColor: theme.colors.outline }]}>
                <View style={styles.headerContent}>
                  <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                    Choose Theme
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

              {/* Theme Grid - Centered */}
              <View style={styles.centerContainer}>
                <ScrollView
                  contentContainerStyle={styles.content}
                  showsVerticalScrollIndicator={false}
                  style={styles.scrollView}
                >
            <View style={styles.themeGrid}>
              {themeOptions.map((option) => {
                const isSelected = currentTheme === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.themeItem}
                    onPress={() => handleSelect(option.id)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.colorCircle,
                        {
                          backgroundColor: option.backgroundColor,
                          borderColor: isSelected ? option.accentColor : theme.colors.border,
                          borderWidth: isSelected ? 3 : 1.5,
                          shadowColor: isSelected ? option.accentColor : '#000',
                          shadowOffset: { width: 0, height: isSelected ? 3 : 1 },
                          shadowOpacity: isSelected ? 0.3 : 0.1,
                          shadowRadius: isSelected ? 6 : 2,
                          elevation: isSelected ? 5 : 2,
                        },
                      ]}
                    >
                      {/* Gradient-like effect showing both colors */}
                      <View style={[styles.colorGradient, { backgroundColor: option.accentColor }]} />
                      <View style={[styles.colorBase, { backgroundColor: option.backgroundColor }]} />
                      
                      {isSelected && (
                        <View style={styles.selectedOverlay}>
                          <View
                            style={[
                              styles.selectedIndicator,
                              { backgroundColor: option.accentColor },
                            ]}
                          >
                            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                          </View>
                        </View>
                      )}
                      
                      {/* Icon */}
                      <View style={[styles.iconContainer, { backgroundColor: `${option.accentColor}30` }]}>
                        <Ionicons
                          name={option.icon as keyof typeof Ionicons.glyphMap}
                          size={20}
                          color={option.id === 'light' ? '#0B84FF' : option.accentColor}
                        />
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.themeName,
                        {
                          color: theme.colors.onSurface,
                          fontWeight: isSelected ? '600' : '500',
                        },
                      ]}
                    >
                      {option.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              </View>
                </ScrollView>
              </View>
            </View>
          </Pressable>
        </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  colorBase: {
    bottom: 0,
    height: '50%',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  colorCircle: {
    alignItems: 'center',
    borderRadius: 32.5,
    height: 65,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    width: 65,
  },
  colorGradient: {
    height: '50%',
    left: 0,
    opacity: 0.6,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  content: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',

  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    width: 32,
    zIndex: 1,
  },
  modalContent: {
    borderRadius: radii.lg,
    elevation: 10,
    maxHeight: '85%',
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    width: '90%',
  },
  overlay: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  safeAreaContent: {
    maxHeight: 500,
  },
  scrollView: {
    maxHeight: 400,
  },
  selectedIndicator: {
    alignItems: 'center',
    borderColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 2,
    elevation: 3,
    height: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    top: 4,
    width: 20,
  },
  selectedOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    justifyContent: 'space-around',
  },
  themeItem: {
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 75,
    width: '22%',
  },
  themeName: {
    fontSize: typography.bodySmall.fontSize,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  title: {
    fontSize: typography.heading3.fontSize,
    fontWeight: '600' as const,
    lineHeight: typography.heading3.lineHeight,
  },
});

