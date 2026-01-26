import React, { useRef, useEffect } from 'react';
import { View, Animated, PanResponder, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/theme';

const SWIPE_THRESHOLD = 100;
const DELETE_BUTTON_WIDTH = 100;
const AUTO_DELETE_DELAY = 500; // 0.5 seconds

export function SwipeableListCard({
  id,
  onDelete,
  children,
}: {
  id: string;
  onDelete: (id: string) => void;
  children: React.ReactNode;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const deleteTimer = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (deleteTimer.current) {
        clearTimeout(deleteTimer.current);
      }
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10,
      onPanResponderMove: (_, g) => {
        if (g.dx < 0) translateX.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx < -SWIPE_THRESHOLD) {
          // Clear any existing timer
          if (deleteTimer.current) {
            clearTimeout(deleteTimer.current);
          }
          
          // Animate to open position
          Animated.spring(translateX, {
            toValue: -DELETE_BUTTON_WIDTH,
            useNativeDriver: true,
          }).start();
          
          // Start auto-delete timer
          deleteTimer.current = setTimeout(() => {
            onDelete(id);
          }, AUTO_DELETE_DELAY);
        } else {
          // Clear timer if swiping back
          if (deleteTimer.current) {
            clearTimeout(deleteTimer.current);
            deleteTimer.current = null;
          }
          
          // Animate back to closed position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const opacity = translateX.interpolate({
    inputRange: [-DELETE_BUTTON_WIDTH, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ overflow: 'hidden' }}>
      {/* Delete background */}
      <Animated.View
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: DELETE_BUTTON_WIDTH,
          backgroundColor: colors.error,
          alignItems: 'center',
          justifyContent: 'center',
          opacity,
        }}
      >
        <Ionicons name="trash" size={24} color="#fff" />
        <Text style={{ color: '#fff', marginTop: 6 }}>Delete</Text>
      </Animated.View>

      {/* Card */}
      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}
