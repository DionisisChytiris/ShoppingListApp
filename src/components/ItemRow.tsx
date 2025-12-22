import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Item } from '../types';
import { colors, spacing, radii, typography, fontSizes } from '../lib/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';

type Props = {
  item: Item;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ItemRow({ item, onToggle, onEdit, onDelete }: Props) {
  const { theme } = useTheme();
  
  return (
    <View style={[
      styles.row,
      {
        backgroundColor: theme.colors.surface,
        opacity: item.checked ? 0.6 : 1,
      }
    ]}>
      <TouchableOpacity 
        onPress={onToggle} 
        style={styles.check}
        activeOpacity={0.7}
      >
        <View style={[
          styles.checkbox,
          item.checked && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
        ]}>
          {item.checked && (
            <MaterialIcons name="check" size={18} color={colors.onPrimary} />
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.meta}>
        <Text style={[
          styles.name,
          { color: item.checked ? theme.colors.onSurfaceVariant : theme.colors.onSurface },
          item.checked && { textDecorationLine: 'line-through' }
        ]}>
          {item.name}
        </Text>
        {item.description && (
          <Text style={[
            styles.description,
            { color: theme.colors.onSurfaceVariant }
          ]}>
            {item.description}
          </Text>
        )}
        {item.price && (
          <Text style={[styles.price, { color: theme.colors.onSurfaceVariant }]}>
            ${item.price.toFixed(2)}
          </Text>
        )}
        {item.quantity && item.quantity > 1 && (
          <Text style={[styles.quantity, { color: theme.colors.onSurfaceVariant }]}>
            Qty: {item.quantity}
          </Text>
        )}
      </View>

      {item.photoUri && (
        <Image 
          source={{ uri: item.photoUri }} 
          style={styles.thumb}
          resizeMode="cover"
        />
      )}

      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={onEdit} 
          style={[styles.iconButton, { backgroundColor: theme.colors.surfaceVariant }]}
          activeOpacity={0.7}
        >
          <MaterialIcons name="edit" size={18} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={onDelete} 
          style={[styles.iconButton, { backgroundColor: theme.colors.surfaceVariant }]}
          activeOpacity={0.7}
        >
          <MaterialIcons name="delete-outline" size={18} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.md,
    marginVertical: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  check: {
    marginRight: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meta: {
    flex: 1,
  },
  name: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight as '400',
    marginBottom: 4,
  },
  description: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.bodySmall.fontWeight as '400',
    marginBottom: 4,
    lineHeight: typography.bodySmall.lineHeight,
    opacity: 0.8,
  },
  price: {
    fontSize: typography.label.fontSize,
    marginTop: 2,
    fontWeight: typography.label.fontWeight as '500',
  },
  quantity: {
    fontSize: fontSizes.small,
    marginTop: 2,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
    marginLeft: spacing.md,
    marginRight: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginLeft: spacing.xs,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radii.sm,
  },
});