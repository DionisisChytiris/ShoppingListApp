import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { colors, spacing, typography } from '../lib/theme';
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS, type ItemCategory } from '../lib/categories';
import { Item } from '../types';

interface ItemsCategoriesProps {
  selectedCategory: ItemCategory | null;
  onCategorySelect: (category: ItemCategory | null) => void;
  items: Item[];
}

export default function ItemsCategories({ selectedCategory, onCategorySelect, items }: ItemsCategoriesProps) {
  const { theme } = useTheme();

  return (
    // <View style={[styles.categoryFilterSection, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outline }]}>
    <View style={styles.categoryFilterSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryFilterScrollContent}
      >
        <TouchableOpacity
          onPress={() => onCategorySelect(null)}
          style={[
            styles.categoryFilterChip,
            {
              backgroundColor: selectedCategory === null
                ? theme.colors.primary
                : theme.colors.surfaceVariant,
            },
          ]}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.categoryFilterChipText,
              {
                color: selectedCategory === null
                  ? colors.onPrimary
                  : theme.colors.onSurfaceVariant,
              },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {CATEGORIES.map((cat) => {
          const hasItems = items.some(item => item.category === cat);
          if (!hasItems) return null;

          return (
            <TouchableOpacity
              key={cat}
              onPress={() => onCategorySelect(cat)}
              style={[
                styles.categoryFilterChip,
                {
                  backgroundColor: selectedCategory === cat
                    ? theme.colors.primary
                    : theme.colors.surfaceVariant,
                },
              ]}
              activeOpacity={0.7}
            >
              <Ionicons
                name={CATEGORY_ICONS[cat] as keyof typeof Ionicons.glyphMap}
                size={16}
                color={selectedCategory === cat
                  ? colors.onPrimary
                  : theme.colors.onSurfaceVariant}
                style={styles.categoryFilterIcon}
              />
              <Text
                style={[
                  styles.categoryFilterChipText,
                  {
                    color: selectedCategory === cat
                      ? colors.onPrimary
                      : theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                {CATEGORY_LABELS[cat]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryFilterChip: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  categoryFilterChipText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.label.fontWeight as 500,
  },
  categoryFilterIcon: {
    marginRight: 0,
  },
  categoryFilterScrollContent: {
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  categoryFilterSection: {
    // borderBottomWidth: 1,
    paddingVertical: spacing.md,
  },
});
