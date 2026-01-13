import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { colors, spacing, radii, typography } from '../lib/theme';
import { type ItemCategory } from '../lib/categories';
import { Item } from '../types';

interface AddEditItemButtonsProps {
  editingItem: Item | null | undefined;
  name: string;
  category: ItemCategory | undefined;
  onReset: () => void;
  onSave: () => void;
}

export default function AddEditItemButtons({
  editingItem,
  name,
  category,
  onReset,
  onSave,
}: AddEditItemButtonsProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.actionsRow, { borderTopColor: theme.colors.outline }]}>
      {editingItem && (
        <TouchableOpacity
          onPress={onReset}
          style={[
            styles.cancelButton,
            {
              backgroundColor: theme.colors.surfaceVariant,
              borderColor: theme.colors.outline,
            },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons
            name="refresh-outline"
            size={18}
            color={theme.colors.onSurfaceVariant}
          />
          <Text
            style={[styles.cancelButtonText, { color: theme.colors.onSurfaceVariant }]}
          >
            New
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={onSave}
        style={[
          styles.cancelButton,
          // styles.saveButton,
          {
            backgroundColor:
              name.trim() && category
                ? theme.colors.primary
                : theme.colors.surfaceVariant,
            opacity: name.trim() && category ? 1 : 0.9,
          },
        ]}
        activeOpacity={0.8}
        disabled={!name.trim() || !category}
      >
        <MaterialIcons
          name={editingItem ? 'check-circle' : 'add-circle'}
          size={20}
          color={
            name.trim() && category ? colors.onPrimary : theme.colors.onSurfaceVariant
          }
        />
        <Text
          style={[
            styles.saveButtonText,
            {
              color:
                name.trim() && category
                  ? colors.onPrimary
                  : theme.colors.onSurfaceVariant,
            },
          ]}
        >
          {editingItem ? 'Save Item' : 'Add Item'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    paddingRight: spacing.md,
    paddingVertical: 0,
  },
  cancelButton: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm
  },
  cancelButtonText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.button.fontWeight as 600,
  },
  saveButton: {
    alignItems: 'center',
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    minWidth: 120,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  saveButtonText: {
    fontWeight: typography.button.fontWeight as 600,
  },
});
