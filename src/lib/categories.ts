import type { ItemCategory } from '../types';

export type { ItemCategory };

export const CATEGORIES: ItemCategory[] = [
  'fruits',
  'salad',
  'vegetables',
  'dairy',
  'meat',
  'fish',
  'frozen',
  'snacks',
  'beverages',
  'household care',
  'health',
  'pet',
  'home',
  'other',
];

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  'fruits': 'Fruits',
  'salad': 'Salad',
  'dairy': 'Dairy',
  'meat': 'Meat',
  'fish': 'Fish',
  'vegetables': 'Vegetables',
  'frozen': 'Frozen',
  'snacks': 'Snacks',
  'beverages': 'Beverages',
  'household care': 'Household Care',
  'health': 'Health',
  'pet': 'Pet',
  'home': 'Home',
  'other': 'Other',
};

export const CATEGORY_ICONS: Record<ItemCategory, string> = {
  'fruits': 'flower-outline',
  'salad': 'leaf-outline',
  'dairy': 'water-outline',
  'meat': 'restaurant-outline',
  'fish': 'fish-outline',
  'vegetables': 'nutrition-outline',
  'frozen': 'snow-outline',
  'snacks': 'fast-food-outline',
  'beverages': 'wine-outline',
  'household care': 'basket-outline',
  'health': 'medical-outline',
  'pet': 'paw-outline',
  'home': 'home-outline',
  'other': 'cube-outline',
};

