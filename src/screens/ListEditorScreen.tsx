import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
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
import { uid } from "../lib/uid";
import AddItemModal from "../modals/AddItemModal";
import { colors, spacing, radii, typography } from "../lib/theme";
import { Item, ShoppingList } from "../types/index";
import { useTheme } from "../lib/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { formatDateTime } from "../lib/dateUtils";

export default function ListEditorScreen({ route, navigation }: any) {
  const { listId } = route.params;
  const list: ShoppingList | undefined = useAppSelector((s) =>
    s.lists.lists.find((l) => l.id === listId)
  );
  const dispatch = useAppDispatch();
  const { theme } = useTheme();

  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
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

  function openAddModal() {
    setEditingItem(null);
    setModalVisible(true);
  }

  function openEditModal(item: Item) {
    setEditingItem(item);
    setModalVisible(true);
  }

  function handleSaveItem(itemData: Omit<Item, 'id' | 'createdAt'>) {
    if (editingItem) {
      const updated: Item = {
        ...editingItem,
        ...itemData,
        createdAt: editingItem.createdAt,
      };
      dispatch(updateItem({ listId: list.id, item: updated }));
    } else {
      const newItem: Item = {
        id: uid("item_"),
        ...itemData,
        quantity: itemData.quantity ?? 1,
        checked: itemData.checked ?? false,
        createdAt: Date.now(),
      };
      dispatch(addItem({ listId: list.id, item: newItem }));
    }
    setEditingItem(null);
  }

  function handleCloseModal() {
    setModalVisible(false);
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
            onEdit={() => openEditModal(item)}
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

      {/* Add Item Button */}
      <View style={[styles.addButtonContainer, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          onPress={openAddModal}
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color={colors.onPrimary} />
          <Text style={[styles.addButtonText, { color: colors.onPrimary }]}>
            Add Item
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet Modal */}
      <AddItemModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        editingItem={editingItem}
      />
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
    fontSize: typography.heading3.fontSize,
    fontWeight: typography.heading3.fontWeight as '600',
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
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight as '600',
  },
  statsBar: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  statsText: {
    fontSize: typography.bodySmall.fontSize,
    marginBottom: spacing.xs,
    fontWeight: typography.label.fontWeight as '500',
  },
  dateText: {
    fontSize: typography.label.fontSize,
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
    fontSize: typography.body.fontSize,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
  },
  addButtonContainer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.outline,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    gap: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight as '600',
  },
});
