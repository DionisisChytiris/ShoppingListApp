import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
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
import { Item, ShoppingList, ItemCategory, RootStackParamList } from "../types/index";
import { useTheme } from "../lib/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { formatDateTime } from "../lib/dateUtils";
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS } from "../lib/categories";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RouteProp } from "@react-navigation/native";

type ListEditorScreenNavigationProp = StackNavigationProp<RootStackParamList, "ListEditor">;
type ListEditorScreenRouteProp = RouteProp<RootStackParamList, "ListEditor">;

type Props = {
  route: ListEditorScreenRouteProp;
  navigation: ListEditorScreenNavigationProp;
};

/* eslint-disable react-native/no-inline-styles */

export default function ListEditorScreen({ route, navigation }: Props) {
  const { listId } = route.params;
  const list: ShoppingList | undefined = useAppSelector((s) =>
    s.lists.lists.find((l) => l.id === listId)
  );
  const dispatch = useAppDispatch();
  const { theme } = useTheme();

  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState(list?.title ?? "");
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(null);

  // keep title in sync when list loads
  React.useEffect(() => {
    setTitle(list?.title ?? "");
  }, [list?.title]);

  // Group items by category for display
  const groupedItems = useMemo(() => {
    if (!list) return [];
    
    const itemsToGroup = selectedCategory
      ? list.items.filter(item => item.category === selectedCategory)
      : list.items;

    // Group by category
    const grouped: Record<string, Item[]> = {};
    itemsToGroup.forEach(item => {
      const category = item.category || 'other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });

    // Convert to sections array, ordered by CATEGORIES array
    const sections = CATEGORIES.filter(cat => grouped[cat] && grouped[cat].length > 0)
      .map(category => ({
        title: category,
        data: grouped[category],
      }));

    // Add items without category to 'other' section
    if (grouped['other'] && grouped['other'].length > 0) {
      const otherIndex = sections.findIndex(s => s.title === 'other');
      if (otherIndex === -1) {
        sections.push({ title: 'other', data: grouped['other'] });
      }
    }

    return sections;
  }, [list?.items, selectedCategory]);

  // Flatten grouped items into a single array for continuous grid display (when "All" is selected)
  const allItemsOrdered = useMemo(() => {
    if (!list || selectedCategory !== null) return [];
    
    // Group by category
    const grouped: Record<string, Item[]> = {};
    list.items.forEach(item => {
      const category = item.category || 'other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });

    // Flatten into single array while maintaining category order
    const flatItems: Item[] = [];
    CATEGORIES.forEach(category => {
      if (grouped[category] && grouped[category].length > 0) {
        flatItems.push(...grouped[category]);
      }
    });
    
    // Add items without category (other)
    if (grouped['other'] && grouped['other'].length > 0) {
      flatItems.push(...grouped['other']);
    }

    return flatItems;
  }, [list?.items, selectedCategory]);

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
    if (!list) return;
    
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
    if (!list) return;
    
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
    if (!list) return;
    
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

      {/* Category Filter Row */}
      {list.items.length > 0 && (
        <View style={[styles.categoryFilterSection, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outline }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryFilterScrollContent}
          >
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              style={[
                styles.categoryFilterChip,
                {
                  backgroundColor: selectedCategory === null
                    ? theme.colors.primary
                    : theme.colors.surfaceVariant,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryFilterChipText,
                  {
                    color: selectedCategory === null
                      ? colors.onPrimary
                      : theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {CATEGORIES.map((cat) => {
              const hasItems = list.items.some(item => item.category === cat);
              if (!hasItems) return null;
              
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.categoryFilterChip,
                    {
                      backgroundColor: selectedCategory === cat
                        ? theme.colors.primary
                        : theme.colors.surfaceVariant,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={CATEGORY_ICONS[cat] as keyof typeof Ionicons.glyphMap}
                    size={16}
                    color={selectedCategory === cat
                      ? colors.onPrimary
                      : theme.colors.onSurfaceVariant}
                    style={styles.categoryFilterIcon}
                  />
                  <Text
                    style={[
                      styles.categoryFilterChipText,
                      {
                        color: selectedCategory === cat
                          ? colors.onPrimary
                          : theme.colors.onSurfaceVariant,
                      },
                    ]}
                  >
                    {CATEGORY_LABELS[cat]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.listContent,
          list.items.length === 0 && styles.emptyListContent
        ]}
        showsVerticalScrollIndicator={false}
      >
        {list.items.length === 0 ? (
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
        ) : selectedCategory === null ? (
          // When "All" is selected, render all items in a single continuous grid (grouped by category)
          <View style={styles.itemsGrid}>
            {allItemsOrdered.map((item) => (
              <View key={item.id} style={styles.itemWrapper}>
                <ItemRow
                  item={item}
                  onToggle={() =>
                    dispatch(toggleItemChecked({ listId: list.id, itemId: item.id }))
                  }
                  onEdit={() => openEditModal(item)}
                  onDelete={() => onDeleteItem(item.id)}
                />
              </View>
            ))}
          </View>
        ) : (
          // When a specific category is selected, render only that category's items
          groupedItems.map((section) => (
            <View key={section.title}>
              <View style={styles.itemsGrid}>
                {section.data.map((item) => (
                  <View key={item.id} style={styles.itemWrapper}>
                    <ItemRow
                      item={item}
                      onToggle={() =>
                        dispatch(toggleItemChecked({ listId: list.id, itemId: item.id }))
                      }
                      onEdit={() => openEditModal(item)}
                      onDelete={() => onDeleteItem(item.id)}
                    />
                   
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Item Button */}
      <View style={[styles.addButtonContainer, { backgroundColor: 'transparent' }]}>
      {/* <View style={[styles.addButtonContainer, { backgroundColor: theme.colors.surface }]}> */}
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
  addButton: {
    alignItems: "center",
    borderRadius: radii.md,
    elevation: 4,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  addButtonContainer: {
    borderTopColor: colors.outline,
    borderTopWidth: 1,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  addButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight as React.ComponentProps<typeof Text>['style'] extends { fontWeight?: infer T } ? T : never,
  },
  backButton: {
    alignItems: "center",
    borderRadius: radii.sm,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  categoryFilterChip: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    // marginRight: spacing.sm,
  },
  categoryFilterChipText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.label.fontWeight as 500,
  },
  categoryFilterIcon: {
    marginRight: 0,
  },
  categoryFilterScrollContent: {
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  categoryFilterSection: {
    borderBottomWidth: 1,
    paddingVertical: spacing.md,
  },
  container: { backgroundColor: colors.background, flex: 1 },
  dateText: {
    fontSize: typography.label.fontSize,
    marginTop: spacing.xs,
    opacity: 0.7,
  },
  doneButton: {
    alignItems: "center",
    borderRadius: radii.md,
    minWidth: 60,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  doneButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight as 600,
  },
  emptyDescription: {
    fontSize: typography.body.fontSize,
    paddingHorizontal: spacing.xl,
    textAlign: "center",
  },
  emptyIconContainer: {
    alignItems: "center",
    borderRadius: 50,
    height: 100,
    justifyContent: "center",
    marginBottom: spacing.lg,
    width: 100,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingVertical: spacing.xl * 2,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  header: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  itemWrapper: {
    width: '50%',
    // marginBottom: spacing.sm,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // marginBottom: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  progressBar: {
    borderRadius: 2,
    height: 4,
    overflow: "hidden",
  },
  progressFill: {
    borderRadius: 2,
    height: "100%",
  },
  scrollView: {
    flex: 1,
  },
  statsBar: {
    borderBottomColor: colors.outline,
    borderBottomWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  statsText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.label.fontWeight as 500,
    marginBottom: spacing.xs,
  },
  titleInput: {
    flex: 1,
    fontSize: typography.heading3.fontSize,
    fontWeight: typography.heading3.fontWeight as 600,
  },
});
