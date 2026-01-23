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


export const CATEGORY_IMAGES: Record<ItemCategory, any> = {
  'fruits': require('../../assets/images/fruit.png'),
  'salad': require('../../assets/images/salad.png'),
  'dairy': require('../../assets/images/dairy.png'),
  'meat': require('../../assets/images/meat.png'),
  'fish': require('../../assets/images/fish.png'),
  'vegetables': require('../../assets/images/Vegetable.png'),
  'frozen': require('../../assets/images/fish.png'),
  'snacks': require('../../assets/images/snacks.png'),
  'beverages': require('../../assets/images/drinks.png'),
  'household care': require('../../assets/images/salad.png'),
  'health': require('../../assets/images/salad.png'),
  'pet': require('../../assets/images/salad.png'),
  'home': require('../../assets/images/salad.png'),
  'other': require('../../assets/images/salad.png'),
};

