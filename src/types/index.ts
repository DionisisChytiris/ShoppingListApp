export type ItemCategory = 
  | 'fruits'
  | 'salad'
  | 'dairy'
  | 'meat'
  | 'fish'
  | 'vegetables'
  | 'frozen'
  | 'snacks'
  | 'beverages'
  | 'household care'
  | 'health'
  | 'pet'
  | 'home'
  | 'other';

export type Item = {
  id: string;
  name: string;
  category?: ItemCategory;
  description?: string;
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
  isFavorite?: boolean;
};

export type RootStackParamList = {
  ListEditor: { listId: string };
};