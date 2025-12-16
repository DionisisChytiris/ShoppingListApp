import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector, useAppDispatch } from "../hooks/index";
import {
  addItem,
  updateItem,
  deleteItem,
  toggleItemChecked,
  updateListTitle,
} from "../../redux/listsSlice";
import ItemRow from "../components/ItemRow";
import PhotoPicker from "../components/PhotoPicker";
import { uid } from "../lib/uid";
import { colors, spacing, type, radii } from "../lib/theme";
import { Item, ShoppingList } from "../types/index";
import { useTheme } from "../lib/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { formatDateTime } from "../lib/dateUtils";

export default function ListEditorScreen({ route, navigation }: any) {
  const { listId } = route.params;
  const list:ShoppingList| any = useAppSelector((s) =>
    s.lists.lists.find((l) => l.id === listId)
  );
  const dispatch = useAppDispatch();
  const { theme } = useTheme();

  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [title, setTitle] = useState(list?.title ?? "");

  // keep title in sync when list loads
  React.useEffect(() => {
    setTitle(list?.title ?? "");
  }, [list?.title]);

  if (!list) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { 
            justifyContent: "center", 
            alignItems: "center",
            backgroundColor: theme.backgroundColor 
          },
        ]}
      >
        <Text style={{ color: theme.colors.onSurface }}>List not found</Text>
      </SafeAreaView>
    );
  }

  const checkedCount = list.items.filter((i: Item) => i.checked).length;
  const totalItems = list.items.length;

  function beginAdd() {
    setEditingItem(null);
    setName("");
    setPrice("");
    setPhoto(null);
  }

  function beginEdit(item: Item) {
    setEditingItem(item);
    setName(item.name);
    setPrice(item.price ? String(item.price) : "");
    setPhoto(item.photoUri ?? null);
  }

  function onSaveItem() {
    if (!name.trim()) return;
    if (editingItem) {
      const updated: Item = {
        ...editingItem,
        name: name.trim(),
        price: price ? Number(price) : undefined,
        photoUri: photo,
        createdAt: editingItem.createdAt,
      };
      dispatch(updateItem({ listId: list.id, item: updated }));
    } else {
      const newItem: Item = {
        id: uid("item_"),
        name: name.trim(),
        price: price ? Number(price) : undefined,
        photoUri: photo,
        quantity: 1,
        checked: false,
        createdAt: Date.now(),
      };
      dispatch(addItem({ listId: list.id, item: newItem }));
    }
    setName("");
    setPrice("");
    setPhoto(null);
    setEditingItem(null);
  }

  function onDeleteItem(itemId: string) {
    Alert.alert("Delete item", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => dispatch(deleteItem({ listId: list.id, itemId })),
      },
    ]);
  }

  function onSaveTitle() {
    if (title.trim() && title !== list.title) {
      dispatch(updateListTitle({ id: list.id, title: title.trim() }));
    }
    navigation.goBack();
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.outline }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.backButton, { backgroundColor: theme.colors.surfaceVariant }]}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={[styles.titleInput, { color: theme.colors.onSurface }]}
          placeholder="List name"
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />
        <TouchableOpacity 
          onPress={onSaveTitle} 
          style={[styles.doneButton, { backgroundColor: theme.colors.primary }]}
          activeOpacity={0.8}
        >
          <Text style={[styles.doneButtonText, { color: colors.onPrimary }]}>Done</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.statsBar, { backgroundColor: theme.colors.surface }]}>
        {totalItems > 0 && (
          <>
            <Text style={[styles.statsText, { color: theme.colors.onSurfaceVariant }]}>
              {checkedCount} of {totalItems} items completed
            </Text>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(checkedCount / totalItems) * 100}%`,
                    backgroundColor: theme.colors.primary 
                  }
                ]} 
              />
            </View>
          </>
        )}
        <Text style={[styles.dateText, { color: theme.colors.onSurfaceVariant }]}>
          Created {formatDateTime(list.createdAt)}
        </Text>
      </View>

      <FlatList
        data={list.items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <ItemRow
            item={item}
            onToggle={() =>
              dispatch(toggleItemChecked({ listId: list.id, itemId: item.id }))
            }
            onEdit={() => beginEdit(item)}
            onDelete={() => onDeleteItem(item.id)}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          list.items.length === 0 && styles.emptyListContent
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={[styles.emptyIconContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Ionicons name="cart-outline" size={48} color={theme.colors.onSurfaceVariant} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
              No items yet
            </Text>
            <Text style={[styles.emptyDescription, { color: theme.colors.onSurfaceVariant }]}>
              Add items to your shopping list below
            </Text>
          </View>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={[styles.editor, { 
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline 
        }]}>
          {editingItem && (
            <View style={[styles.editingBadge, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="create-outline" size={16} color={theme.colors.primary} />
              <Text style={[styles.editingText, { color: theme.colors.primary }]}>
                Editing item
              </Text>
            </View>
          )}
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <TextInput
                placeholder="Item name"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={name}
                onChangeText={setName}
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme.colors.surfaceVariant,
                    color: theme.colors.onSurface 
                  }
                ]}
              />
              <TextInput
                placeholder="Price"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                keyboardType="decimal-pad"
                value={price}
                onChangeText={setPrice}
                style={[
                  styles.priceInput,
                  { 
                    backgroundColor: theme.colors.surfaceVariant,
                    color: theme.colors.onSurface 
                  }
                ]}
              />
            </View>
            <PhotoPicker uri={photo ?? undefined} onChange={setPhoto} />
          </View>

          <View style={styles.actionsRight}>
            {editingItem && (
              <TouchableOpacity 
                onPress={beginAdd} 
                style={[styles.smallButton, { backgroundColor: theme.colors.surfaceVariant }]}
                activeOpacity={0.7}
              >
                <Text style={{ color: theme.colors.primary }}>New</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onSaveItem}
              style={[
                styles.saveButton,
                { backgroundColor: theme.colors.primary },
              ]}
              activeOpacity={0.8}
              disabled={!name.trim()}
            >
              <Ionicons 
                name={editingItem ? "checkmark" : "add"} 
                size={20} 
                color={colors.onPrimary} 
              />
              <Text style={[styles.saveButtonText, { color: colors.onPrimary }]}>
                {editingItem ? "Save" : "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radii.sm,
  },
  titleInput: {
    fontSize: type.header,
    fontWeight: "700",
    flex: 1,
  },
  doneButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    minWidth: 60,
    alignItems: "center",
  },
  doneButtonText: {
    fontSize: type.button,
    fontWeight: "600",
  },
  statsBar: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  statsText: {
    fontSize: type.small,
    marginBottom: spacing.xs,
    fontWeight: "500",
  },
  dateText: {
    fontSize: type.small,
    marginTop: spacing.xs,
    opacity: 0.7,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xl * 2,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  emptyDescription: {
    fontSize: type.body,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
  },
  editor: {
    padding: spacing.lg,
    borderTopWidth: 1,
    gap: spacing.md,
  },
  editingBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
    gap: spacing.xs,
  },
  editingText: {
    fontSize: type.small,
    fontWeight: "600",
  },
  inputContainer: {
    flex: 1,
    gap: spacing.sm,
  },
  inputRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radii.md,
    fontSize: type.body,
  },
  priceInput: {
    width: 100,
    padding: spacing.md,
    borderRadius: radii.md,
    fontSize: type.body,
  },
  actionsRight: {
    alignItems: "flex-end",
    gap: spacing.sm,
  },
  smallButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    minWidth: 70,
    alignItems: "center",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    gap: spacing.xs,
    minWidth: 100,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: type.button,
    fontWeight: "600",
  },
});
