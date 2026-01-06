import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { colors, spacing, typography } from '../lib/theme';
import CreateListModal from '../modals/CreateNesList';

/* eslint-disable react-native/no-inline-styles */

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <View
          style={[
            styles.tabBar,
            {
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.border,
              paddingBottom: Math.max(insets.bottom, 0),
            },
          ]}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (navigation as any).navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            // Skip middle tab (index 2) - we'll add a custom button there
            if (index === 2) {
              return (
                <View key={route.key} style={styles.middleButtonContainer}>
                  <TouchableOpacity
                    style={[styles.middleButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="add" size={32} color={colors.onPrimary} />
                  </TouchableOpacity>
                </View>
              );
            }

            // Get icon from options
            const iconElement = options.tabBarIcon
              ? typeof options.tabBarIcon === 'function'
                ? options.tabBarIcon({
                    focused: isFocused,
                    color: isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant,
                    size: 24,
                  })
                : null
              : null;

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tab}
              >
                {iconElement}
                <Text
                  style={[
                    styles.label,
                    {
                      color: isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant,
                      fontWeight: isFocused ? '600' : '400',
                    },
                  ]}
                >
                  {label as string}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <CreateListModal visible={modalVisible} onCancel={() => setModalVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  label: {
    fontSize: typography.bodySmall.fontSize,
    marginTop: spacing.xs,
  },
  middleButton: {
    alignItems: 'center',
    borderRadius: 28,
    elevation: 8,
    height: 56,
    justifyContent: 'center',
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: 56,
  },
  middleButtonContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  tabBar: {
    borderTopWidth: 1,
    elevation: 8,
    flexDirection: 'row',
    minHeight: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  // labelText: {
  //   fontWeight: '400',
  // },
  // labelTextBold: {
  //   fontWeight: '600',
  // },
});
