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
import { addList, deleteList, updateListTitle } from "../../redux/listsSlice";
import { ShoppingList } from "../types/index";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, type, radii } from "../lib/theme";
import { uid } from "../lib/uid";
import CreateListModal from "../modals/CreateNesList";
import { useTheme } from "../lib/themeContext";

import { MaterialIcons } from "@expo/vector-icons";

const ListsScreen = ({ navigation }: any) => {
  const lists = useAppSelector((s) => s.lists.lists);
  const dispatch = useAppDispatch();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useTheme();

  const onCreate = () => {
    if (!title.trim()) return;
    const newList: ShoppingList = {
      id: uid("list_"),
      title: title.trim(),
      createdAt: Date.now(),
      items: [],
    };
    dispatch(addList(newList));
    setTitle("");
    setCreating(false);
    navigation.navigate("ListEditor", { listId: newList.id });
  };

  const onDelete = (id: string) => {
    Alert.alert("Delete list", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => dispatch(deleteList({ id })),
      },
    ]);
  };

  const renderItem = ({ item }: { item: ShoppingList }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ListEditor", { listId: item.id })}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>{item.items.length} items</Text>
        </View>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.icon}>
          <MaterialIcons name="delete" size={20} color={colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={["top"]} style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate("Settings" as never)}
      >
        <Ionicons
          name="settings-outline"
          size={24}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
      <View style={{ padding: 20, alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold",color: theme.colors.onSurface }}>
          Shopping Helper
        </Text>
        <Text style={{ fontSize: 14, marginTop: 6, color: theme.colors.onSurfaceVariant }}>0 lists</Text>
      </View>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, {color: theme.colors.onSurfaceVariant} ]}>Create New List</Text>
        <TouchableOpacity
          // onPress={() => setCreating((c) => !c)}
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
        >
          <MaterialIcons name="add" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>

      <CreateListModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
      />

      {creating ? (
        <View style={styles.createRow}>
          <TextInput
            placeholder="List title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TouchableOpacity onPress={onCreate} style={styles.createConfirm}>
            <Text style={{ color: colors.onPrimary }}>Create</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        data={lists}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: spacing.md }}
        ListEmptyComponent={
          <Text style={{ padding: spacing.md, color: colors.muted }}>
            You have no lists yet.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default ListsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  settingsButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
  },
  headerTitle: { fontSize: type.header, fontWeight: "700" },
  addButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: radii.md,
  },
  createRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radii.sm,
    marginRight: 8,
  },
  createConfirm: {
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: radii.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  title: { fontSize: type.title, fontWeight: "600" },
  meta: { color: colors.muted, marginTop: 4 },
  icon: { marginLeft: 8 },
});
