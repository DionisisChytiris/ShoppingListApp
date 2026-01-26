import React,{useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../lib/themeContext';
import { spacing, typography, radii, radius } from '../lib/theme';
import { useAppSelector, useAppDispatch } from '../hooks';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '../../redux/authSlice';

export default function Tab4Screen() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [authModalVisible, setAuthModalVisible] = useState(false);


  const handleLogout = async () => {
    await dispatch(logout());
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.content}>
        {/* <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          Tab 4
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Placeholder content
        </Text> */}

        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Account
            </Text>
            {isAuthenticated ? (
              <>
                <View
                  style={[
                    styles.accountCard,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <View style={styles.accountInfo}>
                    <Ionicons
                      name="person-circle-outline"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <View style={styles.accountText}>
                      <Text style={[styles.accountName, { color: theme.colors.onSurface }]}>
                        {user?.name || user?.email || 'User'}
                      </Text>
                      <Text style={[styles.accountEmail, { color: theme.colors.onSurfaceVariant }]}>
                        {user?.email}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.logoutButton,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={handleLogout}
                  activeOpacity={0.7}
                >
                  <Ionicons name="log-out-outline" size={20} color={theme.colors.error || '#c62828'} />
                  <Text style={[styles.logoutButtonText, { color: theme.colors.error || '#c62828' }]}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
                onPress={() => setAuthModalVisible(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="log-in-outline" size={20} color={theme.colors.onPrimary} />
                <Text style={[styles.loginButtonText, { color: theme.colors.onPrimary }]}>
                  Login / Sign Up
                </Text>
              </TouchableOpacity>
            )}
          </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ 
  content: {
    alignItems: 'center',
    flex: 1,
    padding: spacing.lg,
  },
  accountCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  accountEmail: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.bodySmall.fontWeight as 400,
    lineHeight: typography.bodySmall.lineHeight,
  },
  accountInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  accountName: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  accountText: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  section: {
    gap: spacing.md,
    width: '90%'
  },
  sectionTitle: {
    fontSize: typography.heading3.fontSize,
    fontWeight: typography.heading3.fontWeight as 600,
    lineHeight: typography.heading3.lineHeight,
  },
  loginButton: {
    alignItems: 'center',
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  loginButtonText: {
    ...typography.button,
    fontWeight: '600',
  },
  logoutButton: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  logoutButtonText: {
    ...typography.button,
    fontWeight: '600',
  },
});

