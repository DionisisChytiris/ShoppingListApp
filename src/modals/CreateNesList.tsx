import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useDispatch } from "react-redux";
import { uid } from "../lib/uid";
import { useNavigation } from "@react-navigation/native";
import { addList } from "../../redux/listsSlice";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { colors, spacing, radii, fontSizes, typography } from "../lib/theme";
import { useTheme } from "../lib/themeContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { listTitleSchema, validateForm, getFieldError } from "../lib/validation";

/* eslint-disable react-native/no-inline-styles */

type NavigationProp = StackNavigationProp<RootStackParamList, "ListEditor">;

interface CreateListModalProps {
  visible: boolean;
  onCancel: () => void;
}



const CreateListModal: React.FC<CreateListModalProps> = ({ visible, onCancel }) => {
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();

  const onCreate = () => {
    // Validate with Zod
    const validation = validateForm(listTitleSchema, { title });

    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    // Clear errors and create list
    setErrors({});
    const newList = {
      id: uid("list_"),
      title: validation.data.title,
      createdAt: Date.now(),
      items: [],
      isFavorite: false,
    };

    dispatch(addList(newList));
    setTitle("");
    setErrors({});
    onCancel(); // close modal
    navigation.navigate("ListEditor", { listId: newList.id });
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <Pressable style={styles.overlay} onPress={onCancel}>
          <Pressable
            style={[styles.modal, { backgroundColor: theme.colors.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.header}>
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                <Ionicons name="list" size={24} color={theme.colors.primary} />
              </View>
              <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                Create New List
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                Give your shopping list a name
              </Text>
            </View>

            <View style={styles.content}>
              <TextInput
                placeholder="List title"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  // Clear error when user starts typing
                  if (errors.title) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.title;
                      return newErrors;
                    });
                  }
                }}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    color: theme.colors.onSurface,
                    borderColor: getFieldError(errors, 'title')
                      ? theme.colors.error || '#FF5252'
                      : title.trim()
                      ? theme.colors.primary
                      : theme.colors.border,
                    borderWidth: 2,
                  },
                ]}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={onCreate}
              />
              {getFieldError(errors, 'title') && (
                <Text style={[styles.errorText, { color: theme.colors.error || '#FF5252' }]}>
                  {getFieldError(errors, 'title')}
                </Text>
              )}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={onCancel}
                style={[styles.cancelButton, { backgroundColor: theme.colors.surfaceVariant }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.cancelText, { color: theme.colors.onSurface }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onCreate}
                style={[
                  styles.createButton,
                  {
                    backgroundColor: title.trim() ? theme.colors.primary : theme.colors.surfaceVariant,
                    opacity: title.trim() ? 1 : 0.5,
                  }
                ]}
                activeOpacity={0.8}
                disabled={!title.trim()}
              >
                <MaterialIcons name="add" size={20} color={title.trim() ? colors.onPrimary : theme.colors.onSurfaceVariant} />
                <Text style={[
                  styles.createText,
                  { color: title.trim() ? colors.onPrimary : theme.colors.onSurfaceVariant }
                ]}>
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default CreateListModal

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  cancelButton: {
    alignItems: "center",
    borderRadius: radii.md,
    flex: 1,
    paddingVertical: spacing.md,
  },
  cancelText: {
    fontSize: typography.button.fontSize,
    fontWeight: "600",
  },
  content: {
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  createButton: {
    alignItems: "center",
    borderRadius: radii.md,
    elevation: 3,
    flex: 1,
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
    paddingVertical: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  createText: {
    fontSize: typography.button.fontSize,
    fontWeight: "600",
  },
  errorText: {
    fontSize: fontSizes.bodySmall,
    marginLeft: spacing.xs,
    marginTop: spacing.xs,
  },
  header: {
    alignItems: "center",
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  iconContainer: {
    alignItems: "center",
    borderRadius: 32,
    height: 64,
    justifyContent: "center",
    marginBottom: spacing.md,
    width: 64,
  },
  input: {
    borderRadius: radii.md,
    borderWidth: 2,
    fontSize: fontSizes.body,
    fontWeight: "500",
    padding: spacing.md,
  },
  keyboardView: {
    flex: 1,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: radii.lg,
    elevation: 10,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    width: "90%",
  },
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
  },
  subtitle: {
    fontSize: fontSizes.body,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: spacing.xs,
    textAlign: "center",
  },
});
