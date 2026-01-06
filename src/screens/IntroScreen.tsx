import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../lib/themeContext';
import { colors, spacing, radii, typography } from '../lib/theme';

const { width } = Dimensions.get('window');

interface IntroScreenProps {
  onComplete: () => void;
}

/* eslint-disable react-native/no-inline-styles */

const features = [
  {
    icon: 'list',
    title: 'Create Lists',
    description: 'Organize your shopping with multiple lists',
    color: '#0B84FF',
  },
  {
    icon: 'checkmark-circle',
    title: 'Track Progress',
    description: 'Check off items as you shop and see your progress',
    color: '#10B981',
  },
  {
    icon: 'camera',
    title: 'Add Photos',
    description: 'Take photos of items to remember what you need',
    color: '#F59E0B',
  },
  {
    icon: 'color-palette',
    title: 'Choose Theme',
    description: 'Customize with 8 beautiful themes including light, dark, blue, green, and more',
    color: '#8B5CF6',
  },
];

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentPage < features.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      scrollViewRef.current?.scrollTo({
        x: nextPage * width,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      edges={['top', 'bottom']}
    >
      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleSkip}
        activeOpacity={0.7}
      >
        <Text style={[styles.skipText, { color: theme.colors.onSurfaceVariant }]}>
          Skip
        </Text>
      </TouchableOpacity>

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const page = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentPage(page);
        }}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {features.map((feature, index) => (
          <View key={index} style={[styles.page, { width }]}>
            <View style={styles.iconContainer}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${feature.color}15` },
                ]}
              >
                <Ionicons
                  name={feature.icon as keyof typeof Ionicons.glyphMap}
                  size={64}
                  color={feature.color}
                />
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                {feature.title}
              </Text>
              <Text
                style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
              >
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {features.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentPage
                    ? theme.colors.primary
                    : theme.colors.surfaceVariant,
                width: index === currentPage ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: colors.onPrimary }]}>
            {currentPage === features.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={colors.onPrimary}
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radii.md,
    elevation: 5,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonIcon: {
    marginLeft: spacing.xs,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  container: {
    flex: 1,
  },
  description: {
    fontSize: typography.body.fontSize,
    fontWeight: '400' as const,
    lineHeight: 24,
    paddingHorizontal: spacing.md,
    textAlign: 'center',
  },
  dot: {
    borderRadius: 4,
    height: 8,
  },
  footer: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: 80,
    height: 160,
    justifyContent: 'center',
    width: 160,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  page: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  pagination: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  scrollContent: {
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  skipButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    position: 'absolute',
    right: spacing.lg,
    top: spacing.lg,
    zIndex: 10,
  },
  skipText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    paddingTop: spacing.xxl
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: typography.heading2.fontSize,
    fontWeight: '700' as const,
    lineHeight: typography.heading2.lineHeight,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
});

