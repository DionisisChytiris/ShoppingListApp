import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "./redux/store";
import ListsScreen from "./src/screens/ListsScreen";
import ListEditorScreen from "./src/screens/ListEditorScreen";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "./src/lib/themeContext";
import SettingsScreen from "./src/screens/SettingsScreen";
import EntryScreen from "./src/screens/EntryScreen";

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Lists" component={ListsScreen} />
      {/* <Stack.Screen name="Lists" component={EntryScreen} /> */}
      {/* <Stack.Screen name="ListEditor" component={EntryScreen} /> */}
      <Stack.Screen name="ListEditor" component={ListEditorScreen} />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};
export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <RootStack />
          </NavigationContainer>
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
