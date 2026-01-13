import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { Item } from '../types';
import { colors, spacing, radii, typography } from '../lib/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../lib/categories';

/* eslint-disable react-native/no-inline-styles */

type Props = {
  item: Item;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ItemRow({ item, onToggle, onEdit, onDelete }: Props) {
  const { theme } = useTheme();
  const [imageModalVisible, setImageModalVisible] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          opacity: item.checked ? 0.5 : 1,
        }
      ]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      {/* Category - Top Left */}
      {item.category && (
        <View style={[styles.categoryBadge, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text style={[styles.categoryText, { color: theme.colors.onSurfaceVariant }]}>
            {CATEGORY_LABELS[item.category]}
          </Text>
        </View>
      )}

      {/* Title - Top Left */}
      <View style={{ marginHorizontal: -10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', top: item.category ? spacing.md : spacing.sm }}>
        <View>
          <Text
            style={[
              { padding: 10 },
              // styles.title,
              {
                color: item.checked ? theme.colors.onSurfaceVariant : theme.colors.onSurface,
                // backgroundColor: theme.colors.surface,
                // top: item.category ? spacing.xl + spacing.sm : spacing.sm,
              },
              item.checked && { textDecorationLine: 'line-through' }
            ]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
        </View>

        {/* <View style={{position: 'absolute', top: '-55%', right: '20%'}}>
          {item.price && (
            <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant, paddingRight: 10 }]}>
              £{item.price.toFixed(2)}
            </Text>
          )}
        </View> */}
      </View>

      {/* Item Info */}
      {/* <View style={styles.infoContainer}> */}
      {/* <View style={styles.metaRow}> */}


      {/* {item.description && (
          <Text
            style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
            numberOfLines={1}
          >
            {item.description}
          </Text>
        )} */}
      {/* </View> */}

      {/* Checkmark icon - Bottom Left */}
      <View style={styles.checkButton}>
        <View style={[
          styles.checkCircle,
          {
            backgroundColor: item.checked ? theme.colors.primary : 'transparent',
            borderColor: item.checked ? theme.colors.primary : theme.colors.outline,
          }
        ]}>
          {item.checked && (
            <Ionicons name="checkmark" size={14} color={colors.onPrimary} />
          )}
        </View>
      </View>

      {/* Product Image - Bottom Right */}
      {item.photoUri ? (
        <TouchableOpacity
          onPress={() => setImageModalVisible(true)}
          style={[styles.imageContainer, { backgroundColor: theme.colors.surfaceVariant }]}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: item.photoUri }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : (
        <View style={[styles.imageContainer, styles.placeholderImage, { backgroundColor: theme.colors.surfaceVariant }]}>
          {item.category ? (
            <Ionicons
              name={CATEGORY_ICONS[item.category] as keyof typeof Ionicons.glyphMap}
              size={40}
              color={theme.colors.onSurfaceVariant}
            />
          ) : (
            <Ionicons name="image-outline" size={24} color={theme.colors.onSurfaceVariant} />
          )}
        </View>
      )}

      <View style={{ position: 'absolute', bottom: '0%', left: 0 }}>
        
        {item.quantity && item.quantity > 1 ? (
          <View style={styles.QuantityContainer}>

            <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant , fontSize: typography.label.fontSize * 1.2, paddingBottom: 5}]}>
              Qty: {item.quantity}
            </Text>
            {item.price && (
              <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
                (£{(item.quantity * item.price).toFixed(2)})
              </Text>
            )}
          </ View>
        ):  <View style={styles.QuantityContainer}>

        <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant , fontSize: typography.label.fontSize * 1.2, paddingBottom: 5}]}>
          Qty:1
        </Text>
        {item.price && (
          <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
            (£{(1* item.price).toFixed(2)})
          </Text>
        )}
      </ View>}
      </View>

      {/* Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setImageModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setImageModalVisible(false)}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
            {item.photoUri && (
              <Image
                source={{ uri: item.photoUri }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
          </View>
        </Pressable>
      </Modal>

      {/* Edit icon - Top Right */}
      <TouchableOpacity
        onPress={onEdit}
        style={[styles.editButton, { pointerEvents: item.checked ? 'none' : 'auto' }]}
        activeOpacity={0.7}
      >
        <Ionicons name="create-outline" size={12} color={theme.colors.primary} />
      </TouchableOpacity>

      <View style={{position: 'absolute', bottom: 10, right: '40%'}}>
          {item.price && (
            <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant, paddingRight: 10 }]}>
              £{item.price.toFixed(2)}
            </Text>
          )}
        </View>

      {/* Delete icon - Bottom Right */}
      <TouchableOpacity
        onPress={onDelete}
        style={[styles.deleteButton, { pointerEvents: item.checked ? 'none' : 'auto' }]}
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={14} color={colors.error || '#FF5252'} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  QuantityContainer: {
   alignItems: 'center',
   // borderRadius: radii.md,
   bottom: spacing.xxl,
   // elevation: 3,
   height: 80,
   justifyContent: 'center',
   // overflow: 'hidden',
   left: 0,
   position: 'absolute',
   // shadowColor: '#000',
   // shadowOffset: { width: 0, height: 2 },
   // shadowOpacity: 0.15,
   // shadowRadius: 4,
   width: 80,
   zIndex: 5,
 },
  card: {
    borderRadius: radii.lg,
    elevation: 4,
    flex: 1,
    marginHorizontal: spacing.xs,
    marginVertical: spacing.sm,
    minHeight: 200,
    padding: spacing.md,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 1
  },
  categoryBadge: {
    borderRadius: radii.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    position: 'absolute',
    top: spacing.sm,
    zIndex: 10,
  },
  categoryText: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight as 500,
  },
  checkButton: {
    bottom: spacing.sm,
    left: spacing.sm,
    position: 'absolute',
    zIndex: 5,
  },
  checkCircle: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 2,
    elevation: 3,
    height: 28,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    width: 28,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    right: spacing.lg,
    top: spacing.xl,
    width: 40,
    zIndex: 10,
  },
  deleteButton: {
    alignItems: 'center',
    bottom: 2,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 2,
    width: 32,
    zIndex: 0,
  },
  // description: {
  //   fontSize: typography.bodySmall.fontSize,
  //   fontWeight: typography.bodySmall.fontWeight as 400,
  //   marginTop: spacing.xs,
  //   opacity: 0.7,
  // },
  editButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    width: 32,
    zIndex: 10
  },
  fullImage: {
    height: '80%',
    width: '90%',
  },
  imageContainer: {
    alignItems: 'center',
    borderRadius: radii.md,
    bottom: spacing.xxl,
    elevation: 3,
    height: 80,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    right: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    width: 80,
    zIndex: 5,
  },
  // infoContainer: {
  //   flex: 1,
  //   paddingTop: spacing.xs,
  // },
  // metaRow: {
  //   flexDirection: 'row',
  //   gap: spacing.sm,
  //   marginBottom: spacing.xs,
  // },
  metaText: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight as 500,
  },
  modalContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    flex: 1,
    justifyContent: 'center',
  },
  placeholderImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    height: '100%',
    width: '100%',
  },
  // title: {
  //   borderRadius: radii.sm,
  //   fontSize: typography.body.fontSize,
  //   fontWeight: typography.body.fontWeight as 600,
  //   left: spacing.sm,
  //   lineHeight: 20,
  //   maxWidth: '70%',
  //   paddingHorizontal: spacing.xs,
  //   paddingVertical: spacing.xs / 2,
  //   position: 'absolute',
  //   top: spacing.sm,
  //   zIndex: 10
  // },
 
});