import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '../hooks/index';
import { toggleFavorite, deleteList } from '../../redux/listsSlice';
import { ShoppingList } from '../types/index';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../lib/theme';
import { useTheme } from '../lib/themeContext';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import CreateListModal from '../modals/CreateNesList';
import { formatShortDateTime } from '../lib/dateUtils';
import { useTranslation } from '../hooks/useTranslation';

export default function HomeScreen() {
  const { t } = useTranslation();
  const lists = useAppSelector((s) => s.lists.lists);
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  // Get sorted lists
  const sortedLists = [...lists].sort((a, b) => b.createdAt - a.createdAt);
  const favoriteLists = sortedLists.filter(list => list.isFavorite);
  const recentList = sortedLists[0] || null;
  const otherLists = sortedLists.filter(list =>
    !list.isFavorite && list.id !== recentList?.id
  );

  const onDelete = (id: string) => {
    Alert.alert(t('listEditor.deleteList'), t('listEditor.areYouSure'), [
      { text: t('common.cancel'), style: "cancel" },
      {
        text: t('common.delete'),
        style: "destructive",
        onPress: () => dispatch(deleteList({ id })),
      },
    ]);
  };

  const onToggleFavorite = (id: string, e: any) => {
    e.stopPropagation();
    dispatch(toggleFavorite({ id }));
  };

  const renderListCard = (item: ShoppingList, showActions: boolean = true) => {
    const checkedCount = item.items.filter(i => i.checked).length;
    const totalItems = item.items.length;
    const progress = totalItems > 0 ? checkedCount / totalItems : 0;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        onPress={() => (navigation as any).navigate('ListEditor', { listId: item.id })}
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
                {totalItems === 0
                  ? "No items yet"
                  : `${checkedCount} of ${totalItems} items`}
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
                    backgroundColor: theme.colors.primary
                  }
                ]}
              />
            </View>
          )}
        </View>
        {showActions && (
          <View style={styles.cardActions}>
            <TouchableOpacity
              onPress={(e) => onToggleFavorite(item.id, e)}
              style={[styles.actionButton, { backgroundColor: theme.colors.surfaceVariant }]}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.isFavorite ? "star" : "star-outline"}
                size={18}
                color={item.isFavorite ? colors.warning : theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>
          </View>
        )}
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
            {t('app.title')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            {lists.length} {lists.length === 1 ? t('app.list') : t('app.lists')}
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => (navigation as any).navigate('Settings')}
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
          lists.length === 0 && styles.scrollContentEmpty
        ]}
      >
        {/* Most Recent List */}
        {recentList && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                {t('home.mostRecent')}
              </Text>
            </View>
            {renderListCard(recentList, false)}
          </View>
        )}

        {/* Favorite Lists */}
        {favoriteLists.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="star" size={20} color={colors.warning} />
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                {t('home.favorites')} ({favoriteLists.length})
              </Text>
            </View>
            {favoriteLists.slice(0, 3).map(list => renderListCard(list))}
          </View>
        )}

        {/* Other Lists */}
        {otherLists.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="folder-outline" size={20} color={theme.colors.onSurfaceVariant} />
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                {t('home.allLists')} ({otherLists.length})
              </Text>
            </View>
            {otherLists.slice(0, 5).map(list => renderListCard(list))}
          </View>
        )}

        {/* Empty State */}
        {lists.length === 0 && (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIconContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Ionicons name="list-outline" size={48} color={theme.colors.onSurfaceVariant} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
              {t('home.noListsYet')}
            </Text>
            <Text style={[styles.emptyDescription, { color: theme.colors.onSurfaceVariant }]}>
              {t('home.createFirstList')}
            </Text>
            <TouchableOpacity
              style={[styles.emptyButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="add" size={20} color={colors.onPrimary} />
              <Text style={[styles.emptyButtonText, { color: colors.onPrimary }]}>
                {t('home.createList')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <CreateListModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radii.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  scrollContentEmpty: {
    flexGrow: 1,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.heading3.fontSize,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  cardDate: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
  progressBar: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radii.sm,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  viewAllText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 600
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  emptyDescription: {
    fontSize: typography.body.fontSize,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    gap: spacing.xs,
  },
  emptyButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: '600',
  },
});
