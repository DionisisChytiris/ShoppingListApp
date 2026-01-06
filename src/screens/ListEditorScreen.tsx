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
import CircularProgress from "../components/CircularProgress";
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

  // Group items by category for display, separated into uncompleted and completed
  const { uncompletedGrouped, completedGrouped } = useMemo(() => {
    if (!list) return { uncompletedGrouped: [], completedGrouped: [] };

    const itemsToGroup = selectedCategory
      ? list.items.filter(item => item.category === selectedCategory)
      : list.items;

    // Separate by checked status
    const uncompleted: Item[] = [];
    const completed: Item[] = [];

    itemsToGroup.forEach(item => {
      if (item.checked) {
        completed.push(item);
      } else {
        uncompleted.push(item);
      }
    });

    // Group uncompleted by category
    const uncompletedGroupedByCat: Record<string, Item[]> = {};
    uncompleted.forEach(item => {
      const category = item.category || 'other';
      if (!uncompletedGroupedByCat[category]) {
        uncompletedGroupedByCat[category] = [];
      }
      uncompletedGroupedByCat[category].push(item);
    });

    // Group completed by category
    const completedGroupedByCat: Record<string, Item[]> = {};
    completed.forEach(item => {
      const category = item.category || 'other';
      if (!completedGroupedByCat[category]) {
        completedGroupedByCat[category] = [];
      }
      completedGroupedByCat[category].push(item);
    });

    // Convert to sections array for uncompleted
    const uncompletedSections = CATEGORIES.filter(cat => uncompletedGroupedByCat[cat] && uncompletedGroupedByCat[cat].length > 0)
      .map(category => ({
        title: category,
        data: uncompletedGroupedByCat[category],
      }));

    if (uncompletedGroupedByCat['other'] && uncompletedGroupedByCat['other'].length > 0) {
      const otherIndex = uncompletedSections.findIndex(s => s.title === 'other');
      if (otherIndex === -1) {
        uncompletedSections.push({ title: 'other', data: uncompletedGroupedByCat['other'] });
      }
    }

    // Convert to sections array for completed
    const completedSections = CATEGORIES.filter(cat => completedGroupedByCat[cat] && completedGroupedByCat[cat].length > 0)
      .map(category => ({
        title: category,
        data: completedGroupedByCat[category],
      }));

    if (completedGroupedByCat['other'] && completedGroupedByCat['other'].length > 0) {
      const otherIndex = completedSections.findIndex(s => s.title === 'other');
      if (otherIndex === -1) {
        completedSections.push({ title: 'other', data: completedGroupedByCat['other'] });
      }
    }

    return { uncompletedGrouped: uncompletedSections, completedGrouped: completedSections };
  }, [list?.items, selectedCategory]);

  // Separate items into uncompleted and completed, grouped by category (when "All" is selected)
  const { uncompletedItems, completedItems } = useMemo(() => {
    if (!list || selectedCategory !== null) return { uncompletedItems: [], completedItems: [] };

    // Separate items by checked status
    const uncompleted: Item[] = [];
    const completed: Item[] = [];

    list.items.forEach(item => {
      if (item.checked) {
        completed.push(item);
      } else {
        uncompleted.push(item);
      }
    });

    // Group uncompleted items by category
    const uncompletedGrouped: Record<string, Item[]> = {};
    uncompleted.forEach(item => {
      const category = item.category || 'other';
      if (!uncompletedGrouped[category]) {
        uncompletedGrouped[category] = [];
      }
      uncompletedGrouped[category].push(item);
    });

    // Group completed items by category
    const completedGrouped: Record<string, Item[]> = {};
    completed.forEach(item => {
      const category = item.category || 'other';
      if (!completedGrouped[category]) {
        completedGrouped[category] = [];
      }
      completedGrouped[category].push(item);
    });

    // Sort categories for uncompleted items
    const uncompletedCategories = CATEGORIES.filter(cat => uncompletedGrouped[cat] && uncompletedGrouped[cat].length > 0);
    if (uncompletedGrouped['other'] && uncompletedGrouped['other'].length > 0) {
      if (!uncompletedCategories.includes('other')) {
        uncompletedCategories.push('other');
      }
    }

    // Sort categories for completed items
    const completedCategories = CATEGORIES.filter(cat => completedGrouped[cat] && completedGrouped[cat].length > 0);
    if (completedGrouped['other'] && completedGrouped['other'].length > 0) {
      if (!completedCategories.includes('other')) {
        completedCategories.push('other');
      }
    }

    // Flatten uncompleted items maintaining category order
    const uncompletedFlat: Item[] = [];
    uncompletedCategories.forEach(category => {
      if (uncompletedGrouped[category] && uncompletedGrouped[category].length > 0) {
        uncompletedFlat.push(...uncompletedGrouped[category]);
      }
    });

    // Flatten completed items maintaining category order
    const completedFlat: Item[] = [];
    completedCategories.forEach(category => {
      if (completedGrouped[category] && completedGrouped[category].length > 0) {
        completedFlat.push(...completedGrouped[category]);
      }
    });

    return { uncompletedItems: uncompletedFlat, completedItems: completedFlat };
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
        <View>
          <Text>!</Text>
        </View>
        {totalItems > 0 && (
          <View style={styles.circularProgressContainer}>
            <CircularProgress
              progress={totalItems > 0 ? checkedCount / totalItems : 0}
              size={40}
              strokeWidth={3}
              backgroundColor={theme.colors.surfaceVariant}
              progressColor={theme.colors.primary}
            />
            <View style={styles.progressTextContainer}>
              <Text style={[styles.progressText, { color: theme.colors.onSurface }]}>
                {checkedCount}/{totalItems}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={[styles.statsBar, { backgroundColor: theme.colors.surface }]}>
        {/* {totalItems > 0 && (
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
        )} */}
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
          // When "All" is selected, render uncompleted items first, then completed items
          <>
            {/* Uncompleted Items */}
            {uncompletedItems.length > 0 && (
              <>
                <View style={[styles.sectionHeader, { backgroundColor: theme.colors.surface }]}>
                  <Text style={[styles.sectionHeaderText, { color: theme.colors.onSurface }]}>
                    Uncompleted ({uncompletedItems.length})
                  </Text>
                </View>
                <View style={styles.itemsGrid}>
                  {uncompletedItems.map((item) => (
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
              </>
            )}

            {/* Completed Items */}
            {completedItems.length > 0 && (
              <>
                {uncompletedItems.length > 0 && (
                  <View style={[styles.sectionDivider, { backgroundColor: theme.colors.outline }]} />
                )}
                <View style={[styles.sectionHeader, { backgroundColor: theme.colors.surface }]}>
                  <Text style={[styles.sectionHeaderText, { color: theme.colors.onSurfaceVariant }]}>
                    Completed ({completedItems.length})
                  </Text>
                </View>
                <View style={styles.itemsGrid}>
                  {completedItems.map((item) => (
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
              </>
            )}
          </>
        ) : (
          // When a specific category is selected, render uncompleted first, then completed
          <>
            {/* Uncompleted Items */}
            {uncompletedGrouped.length > 0 && (
              <>
                <View style={[styles.sectionHeader, { backgroundColor: theme.colors.surface }]}>
                  <Text style={[styles.sectionHeaderText, { color: theme.colors.onSurface }]}>
                    Uncompleted
                  </Text>
                </View>
                {uncompletedGrouped.map((section) => (
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
                ))}
              </>
            )}

            {/* Completed Items */}
            {completedGrouped.length > 0 && (
              <>
                {uncompletedGrouped.length > 0 && (
                  <View style={[styles.sectionDivider, { backgroundColor: theme.colors.outline }]} />
                )}
                <View style={[styles.sectionHeader, { backgroundColor: theme.colors.surface }]}>
                  <Text style={[styles.sectionHeaderText, { color: theme.colors.onSurfaceVariant }]}>
                    Completed
                  </Text>
                </View>
                {completedGrouped.map((section) => (
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
                ))}
              </>
            )}
          </>
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
  circularProgressContainer: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    position: "relative",
    width: 40,
  },
  progressTextContainer: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  progressText: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight as 600,
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
  sectionHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionHeaderText: {
    fontSize: typography.heading3.fontSize,
    fontWeight: typography.heading3.fontWeight as 600,
  },
  sectionDivider: {
    height: 1,
    marginVertical: spacing.md,
    marginHorizontal: spacing.md,
  },
});

