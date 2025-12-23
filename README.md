# Shopping List App

A modern, feature-rich shopping list application built with React Native and Expo. This app allows users to create multiple shopping lists, add items with photos and descriptions, track progress, and customize the appearance and language.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [State Management](#state-management)
- [Navigation Structure](#navigation-structure)
- [Theming System](#theming-system)
- [Internationalization (i18n)](#internationalization-i18n)
- [Data Persistence](#data-persistence)
- [Key Components](#key-components)
- [Getting Started](#getting-started)
- [Development Tools](#development-tools)

## 🛠 Tech Stack

- **Framework**: React Native with Expo (~54.0.30)
- **Language**: TypeScript (~5.9.2)
- **State Management**: Redux Toolkit (@reduxjs/toolkit)
- **Navigation**: React Navigation v7
  - `@react-navigation/native`
  - `@react-navigation/bottom-tabs`
  - `@react-navigation/native-stack`
- **Internationalization**: i18next (v24.2.0) + react-i18next (v15.1.0)
- **Storage**: AsyncStorage (@react-native-async-storage/async-storage)
- **UI Components**: 
  - Expo Image Picker (for photos)
  - React Native Safe Area Context
  - Expo Navigation Bar (Android system UI)
- **Code Quality**: ESLint + Prettier

## 🏗 Architecture Overview

The app follows a **component-based architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│           App.tsx (Root)                │
│  ┌───────────────────────────────────┐  │
│  │  Redux Provider + Theme Provider  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   NavigationContainer       │  │  │
│  │  │  ┌───────────────────────┐  │  │  │
│  │  │  │   RootNavigator       │  │  │  │
│  │  │  │  (Stack Navigator)    │  │  │  │
│  │  │  └───────────────────────┘  │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Data Flow

1. **User Action** → Component dispatches Redux action
2. **Redux Store** → Updates state via slice reducers
3. **Store Subscription** → Auto-saves to AsyncStorage (debounced)
4. **Component Re-render** → React components subscribe to Redux state
5. **UI Update** → User sees changes

## 📁 Project Structure

```
ShoppingListApp/
├── App.tsx                    # Root component with providers
├── RootNavigator.tsx          # Stack navigator (root level)
├── TabNavigator.tsx           # Bottom tab navigator
├── app.config.ts              # Expo configuration (TypeScript)
├── redux/
│   ├── store.ts              # Redux store configuration
│   ├── listsSlice.ts         # Shopping lists state management
│   └── languageSlice.ts      # Language preference state
├── src/
│   ├── screens/              # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── ListEditorScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── IntroScreen.tsx
│   │   └── Tab1-4Screen.tsx  # Placeholder tabs
│   ├── components/           # Reusable components
│   │   ├── CustomTabBar.tsx
│   │   ├── ItemRow.tsx
│   │   └── PhotoPicker.tsx
│   ├── modals/               # Modal components
│   │   ├── AddItemModal.tsx
│   │   ├── CreateNesList.tsx
│   │   ├── ThemeSelectionModal.tsx
│   │   └── LanguageSelectionModal.tsx
│   ├── lib/                  # Utilities and configurations
│   │   ├── theme.ts          # Theme definitions
│   │   ├── themeContext.tsx  # Theme context provider
│   │   ├── i18n.ts           # i18next configuration
│   │   ├── storage.ts         # AsyncStorage helpers (lists)
│   │   ├── languageStorage.ts # AsyncStorage helpers (language)
│   │   ├── dateUtils.ts      # Date formatting utilities
│   │   └── uid.ts            # Unique ID generator
│   ├── hooks/                # Custom React hooks
│   │   ├── index.ts          # Redux typed hooks
│   │   └── useTranslation.ts # Translation hook wrapper
│   ├── locales/              # Translation files
│   │   ├── en.json
│   │   ├── es.json
│   │   └── el.json
│   └── types/                # TypeScript type definitions
│       └── index.ts
└── package.json
```

## ✨ Key Features

### 1. **Shopping Lists Management**
   - Create multiple shopping lists
   - Mark lists as favorites
   - Delete lists with confirmation
   - View creation date/time
   - Track completion progress

### 2. **Items Management**
   - Add items with name, description, and price
   - Attach photos from gallery or camera
   - Check/uncheck items
   - Edit existing items
   - Delete items
   - Visual progress tracking

### 3. **Theming System**
   - 9 built-in themes: Light, Warm, Dark, Blue, Green, Purple, Pink, Ocean, Amber
   - Persistent theme selection (saved to AsyncStorage)
   - Dynamic Android navigation bar styling
   - Context-based theme provider

### 4. **Internationalization**
   - Support for 3 languages: English, Spanish, Greek
   - Redux-managed language state
   - Persistent language preference
   - Real-time language switching

### 5. **Navigation**
   - Bottom tab navigation (Home, Search, Favorites, Profile)
   - Stack navigation for detail screens
   - Custom tab bar with theme support
   - Smooth transitions

### 6. **User Experience**
   - Intro/onboarding screen
   - Empty states with helpful messages
   - Bottom sheet modals for item editing
   - Photo picker integration
   - Keyboard-aware scrolling

## 🔄 State Management

The app uses **Redux Toolkit** for state management with two main slices:

### 1. Lists Slice (`redux/listsSlice.ts`)

Manages all shopping lists and their items:

```typescript
State: {
  lists: ShoppingList[]
}

Actions:
- setLists(lists)           # Replace all lists
- addList(list)             # Add new list
- updateListTitle({id, title})
- deleteList({id})
- addItem({listId, item})
- updateItem({listId, item})
- deleteItem({listId, itemId})
- toggleItemChecked({listId, itemId})
- toggleFavorite({id})
```

### 2. Language Slice (`redux/languageSlice.ts`)

Manages the selected language:

```typescript
State: {
  language: 'en' | 'es' | 'el'
}

Actions:
- setLanguage(language)
```

### Store Configuration (`redux/store.ts`)

- **Hydration**: On app start, loads saved lists and language from AsyncStorage
- **Auto-save**: Subscribes to store changes and saves to AsyncStorage (debounced)
  - Lists: 400ms debounce
  - Language: 100ms debounce

### Typed Hooks

Custom hooks in `src/hooks/index.ts`:
- `useAppSelector` - Typed Redux selector
- `useAppDispatch` - Typed Redux dispatch

## 🧭 Navigation Structure

### Root Navigator (Stack)

```
RootNavigator
├── MainTabs (TabNavigator)
│   ├── Home
│   ├── Tab2 (Search)
│   ├── Tab3 (Favorites)
│   └── Tab4 (Profile)
├── ListEditor (Stack Screen)
└── Settings (Stack Screen)
```

### Navigation Flow

1. **App Start** → `IntroScreen` (if first launch)
2. **After Intro** → `RootNavigator` → `TabNavigator` → `HomeScreen`
3. **Create List** → Modal from `HomeScreen`
4. **Edit List** → Navigate to `ListEditorScreen` (Stack push)
5. **Settings** → Navigate to `SettingsScreen` (Stack push)

### Custom Tab Bar

`CustomTabBar.tsx` provides:
- Theme-aware styling
- Custom icons and labels
- Safe area handling
- Smooth animations

## 🎨 Theming System

### Theme Provider (`src/lib/themeContext.tsx`)

- Context-based theme management
- Loads saved theme from AsyncStorage on app start
- Provides `currentTheme` and `setTheme` function
- Exposes `theme` object via `useTheme()` hook

### Theme Structure (`src/lib/theme.ts`)

Each theme includes:
- `name`: Theme identifier
- `backgroundColor`: Main background color
- `colors`: Material Design-inspired color palette
  - `primary`, `onPrimary`
  - `surface`, `onSurface`
  - `surfaceVariant`, `onSurfaceVariant`
  - `outline`, `border`
  - `primaryLight`
- `typography`: Font sizes and weights
- `spacing`: Consistent spacing values
- `radii`: Border radius values

### Available Themes

1. **Light** - Default light theme
2. **Warm** - Warm, cozy colors
3. **Dark** - Dark mode
4. **Blue** - Blue accent theme
5. **Green** - Green accent theme
6. **Purple** - Purple accent theme
7. **Pink** - Pink accent theme
8. **Ocean** - Ocean blue theme
9. **Amber** - Amber/orange theme

### Android Navigation Bar

The app automatically styles the Android navigation bar to match the selected theme:
- Background color matches `theme.colors.surface`
- Button style (light/dark) based on theme
- Edge-to-edge disabled for consistent appearance

## 🌍 Internationalization (i18n)

### Configuration (`src/lib/i18n.ts`)

- Uses `i18next` with `react-i18next`
- Supports 3 languages: English (en), Spanish (es), Greek (el)
- Compatibility mode: `v3` (for React Native)
- Default language: English

### Translation Files

Located in `src/locales/`:
- `en.json` - English translations
- `es.json` - Spanish translations
- `el.json` - Greek translations

### Translation Structure

```json
{
  "common": { "cancel", "save", "delete", ... },
  "app": { "title", "lists", "list" },
  "home": { "mostRecent", "favorites", ... },
  "listEditor": { "listName", "addItem", ... },
  "addItemModal": { "itemName", "price", ... },
  "settings": { "title", "theme", "language", ... },
  ...
}
```

### Usage

```typescript
import { useTranslation } from '../hooks/useTranslation';

function MyComponent() {
  const { t } = useTranslation();
  
  return <Text>{t('home.mostRecent')}</Text>;
}
```

### Language Management

- Language state managed by Redux (`languageSlice`)
- Language preference persisted to AsyncStorage
- `App.tsx` syncs Redux language state with i18next
- Changing language updates UI immediately

## 💾 Data Persistence

### AsyncStorage Keys

- `'shoppingLists'` - Stores all shopping lists (JSON stringified)
- `'selectedTheme'` - Stores theme preference (string)
- `'selectedLanguage'` - Stores language preference (string)

### Storage Utilities

- `src/lib/storage.ts` - Functions for saving/loading lists
- `src/lib/languageStorage.ts` - Functions for saving/loading language

### Persistence Flow

1. **On App Start**: Store hydrates from AsyncStorage
2. **On State Change**: Store subscription triggers save (debounced)
3. **On App Restart**: Data is automatically loaded

## 🧩 Key Components

### Screens

#### `HomeScreen.tsx`
- Displays all shopping lists
- Shows most recent list
- Shows favorite lists
- Empty state with "Create List" button
- Delete list with confirmation

#### `ListEditorScreen.tsx`
- Edit list title
- Add/edit/delete items
- Check/uncheck items
- Progress tracking
- "Add Item" button opens bottom sheet modal

#### `SettingsScreen.tsx`
- Theme selection
- Language selection
- About section

#### `IntroScreen.tsx`
- Onboarding slides
- Skip/Next navigation
- Shown only on first launch

### Modals

#### `AddItemModal.tsx`
- Bottom sheet modal for adding/editing items
- Form fields: name, description, price
- Photo picker (gallery/camera)
- Save/Cancel buttons
- Keyboard-aware scrolling

#### `CreateNesList.tsx`
- Modal for creating new lists
- Text input for list name
- Create/Cancel buttons

#### `ThemeSelectionModal.tsx`
- Grid of theme options
- Visual preview of each theme
- Current theme indicator

#### `LanguageSelectionModal.tsx`
- List of available languages
- Native language names
- Flag emojis
- Current language indicator

### Components

#### `CustomTabBar.tsx`
- Custom bottom tab bar
- Theme-aware styling
- Icon and label rendering
- Safe area handling

#### `ItemRow.tsx`
- Displays individual list item
- Checkbox functionality
- Photo display
- Price and description
- Edit/delete actions

#### `PhotoPicker.tsx`
- Gallery button
- Camera button
- Photo preview
- Remove photo option

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (installed globally or via npx)
- Expo Go app on your phone (for testing)

### Installation

1. **Clone the repository** (or navigate to project directory)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   # or
   npx expo start
   ```

4. **Run on device**:
   - Scan QR code with Expo Go app (iOS/Android)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator

### Available Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Start on Android
npm run ios        # Start on iOS
npm run web        # Start on web
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint errors
npm run format     # Format code with Prettier
npm run format:check # Check code formatting
```

## 🛠 Development Tools

### ESLint

Configuration in `eslint.config.ts`:
- TypeScript support
- React and React Native rules
- Prettier integration

### Prettier

Configuration in `.prettierrc`:
- Consistent code formatting
- Integrated with ESLint

### TypeScript

- Strict type checking
- Configuration in `tsconfig.json`
- Type definitions in `src/types/`

### Code Quality

- **ESLint**: Catches errors and enforces best practices
- **Prettier**: Ensures consistent code formatting
- **TypeScript**: Provides type safety

## 📝 Important Notes

### Redux Store Hydration

The store hydrates asynchronously on app start. Components should handle the loading state if needed.

### AsyncStorage Debouncing

State changes are debounced before saving to AsyncStorage to prevent excessive writes:
- Lists: 400ms delay
- Language: 100ms delay

### Android Navigation Bar

The app explicitly disables edge-to-edge mode and sets navigation bar visibility/position for consistent theming.

### i18next Compatibility

Using `compatibilityJSON: 'v3'` for React Native compatibility. This is required for proper translation handling.

### Theme Context Loading

The `ThemeProvider` shows nothing while loading the saved theme. This prevents flash of wrong theme.

## 🔧 Customization

### Adding a New Theme

1. Add theme definition to `src/lib/theme.ts` in the `themes` object
2. Add theme option to `ThemeSelectionModal.tsx`
3. Theme will be automatically available

### Adding a New Language

1. Create new JSON file in `src/locales/` (e.g., `fr.json`)
2. Add translations following the same structure as `en.json`
3. Import and add to `resources` in `src/lib/i18n.ts`
4. Add language type to `Language` type in `redux/languageSlice.ts`
5. Add language option to `LanguageSelectionModal.tsx`

### Adding a New Screen

1. Create screen component in `src/screens/`
2. Add route to appropriate navigator (`RootNavigator.tsx` or `TabNavigator.tsx`)
3. Add navigation types if needed in `src/types/index.ts`

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [i18next Documentation](https://www.i18next.com/)
- [React Native Documentation](https://reactnative.dev/)

---

**Built with ❤️ using React Native and Expo**

