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
                          name={option.icon as any}
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
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '85%',
    borderRadius: radii.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  safeAreaContent: {
    maxHeight: 500,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  scrollView: {
    maxHeight: 400,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  headerContent: {
    width: '100%',
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
    paddingBottom: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: spacing.lg,
  },
  themeItem: {
    width: '22%',
    minWidth: 75,
    alignItems: 'center',
    gap: spacing.sm,
  },
  colorCircle: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    opacity: 0.6,
  },
  colorBase: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  iconContainer: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  themeName: {
    fontSize: typography.bodySmall.fontSize,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

