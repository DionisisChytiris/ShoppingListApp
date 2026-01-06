import React from 'react';
import { View, StyleSheet } from 'react-native';

type CircularProgressProps = {
  progress: number; // 0 to 1
  size: number;
  strokeWidth: number;
  backgroundColor: string;
  progressColor: string;
};

export default function CircularProgress({
  progress,
  size,
  strokeWidth,
  backgroundColor,
  progressColor,
}: CircularProgressProps) {
  const progressAngle = Math.min(progress * 360, 360);
  const isComplete = progress >= 1;

  return (
    <View style={{ width: size, height: size }}>
      {/* Background circle */}
      <View
        style={[
          {
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: backgroundColor,
          },
        ]}
      />
      {/* Progress circle */}
      {!isComplete && progress > 0 && (
        <View
          style={[
            {
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: 'transparent',
              borderTopColor: progressColor,
              borderRightColor: progress >= 0.25 ? progressColor : 'transparent',
              borderBottomColor: progress >= 0.5 ? progressColor : 'transparent',
              borderLeftColor: progress >= 0.75 ? progressColor : 'transparent',
              transform: [{ rotate: '-90deg' }],
            },
          ]}
        />
      )}
      {isComplete && (
        <View
          style={[
            {
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: progressColor,
            },
          ]}
        />
      )}
      {/* Mask to hide progress beyond current value */}
      {!isComplete && progress < 1 && (
        <View
          style={[
            {
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: backgroundColor,
              borderTopColor: progress > 0.25 ? backgroundColor : 'transparent',
              borderRightColor: progress > 0.5 ? backgroundColor : 'transparent',
              borderBottomColor: progress > 0.75 ? backgroundColor : 'transparent',
              transform: [{ rotate: `${-90 + progressAngle}deg` }],
            },
          ]}
        />
      )}
    </View>
  );
}

