import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../lib/theme';
import { useTheme } from '../lib/themeContext';
import PhotoPicker from '../components/PhotoPicker';
import { Item } from '../types';
import { itemInputSchema, validateForm, getFieldError } from '../lib/validation';
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS, type ItemCategory } from '../lib/categories';

/* eslint-disable react-native/no-inline-styles */

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (item: Omit<Item, 'id' | 'createdAt'>) => void;
  editingItem?: Item | null;
}

export default function AddItemModal({ visible, onClose, onSave, editingItem }: AddItemModalProps) {
  const { theme } = useTheme();
  
  useEffect(() => {
    if (visible) {
      console.log('AddItemModal: Modal should be visible now');
    }
  }, [visible]);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [category, setCategory] = useState<ItemCategory | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nameInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setDescription(editingItem.description ?? '');
      setPrice(editingItem.price ? String(editingItem.price) : '');
      setQuantity(editingItem.quantity ? String(editingItem.quantity) : '1');
      setPhoto(editingItem.photoUri ?? null);
      setCategory(editingItem.category);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setQuantity('1');
      setPhoto(null);
      setCategory(undefined);
    }
    // Clear errors when modal opens/closes or editing item changes
    setErrors({});
  }, [editingItem, visible]);

  const handleSave = () => {
    // Prepare data for validation
    const formData = {
      name,
      category: category,
      description: description || undefined,
      price: price || undefined,
      photoUri: photo,
      quantity: quantity || '1',
      checked: editingItem?.checked ?? false,
    };

    // Validate with Zod
    const validation = validateForm(itemInputSchema, formData);

    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    // Clear errors and transform data
    setErrors({});
    const transformedData = {
      name: validation.data.name,
      category: validation.data.category,
      description: validation.data.description || undefined,
      price:
        validation.data.price && validation.data.price.trim() !== ''
          ? (() => {
              const num = parseFloat(validation.data.price);
              return isNaN(num) ? undefined : num;
            })()
          : undefined,
      photoUri: validation.data.photoUri,
      quantity: validation.data.quantity,
      checked: validation.data.checked ?? false,
    };
    onSave(transformedData);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setPrice('');
    setQuantity('1');
    setPhoto(null);
    setCategory(undefined);
    setErrors({});
    onClose();
  };

  const handleReset = () => {
    setName('');
    setDescription('');
    setPrice('');
    setQuantity('1');
    setPhoto(null);
    setCategory(undefined);
    setErrors({});
  };

  return (
    <Modal 
      transparent 
      visible={visible} 
      animationType="slide" 
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <Pressable 
        style={styles.overlay}
        onPress={() => {
          Keyboard.dismiss();
          handleClose();
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
          style={{ justifyContent: 'flex-end', flex: 1, width: '100%' }}
          pointerEvents="box-none"
          >
          <Pressable 
            onPress={(e) =>{e.stopPropagation(), handleClose()}}
            style={{ width: '100%' }}
            >
            <View style={[styles.modalContent, { backgroundColor: theme.colors.surface, width: '100%' }]}>
            <SafeAreaView edges={['bottom']} style={styles.safeArea}>
              {/* Handle bar */}
              <View style={[styles.handleBar, { backgroundColor: theme.colors.outline }]} />
              {editingItem && (
                <View style={styles.editingBadge}>
                  {/* <View style={[styles.editingBadge, { backgroundColor: theme.colors.primaryLight }]}> */}
                  <Ionicons name="create-outline" size={16} color={theme.colors.primary} />
                  <Text style={[styles.editingText, { color: theme.colors.primary }]}>
                    Editing item
                  </Text>
                </View>
              )}
              {/* </View> */}

                {/* Actions */}
                <View style={[styles.actionsRow, { borderTopColor: theme.colors.outline }]}>
                {editingItem && (
                  <TouchableOpacity
                    onPress={handleReset}
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
                  onPress={handleSave}
                  style={[
                    styles.saveButton,
                    {
                      backgroundColor:
                        name.trim() && category
                          ? theme.colors.primary
                          : theme.colors.surfaceVariant,
                      opacity: name.trim() && category ? 1 : 0.5,
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

              {/* Category Selection - Scrollable Row */}
              <View style={styles.categorySection}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryScrollContent}
                >
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => {
                        setCategory(cat);
                        // Clear error when user selects a category
                        if (errors.category) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.category;
                            return newErrors;
                          });
                        }
                        // Focus the name input after category is selected
                        if (!editingItem && nameInputRef.current) {
                          setTimeout(() => {
                            nameInputRef.current?.focus();
                          }, 100);
                        }
                      }}
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor:
                            category === cat ? theme.colors.primary : theme.colors.surfaceVariant,
                          borderColor:
                            getFieldError(errors, 'category') && !category
                              ? theme.colors.error || '#FF5252'
                              : 'transparent',
                          borderWidth: getFieldError(errors, 'category') && !category ? 1 : 0,
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={CATEGORY_ICONS[cat] as keyof typeof Ionicons.glyphMap}
                        size={16}
                        color={category === cat ? colors.onPrimary : theme.colors.onSurfaceVariant}
                        style={styles.categoryIcon}
                      />
                      <Text
                        style={[
                          styles.categoryChipText,
                          {
                            color:
                              category === cat ? colors.onPrimary : theme.colors.onSurfaceVariant,
                          },
                        ]}
                      >
                        {CATEGORY_LABELS[cat]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                {getFieldError(errors, 'category') && (
                  <Text
                    style={[styles.categoryErrorText, { color: theme.colors.error || '#FF5252' }]}
                  >
                    {getFieldError(errors, 'category')}
                  </Text>
                )}
              </View>

              {/* Content */}
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
              >
                <View style={styles.inputSection}>
                  <View style={styles.inputRow}>
                    <View style={{ flex: 1 }}>
                      <View
                        style={[
                          styles.inputWrapper,
                          {
                            backgroundColor: theme.colors.surfaceVariant,
                            borderColor: getFieldError(errors, 'name')
                              ? theme.colors.error || '#FF5252'
                              : 'transparent',
                            borderWidth: getFieldError(errors, 'name') ? 1 : 0,
                          },
                        ]}
                      >
                        <Ionicons
                          name="pricetag-outline"
                          size={18}
                          color={theme.colors.onSurfaceVariant}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          ref={nameInputRef}
                          placeholder="Item name"
                          placeholderTextColor={theme.colors.onSurfaceVariant}
                          value={name}
                          onChangeText={(text) => {
                            setName(text);
                            // Clear error when user starts typing
                            if (errors.name) {
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.name;
                                return newErrors;
                              });
                            }
                          }}
                          style={[styles.input, { color: theme.colors.onSurface }]}
                          returnKeyType="next"
                          editable={!!category}
                        />
                      </View>
                      {getFieldError(errors, 'name') && (
                        <Text
                          style={[styles.errorText, { color: theme.colors.error || '#FF5252' }]}
                        >
                          {getFieldError(errors, 'name')}
                        </Text>
                      )}
                    </View>
                    <View style={{ width: 100 }}>
                      <View
                        style={[
                          styles.priceInputWrapper,
                          {
                            backgroundColor: theme.colors.surfaceVariant,
                            borderColor: getFieldError(errors, 'price')
                              ? theme.colors.error || '#FF5252'
                              : 'transparent',
                            borderWidth: getFieldError(errors, 'price') ? 1 : 0,
                          },
                        ]}
                      >
                        <Ionicons
                          name="cash-outline"
                          size={18}
                          color={theme.colors.onSurfaceVariant}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          placeholder="0.00"
                          placeholderTextColor={theme.colors.onSurfaceVariant}
                          keyboardType="decimal-pad"
                          value={price}
                          onChangeText={(text) => {
                            setPrice(text);
                            // Clear error when user starts typing
                            if (errors.price) {
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.price;
                                return newErrors;
                              });
                            }
                          }}
                          style={[styles.priceInput, { color: theme.colors.onSurface }]}
                          returnKeyType="next"
                          editable={!!category}
                        />
                      </View>
                      {getFieldError(errors, 'price') && (
                        <Text
                          style={[styles.errorText, { color: theme.colors.error || '#FF5252' }]}
                        >
                          {getFieldError(errors, 'price')}
                        </Text>
                      )}
                    </View>
                    <View style={{ width: 80 }}>
                      <View
                        style={[
                          styles.priceInputWrapper,
                          {
                            backgroundColor: theme.colors.surfaceVariant,
                            borderColor: getFieldError(errors, 'quantity')
                              ? theme.colors.error || '#FF5252'
                              : 'transparent',
                            borderWidth: getFieldError(errors, 'quantity') ? 1 : 0,
                          },
                        ]}
                      >
                        <Ionicons
                          name="cube-outline"
                          size={18}
                          color={theme.colors.onSurfaceVariant}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          placeholder="1"
                          placeholderTextColor={theme.colors.onSurfaceVariant}
                          keyboardType="number-pad"
                          value={quantity}
                          onChangeText={(text) => {
                            // Only allow positive integers
                            const cleaned = text.replace(/[^0-9]/g, '');
                            setQuantity(cleaned);
                            // Clear error when user starts typing
                            if (errors.quantity) {
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.quantity;
                                return newErrors;
                              });
                            }
                          }}
                          style={[styles.priceInput, { color: theme.colors.onSurface }]}
                          returnKeyType="next"
                          editable={!!category}
                        />
                      </View>
                      {getFieldError(errors, 'quantity') && (
                        <Text
                          style={[styles.errorText, { color: theme.colors.error || '#FF5252' }]}
                        >
                          {getFieldError(errors, 'quantity')}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* <View>
                    <View
                      style={[
                        styles.descriptionWrapper,
                        {
                          backgroundColor: theme.colors.surfaceVariant,
                          borderColor: getFieldError(errors, 'description')
                            ? theme.colors.error || '#FF5252'
                            : 'transparent',
                          borderWidth: getFieldError(errors, 'description') ? 1 : 0,
                        },
                      ]}
                    >
                      <Ionicons
                        name="document-text-outline"
                        size={18}
                        color={theme.colors.onSurfaceVariant}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        placeholder="Description (optional)"
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        value={description}
                        onChangeText={(text) => {
                          setDescription(text);
                          // Clear error when user starts typing
                          if (errors.description) {
                            setErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.description;
                              return newErrors;
                            });
                          }
                        }}
                        multiline
                        numberOfLines={2}
                        style={[styles.descriptionInput, { color: theme.colors.onSurface }]}
                        textAlignVertical="top"
                        editable={!!category}
                      />
                    </View>
                    {getFieldError(errors, 'description') && (
                      <Text style={[styles.errorText, { color: theme.colors.error || '#FF5252' }]}>
                        {getFieldError(errors, 'description')}
                      </Text>
                    )}
                  </View> */}

                  <PhotoPicker uri={photo ?? undefined} onChange={setPhoto} theme={theme} />
                </View>
              </ScrollView>

            
            </SafeAreaView>
          </View>
          </Pressable>
          </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  cancelButton: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  cancelButtonText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.button.fontWeight as 600,
  },
  categoryChip: {
    alignItems: 'center',
    borderRadius: 9999,
    flexDirection: 'row',
    gap: spacing.xs,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  categoryChipText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.label.fontWeight as 500,
  },
  categoryErrorText: {
    fontSize: typography.bodySmall.fontSize,
    marginLeft: spacing.xs,
    marginTop: spacing.xs,
  },
  categoryIcon: {
    marginRight: 0,
  },
  categoryScrollContent: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  categorySection: {
    borderBottomColor: colors.outline,
    borderBottomWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  descriptionInput: {
    flex: 1,
    fontSize: typography.bodySmall.fontSize,
    minHeight: 40,
    paddingVertical: spacing.xs,
    textAlignVertical: 'top',
  },
  descriptionWrapper: {
    alignItems: 'flex-start',
    borderRadius: radii.md,
    flexDirection: 'row',
    minHeight: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  editingBadge: {
    alignItems: 'center',
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  editingText: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight as 500,
  },
  errorText: {
    fontSize: typography.bodySmall.fontSize,
    marginLeft: spacing.md,
    marginTop: spacing.xs,
  },
  handleBar: {
    alignSelf: 'center',
    borderRadius: 2,
    height: 4,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
    width: 40,
  },
  input: {
    flex: 1,
    fontSize: typography.body.fontSize,
    paddingVertical: spacing.sm,
  },
  inputIcon: {
    marginRight: spacing.xs,
  },
  
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  inputSection: {
    gap: spacing.md,
  },
  inputWrapper: {
    alignItems: 'center',
    borderRadius: radii.md,
    flex: 1,
    flexDirection: 'row',
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  modalContent: {
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    elevation: 20,
    maxHeight: '90%',
    minHeight: 380,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
  },
  priceInput: {
    flex: 1,
    fontSize: typography.body.fontSize,
    paddingVertical: spacing.sm,
  },
  priceInputWrapper: {
    alignItems: 'center',
    borderRadius: radii.md,
    flexDirection: 'row',
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  safeArea: {
    flex: 1,
  },
  saveButton: {
    alignItems: 'center',
    borderRadius: radii.md,
    elevation: 4,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    minWidth: 120,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  saveButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight as 600,
  },
  scrollContent: {
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
});
