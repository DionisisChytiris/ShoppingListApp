import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShoppingList, Item } from '../src/types';

type ListsState = {
  lists: ShoppingList[];
};

const initialState: ListsState = {
  lists: [],
};

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    setLists(state, action: PayloadAction<ShoppingList[]>) {
      state.lists = action.payload;
    },
    addList(state, action: PayloadAction<ShoppingList>) {
      state.lists.unshift(action.payload);
    },
    updateListTitle(state, action: PayloadAction<{ id: string; title: string }>) {
      const list = state.lists.find((l) => l.id === action.payload.id);
      if (list) list.title = action.payload.title;
    },
    deleteList(state, action: PayloadAction<{ id: string }>) {
      state.lists = state.lists.filter((l) => l.id !== action.payload.id);
    },
    addItem(state, action: PayloadAction<{ listId: string; item: Item }>) {
      const list = state.lists.find((l) => l.id === action.payload.listId);
      if (list) list.items.unshift(action.payload.item);
    },
    updateItem(state, action: PayloadAction<{ listId: string; item: Item }>) {
      const list = state.lists.find((l) => l.id === action.payload.listId);
      if (!list) return;
      const idx = list.items.findIndex((i) => i.id === action.payload.item.id);
      if (idx >= 0) list.items[idx] = action.payload.item;
    },
    deleteItem(state, action: PayloadAction<{ listId: string; itemId: string }>) {
      const list = state.lists.find((l) => l.id === action.payload.listId);
      if (!list) return;
      list.items = list.items.filter((i) => i.id !== action.payload.itemId);
    },
    toggleItemChecked(state, action: PayloadAction<{ listId: string; itemId: string }>) {
      const list = state.lists.find((l) => l.id === action.payload.listId);
      if (!list) return;
      const item = list.items.find((i) => i.id === action.payload.itemId);
      if (item) item.checked = !item.checked;
    },
    toggleFavorite(state, action: PayloadAction<{ id: string }>) {
      const list = state.lists.find((l) => l.id === action.payload.id);
      if (list) {
        list.isFavorite = !list.isFavorite;
      }
    },
  },
});

export const {
  setLists,
  addList,
  updateListTitle,
  deleteList,
  addItem,
  updateItem,
  deleteItem,
  toggleItemChecked,
  toggleFavorite,
} = listsSlice.actions;

export default listsSlice.reducer;