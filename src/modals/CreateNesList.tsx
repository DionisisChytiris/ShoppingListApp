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

type NavigationProp = StackNavigationProp<RootStackParamList, "ListEditor">;

interface CreateListModalProps {
  visible: boolean;
  onCancel: () => void;
}



const CreateListModal: React.FC<CreateListModalProps> = ({ visible, onCancel }) => {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();

  const onCreate = () => {
    if (!title.trim()) return;

    const newList = {
      id: uid("list_"),
      title: title.trim(),
      createdAt: Date.now(),
      items: [],
      isFavorite: false,
    };

    dispatch(addList(newList));
    setTitle("");
    onCancel(); // close modal
    (navigation as any).navigate("ListEditor", { listId: newList.id });
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
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
                onChangeText={setTitle}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    color: theme.colors.onSurface,
                    borderColor: title.trim()
                      ? theme.colors.primary
                      : theme.colors.border,
                  }
                ]}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={onCreate}
              />
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
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: radii.lg,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: "center",
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSizes.body,
    textAlign: "center",
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  input: {
    borderWidth: 2,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: fontSizes.body,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
  },
  cancelText: {
    fontSize: typography.button.fontSize,
    fontWeight: "600",
  },
  createButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    gap: spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createText: {
    fontSize: typography.button.fontSize,
    fontWeight: "600",
  },
});
