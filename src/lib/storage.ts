import AsyncStorage from '@react-native-async-storage/async-storage';

const LISTS_KEY = 'SHOPPING_LISTS_V1';

export async function saveLists(value: unknown) {
  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(LISTS_KEY, json);
  } catch (e) {
    console.warn('Failed to save lists', e);
  }
}

export async function loadLists(): Promise<unknown | null> {
  try {
    const json = await AsyncStorage.getItem(LISTS_KEY);
    if (!json) return null;
    return JSON.parse(json);
  } catch (e) {
    console.warn('Failed to load lists', e);
    return null;
  }
}