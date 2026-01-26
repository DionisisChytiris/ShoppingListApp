import { configureStore } from '@reduxjs/toolkit';
import listsReducer, { setLists } from '../redux/listsSlice';
import languageReducer, { setLanguage } from '../redux/languageSlice';
import authReducer from './authSlice';
import { loadLists, saveLists } from '../src/lib/storage';
import { loadLanguage, saveLanguage } from '../src/lib/languageStorage';
import { ThunkAction, Action } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    lists: listsReducer,
    language: languageReducer,
    auth: authReducer,
  },
});

// Hydrate store from AsyncStorage
(async function hydrate() {
  const data = await loadLists();
  if (data && Array.isArray(data)) {
    store.dispatch(setLists(data));
  }

  const savedLanguage = await loadLanguage();
  if (savedLanguage) {
    store.dispatch(setLanguage(savedLanguage));
  }
})();

// Subscribe to store and save on changes (debounce simple)
let saveTimer: NodeJS.Timeout | null = null;
let languageSaveTimer: NodeJS.Timeout | null = null;

store.subscribe(() => {
  // Save lists
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    // @ts-expect-error - Type assertion needed for state access
    const state = store.getState().lists.lists;
    saveLists(state);
  }, 400);

  // Save language
  if (languageSaveTimer) clearTimeout(languageSaveTimer);
  languageSaveTimer = setTimeout(() => {
    const language = store.getState().language.language;
    saveLanguage(language);
  }, 100);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export default store;