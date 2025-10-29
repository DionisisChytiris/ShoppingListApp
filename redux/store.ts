import { configureStore } from '@reduxjs/toolkit';
import listsReducer, { setLists } from '../redux/listsSlice';
import { loadLists, saveLists } from '../src/lib/storage';
import { ThunkAction, Action } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    lists: listsReducer,
  },
});

// Hydrate store from AsyncStorage
(async function hydrate() {
  const data = await loadLists();
  if (data && Array.isArray(data)) {
    // @ts-ignore
    store.dispatch(setLists(data));
  }
})();

// Subscribe to store and save on changes (debounce simple)
let saveTimer: NodeJS.Timeout | null = null;
store.subscribe(() => {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    // @ts-ignore
    const state = store.getState().lists.lists;
    saveLists(state);
  }, 400);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export default store;