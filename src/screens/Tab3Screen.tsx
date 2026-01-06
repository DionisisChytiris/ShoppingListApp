import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '../hooks/index';
import { toggleFavorite } from '../../redux/listsSlice';
import { ShoppingList } from '../types/index';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../lib/theme';
import { useTheme } from '../lib/themeContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { formatShortDateTime } from '../lib/dateUtils';
import { useTranslation } from '../hooks/useTranslation';

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

  // Get favorite lists sorted by creation date
  const favoriteLists = [...lists]
    .filter((list) => list.isFavorite)
    .sort((a, b) => b.createdAt - a.createdAt);

  const onToggleFavorite = (id: string, e: GestureResponderEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite({ id }));
  };

  const renderListCard = (item: ShoppingList) => {
    const checkedCount = item.items.filter((i) => i.checked).length;
    const totalItems = item.items.length;
    const progress = totalItems > 0 ? checkedCount / totalItems : 0;

    return (
      <TouchableOpacity
        key={item.id}
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
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
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
          favoriteLists.map((list) => renderListCard(list))
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
});
