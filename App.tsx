import React, { useState, useEffect } from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "./redux/store";
import IntroScreen from "./src/screens/IntroScreen";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { ThemeProvider, useTheme } from "./src/lib/themeContext";
import RootNavigator from "./RootNavigator";

const AppContent = () => {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const { theme } = useTheme();

  // Set Android navigation bar color to match theme
  useEffect(() => {
    if (Platform.OS === "android") {
      // Disable edge-to-edge so nav bar uses a solid color
      NavigationBar.setPositionAsync("relative").catch(() => {});
      NavigationBar.setVisibilityAsync("visible").catch(() => {});
  
      const isDark = theme.name === "dark";
  
      NavigationBar.setBackgroundColorAsync(theme.colors.surface).catch(() => {});
      NavigationBar.setButtonStyleAsync(isDark ? "light" : "dark").catch(() => {});
    }
  }, [theme]);
  

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <IntroScreen onComplete={handleIntroComplete} />;
  }

  return (
    <NavigationContainer>
      <StatusBar style={theme.name === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}
