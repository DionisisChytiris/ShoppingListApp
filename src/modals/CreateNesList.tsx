import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useDispatch } from "react-redux";
// adjust import path if needed
import { uid } from "../lib/uid";
import { useNavigation } from "@react-navigation/native";
import { addList } from "../../redux/listsSlice";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

type NavigationProp = StackNavigationProp<RootStackParamList, "ListEditor">;

interface CreateListModalProps {
  visible: boolean;
  onCancel: () => void;
}



const CreateListModal: React.FC<CreateListModalProps> = ({ visible, onCancel })=> {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();

  const onCreate = () => {
    if (!title.trim()) return;

    const newList = {
      id: uid("list_"),
      title: title.trim(),
      createdAt: Date.now(),
      items: [],
    };

    dispatch(addList(newList));
    setTitle("");
    onCancel(); // close modal
    navigation.navigate("ListEditor", { listId: newList.id });
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Create New List</Text>

          <View style={styles.createRow}>
            <TextInput
              placeholder="List title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TouchableOpacity onPress={onCreate} style={styles.createConfirm}>
              <Text style={styles.createText}>Create</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default CreateListModal

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "85%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  createRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  createConfirm: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createText: {
    color: "white",
    fontWeight: "600",
  },
  cancelBtn: {
    alignSelf: "center",
    marginTop: 5,
  },
  cancelText: {
    color: "#888",
  },
});
