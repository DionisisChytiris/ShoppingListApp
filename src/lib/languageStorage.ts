import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../../redux/languageSlice';

const LANGUAGE_KEY = 'APP_LANGUAGE_V1';

export async function saveLanguage(language: Language): Promise<void> {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (e) {
    console.warn('Failed to save language', e);
  }
}

export async function loadLanguage(): Promise<Language | null> {
  try {
    const language = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (language === 'en' || language === 'es' || language === 'el') {
      return language;
    }
    return null;
  } catch (e) {
    console.warn('Failed to load language', e);
    return null;
  }
}

