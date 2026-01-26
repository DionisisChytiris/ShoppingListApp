import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, GestureResponderEvent, Animated, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '../hooks/index';
import { toggleFavorite, deleteList } from '../../redux/listsSlice';
import { ShoppingList } from '../types/index';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../lib/theme';
import { useTheme } from '../lib/themeContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { formatShortDateTime } from '../lib/dateUtils';
import { useTranslation } from '../hooks/useTranslation';

const SWIPE_THRESHOLD = 100;
const DELETE_BUTTON_WIDTH = 100;

type RootStackParamList = {
  ListEditor: { listId: string };
  Settings: undefined;
};

export default function Tab3Screen() {
  const { t } = useTranslation();
  const lists = useAppSelector((s) => s.lists.lists);
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const deleteTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const translateX = useRef<Record<string, Animated.Value>>({});
  const panResponders = useRef<Record<string, any>>({});

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(deleteTimers.current).forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
      deleteTimers.current = {};
    };
  }, []);

  // Get favorite lists sorted by creation date
  const favoriteLists = [...lists]
    .filter((list) => list.isFavorite)
    .sort((a, b) => b.createdAt - a.createdAt);

  const onToggleFavorite = (id: string, e: GestureResponderEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite({ id }));
  };

  const getTranslateX = (id: string) => {
    if (!translateX.current[id]) {
      translateX.current[id] = new Animated.Value(0);
    }
    return translateX.current[id];
  };

  const getPanResponder = (id: string) => {
    if (panResponders.current[id]) {
      return panResponders.current[id];
    }

    const pan = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderGrant: () => {
        // Don't clear timer here - let it continue if already running
        // Only clear if user is swiping back to close
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow swiping left (negative dx)
        if (gestureState.dx < 0) {
          getTranslateX(id).setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldOpen = gestureState.dx < -SWIPE_THRESHOLD;
        
        if (shouldOpen) {
          // Start auto-delete timer immediately when threshold is reached
          handleSwipeOpen(id);
          
          // Animate to open position
          Animated.spring(getTranslateX(id), {
            toValue: -DELETE_BUTTON_WIDTH,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
        } else {
          // Animate back to closed position
          Animated.spring(getTranslateX(id), {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
          
          // Clear timer if closing
          handleSwipeClose(id);
        }
      },
    });

    panResponders.current[id] = pan;
    return pan;
  };

  const onDeleteList = (id: string) => {
    // Clear any pending timer
    if (deleteTimers.current[id]) {
      clearTimeout(deleteTimers.current[id]);
      delete deleteTimers.current[id];
    }
    // Reset animation
    if (translateX.current[id]) {
      Animated.timing(translateX.current[id], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    dispatch(deleteList({ id }));
  };

  const handleSwipeOpen = (id: string) => {
    // Clear any existing timer for this item
    if (deleteTimers.current[id]) {
      clearTimeout(deleteTimers.current[id]);
    }
    // Start a 0.5-second timer to auto-delete
    deleteTimers.current[id] = setTimeout(() => {
      onDeleteList(id);
    }, 500);
  };

  const handleSwipeClose = (id: string) => {
    // Clear the timer if user swipes back
    if (deleteTimers.current[id]) {
      clearTimeout(deleteTimers.current[id]);
      delete deleteTimers.current[id];
    }
  };

  const renderListCard = (item: ShoppingList) => {
    const checkedCount = item.items.filter((i) => i.checked).length;
    const totalItems = item.items.length;
    const progress = totalItems > 0 ? checkedCount / totalItems : 0;

    const cardContent = (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        onPress={() => navigation.navigate('ListEditor', { listId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="list" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[styles.cardMeta, { color: theme.colors.onSurfaceVariant }]}>
                {totalItems === 0 ? 'No items yet' : `${checkedCount} of ${totalItems} items`}
              </Text>
              <Text style={[styles.cardDate, { color: theme.colors.onSurfaceVariant }]}>
                Created {formatShortDateTime(item.createdAt)}
              </Text>
            </View>
          </View>
          {totalItems > 0 && (
            <View style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              />
            </View>
          )}
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            onPress={(e) => onToggleFavorite(item.id, e)}
            style={[styles.actionButton, { backgroundColor: theme.colors.surfaceVariant }]}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.isFavorite ? 'star' : 'star-outline'}
              size={18}
              color={item.isFavorite ? colors.warning : theme.colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );

    const translateXValue = getTranslateX(item.id);
    const panResponder = getPanResponder(item.id);
    const deleteButtonOpacity = translateXValue.interpolate({
      inputRange: [-DELETE_BUTTON_WIDTH, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View key={item.id} style={styles.swipeContainer}>
        {/* Delete button behind the card */}
        <Animated.View
          style={[
            styles.deleteButtonContainer,
            {
              opacity: deleteButtonOpacity,
              backgroundColor: colors.error,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDeleteList(item.id)}
            activeOpacity={0.8}
          >
            <Ionicons name="trash" size={24} color="#fff" />
            <Text style={styles.deleteActionText}>Deleting...</Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Swipeable card */}
        <Animated.View
          style={[
            styles.swipeableCard,
            {
              transform: [{ translateX: translateXValue }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {cardContent}
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.appTitle, { color: theme.colors.onSurface }]}>
            {t('home.favorites')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            {favoriteLists.length} {favoriteLists.length === 1 ? t('app.list') : t('app.lists')}
          </Text>
        </View>
        {/* <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
        </View> */}
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          favoriteLists.length === 0 && styles.scrollContentEmpty,
        ]}
      >
        {/* Favorite Lists */}
        {favoriteLists.length > 0 ? (
          favoriteLists.map((list) => (
            <React.Fragment key={list.id}>
              {renderListCard(list)}
            </React.Fragment>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View
              style={[styles.emptyIconContainer, { backgroundColor: theme.colors.surfaceVariant }]}
            >
              <Ionicons name="star-outline" size={48} color={theme.colors.onSurfaceVariant} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
              {t('home.noFavorites')}
            </Text>
            <Text style={[styles.emptyDescription, { color: theme.colors.onSurfaceVariant }]}>
              {t('home.addFavorites')}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderRadius: radii.sm,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    elevation: 3,
    flexDirection: 'row',
    marginBottom: spacing.md,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardActions: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: spacing.sm,
  },
  cardContent: {
    flex: 1,
  },
  cardDate: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  cardIcon: {
    alignItems: 'center',
    borderRadius: radii.sm,
    height: 36,
    justifyContent: 'center',
    marginRight: spacing.sm,
    width: 36,
  },
  cardMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    marginBottom: 2,
  },
  container: {
    flex: 1,
  },
  emptyDescription: {
    fontSize: typography.body.fontSize,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
    textAlign: 'center',
  },
  emptyIconContainer: {
    alignItems: 'center',
    borderRadius: 50,
    height: 100,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    width: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 600,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: radii.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  progressBar: {
    borderRadius: 2,
    height: 3,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 2,
    height: '100%',
  },
  scrollContent: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  scrollContentEmpty: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  swipeContainer: {
    overflow: 'hidden',
    position: 'relative',
  },
  swipeableCard: {
    backgroundColor: 'transparent',
  },
  deleteButtonContainer: {
    alignItems: 'center',
    borderRadius: radii.md,
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    width: DELETE_BUTTON_WIDTH,
  },
  deleteButton: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  deleteActionText: {
    color: '#fff',
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
});
