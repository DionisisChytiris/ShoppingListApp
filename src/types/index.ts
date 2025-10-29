export type Item = {
  id: string;
  name: string;
  price?: number;
  photoUri?: string | null;
  quantity?: number;
  checked?: boolean;
  createdAt: number;
};

export type ShoppingList = {
  id: string;
  title: string;
  createdAt: number;
  items: Item[];
};

export type RootStackParamList = {
  ListEditor: { listId: string };
};