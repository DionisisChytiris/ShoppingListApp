import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../lib/theme';

interface ShoppingList {
  id: string;
  name: string;
  itemCount: number;
  createdAt: number;
  updatedAt: number;
  isFavorite?: boolean;
}

export default function EntryScreen() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [nextListId, setNextListId] = useState(1);

  const createNewList = () => {
    Alert.prompt(
      'Create New List',
      'What would you like to name this list?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Create',
          onPress: (listName:any) => {
            if (listName && listName.trim()) {
              const newList: ShoppingList = {
                id: Date.now().toString(),
                name: listName.trim(),
                itemCount: 0,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                isFavorite: false,
              };
              setLists([newList, ...lists]);
              setNextListId(nextListId + 1);
            }
          },
        },
      ],
      'plain-text',
      'Grocery'
    );
  };

  const toggleFavorite = (id: string) => {
    setLists(
      lists.map((list) =>
        list.id === id ? { ...list, isFavorite: !list.isFavorite } : list
      )
    );
  };

  const deleteList = (id: string) => {
    Alert.alert('Delete List', 'Are you sure? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => setLists(lists.filter((list) => list.id !== id)),
        style: 'destructive',
      },
    ]);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const renderListCard = ({ item }: { item: ShoppingList }) => (
    <TouchableOpacity
      style={styles.listCard}
      activeOpacity={0.7}
      onPress={() => {}}
    >
      <View style={styles.listCardContent}>
        <View style={styles.listCardHeader}>
          <Text style={styles.listName}>{item.name}</Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item.id)}
          >
            <Ionicons
              name={item.isFavorite ? 'star' : 'star-outline'}
              size={20}
              color={item.isFavorite ? colors.warning : colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.listCardFooter}>
          <View style={styles.listStats}>
            <View style={styles.statItem}>
              <Ionicons name="checkbox" size={16} color={colors.onSurfaceVariant} />
              <Text style={styles.statText}>
                {item.itemCount} {item.itemCount === 1 ? 'item' : 'items'}
              </Text>
            </View>
            <Text style={styles.lastUpdated}>{formatDate(item.updatedAt)}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteList(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        {/* Centered Title */}
        <View style={styles.titleSection}>
          <Ionicons name="list" size={32} color={colors.primary} />
          <Text style={styles.title}>Shopping Lists</Text>
          <Text style={styles.subtitle}>
            {lists.length} {lists.length === 1 ? 'list' : 'lists'}
          </Text>
        </View>

        {/* Create New List Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={createNewList}
          activeOpacity={0.85}
        >
          <View style={styles.createButtonContent}>
            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
            <Text style={styles.createButtonText}>Create New List</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.onSurfaceVariant} />
        </TouchableOpacity>

        {/* Lists or Empty State */}
        {lists.length > 0 ? (
          <FlatList
            data={lists}
            renderItem={renderListCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            scrollEnabled={true}
          />
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="bag-outline" size={64} color={colors.primaryLight} />
            </View>
            <Text style={styles.emptyStateTitle}>No lists yet</Text>
            <Text style={styles.emptyStateDescription}>
              Tap the button above to create your first shopping list
            </Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  titleSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  title: {
    ...(typography.heading2 as TextStyle),
    color: colors.onSurface,
  },
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  createButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  createButtonText: {
    ...typography.button,
    fontWeight: '700', // Ensure this is a valid React Native fontWeight
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  listCardContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  listCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listName: {
    ...typography.heading3,
    color: colors.onSurface,
    flex: 1,
  },
  favoriteButton: {
    padding: spacing.sm,
    marginRight: -spacing.sm,
  },
  listCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listStats: {
    flex: 1,
    gap: spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
  },
  lastUpdated: {
    ...typography.label,
    color: colors.onSurfaceVariant,
  },
  deleteButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyStateTitle: {
    ...typography.heading3,
    color: colors.onSurface,
    textAlign: 'center',
  },
  emptyStateDescription: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
});