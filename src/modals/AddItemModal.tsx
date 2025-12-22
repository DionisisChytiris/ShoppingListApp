import React, { useState, useEffect } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, radii, typography } from "../lib/theme";
import { useTheme } from "../lib/themeContext";
import PhotoPicker from "../components/PhotoPicker";
import { Item } from "../types";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (item: Omit<Item, 'id' | 'createdAt'>) => void;
  editingItem?: Item | null;
}

export default function AddItemModal({
  visible,
  onClose,
  onSave,
  editingItem,
}: AddItemModalProps) {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setDescription(editingItem.description ?? "");
      setPrice(editingItem.price ? String(editingItem.price) : "");
      setPhoto(editingItem.photoUri ?? null);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setPhoto(null);
    }
  }, [editingItem, visible]);

  const handleSave = () => {
    if (!name.trim()) return;

    const itemData = {
      name: name.trim(),
      description: description.trim() || undefined,
      price: price ? Number(price) : undefined,
      photoUri: photo,
      quantity: editingItem?.quantity ?? 1,
      checked: editingItem?.checked ?? false,
    };

    onSave(itemData);
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setPrice("");
    setPhoto(null);
    onClose();
  };

  const handleReset = () => {
    setName("");
    setDescription("");
    setPrice("");
    setPhoto(null);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <SafeAreaView edges={['bottom']} style={styles.safeArea}>
              {/* Handle bar */}
              <View style={[styles.handleBar, { backgroundColor: theme.colors.outline }]} />

              {/* Header */}
              <View style={styles.header}>
                {editingItem && (
                  <View style={[styles.editingBadge, { backgroundColor: theme.colors.primaryLight }]}>
                    <Ionicons name="create-outline" size={16} color={theme.colors.primary} />
                    <Text style={[styles.editingText, { color: theme.colors.primary }]}>
                      Editing item
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={handleClose}
                  style={[styles.closeButton, { backgroundColor: theme.colors.surfaceVariant }]}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={20} color={theme.colors.onSurface} />
                </TouchableOpacity>
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
                    <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surfaceVariant }]}>
                      <Ionicons
                        name="pricetag-outline"
                        size={18}
                        color={theme.colors.onSurfaceVariant}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        placeholder="Item name"
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        value={name}
                        onChangeText={setName}
                        style={[styles.input, { color: theme.colors.onSurface }]}
                        autoFocus={!editingItem}
                        returnKeyType="next"
                      />
                    </View>
                    <View style={[styles.priceInputWrapper, { backgroundColor: theme.colors.surfaceVariant }]}>
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
                        onChangeText={setPrice}
                        style={[styles.priceInput, { color: theme.colors.onSurface }]}
                        returnKeyType="next"
                      />
                    </View>
                  </View>

                  <View style={[styles.descriptionWrapper, { backgroundColor: theme.colors.surfaceVariant }]}>
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
                      onChangeText={setDescription}
                      multiline
                      numberOfLines={2}
                      style={[styles.descriptionInput, { color: theme.colors.onSurface }]}
                      textAlignVertical="top"
                    />
                  </View>

                  <PhotoPicker uri={photo ?? undefined} onChange={setPhoto} theme={theme} />
                </View>
              </ScrollView>

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
                    <Ionicons name="refresh-outline" size={18} color={theme.colors.onSurfaceVariant} />
                    <Text style={[styles.cancelButtonText, { color: theme.colors.onSurfaceVariant }]}>
                      New
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={handleSave}
                  style={[
                    styles.saveButton,
                    {
                      backgroundColor: name.trim() ? theme.colors.primary : theme.colors.surfaceVariant,
                      opacity: name.trim() ? 1 : 0.5,
                    },
                  ]}
                  activeOpacity={0.8}
                  disabled={!name.trim()}
                >
                  <MaterialIcons
                    name={editingItem ? "check-circle" : "add-circle"}
                    size={20}
                    color={name.trim() ? colors.onPrimary : theme.colors.onSurfaceVariant}
                  />
                  <Text
                    style={[
                      styles.saveButtonText,
                      { color: name.trim() ? colors.onPrimary : theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {editingItem ? "Save Item" : "Add Item"}
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    maxHeight: "90%",
    minHeight: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 20,
  },
  safeArea: {
    flex: 1,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 60,
  },
  editingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
    gap: spacing.xs,
  },
  editingText: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight as "500",
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radii.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  inputSection: {
    gap: spacing.md,
  },
  inputRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    minHeight: 52,
  },
  priceInputWrapper: {
    width: 120,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    minHeight: 52,
  },
  inputIcon: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: typography.body.fontSize,
    paddingVertical: spacing.sm,
  },
  priceInput: {
    flex: 1,
    fontSize: typography.body.fontSize,
    paddingVertical: spacing.sm,
  },
  descriptionWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    minHeight: 52,
  },
  descriptionInput: {
    flex: 1,
    fontSize: typography.bodySmall.fontSize,
    paddingVertical: spacing.xs,
    minHeight: 40,
    textAlignVertical: "top",
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.xs,
  },
  cancelButtonText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.button.fontWeight as "600",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    gap: spacing.xs,
    minWidth: 120,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight as "600",
  },
});

