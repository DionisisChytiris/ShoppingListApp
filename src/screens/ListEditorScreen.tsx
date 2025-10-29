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

export default function ListEditorScreen({ route, navigation }: any) {
  const { listId } = route.params;
  const list:ShoppingList| any = useAppSelector((s) =>
    s.lists.lists.find((l) => l.id === listId)
  );
  const dispatch = useAppDispatch();

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
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>List not found</Text>
      </SafeAreaView>
    );
  }

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={styles.titleInput}
        />
        <TouchableOpacity onPress={onSaveTitle} style={styles.closeButton}>
          <Text style={{ color: colors.onPrimary }}>Done</Text>
        </TouchableOpacity>
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
        contentContainerStyle={{ padding: spacing.md }}
        ListEmptyComponent={
          <Text style={{ padding: spacing.md, color: colors.muted }}>
            No items yet — add one below.
          </Text>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.editor}>
          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="Item name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Price"
              keyboardType="decimal-pad"
              value={price}
              onChangeText={setPrice}
              style={[styles.input, { marginTop: 8 }]}
            />
            <PhotoPicker uri={photo ?? undefined} onChange={setPhoto} />
          </View>

          <View style={styles.actionsRight}>
            <TouchableOpacity onPress={beginAdd} style={styles.smallButton}>
              <Text style={{ color: colors.primary }}>New</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSaveItem}
              style={[
                styles.smallButton,
                { backgroundColor: colors.primary, marginTop: 8 },
              ]}
            >
              <Text style={{ color: colors.onPrimary }}>
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
    justifyContent: "space-between",
    padding: spacing.md,
  },
  titleInput: {
    fontSize: type.header,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  closeButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: radii.md,
  },
  editor: {
    flexDirection: "row",
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.outline,
    backgroundColor: colors.surface,
  },
  input: {
    backgroundColor: colors.surfaceVariant,
    padding: spacing.sm,
    borderRadius: radii.sm,
  },
  actionsRight: {
    width: 84,
    justifyContent: "center",
    alignItems: "flex-end",
    marginLeft: 8,
  },
  smallButton: {
    padding: 10,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    minWidth: 64,
    alignItems: "center",
  },
});
