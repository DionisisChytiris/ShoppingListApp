import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Item } from '../types';
import { colors, spacing, radii, type } from '../lib/theme';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  item: Item;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ItemRow({ item, onToggle, onEdit, onDelete }: Props) {
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={onToggle} style={styles.check}>
        {item.checked ? (
          <MaterialIcons name="check-box" size={20} color={colors.primary} />
        ) : (
          <MaterialIcons name="check-box-outline-blank" size={20} color={colors.muted} />
        )}
      </TouchableOpacity>

      <View style={styles.meta}>
        <Text style={[styles.name, item.checked && { textDecorationLine: 'line-through', color: colors.muted }]}>{item.name}</Text>
        <Text style={styles.price}>{item.price ? `$${item.price.toFixed(2)}` : ''}</Text>
      </View>

      {item.photoUri ? <Image source={{ uri: item.photoUri }} style={styles.thumb} /> : null}

      <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
        <MaterialIcons name="edit" size={20} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
        <MaterialIcons name="delete" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radii.sm,
    marginVertical: spacing.xs,
  },
  check: {
    marginRight: spacing.sm,
  },
  meta: {
    flex: 1,
  },
  name: {
    fontSize: type.body,
    color: colors.text,
  },
  price: {
    fontSize: type.small,
    color: colors.muted,
    marginTop: 4,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginLeft: spacing.sm,
  },
  iconButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginLeft: 4,
  },
});