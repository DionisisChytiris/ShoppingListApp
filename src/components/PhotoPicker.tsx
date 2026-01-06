import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../lib/theme';

type Theme = {
  colors?: {
    surfaceVariant?: string;
    onSurface?: string;
    onSurfaceVariant?: string;
    primary?: string;
  };
};

type Props = {
  uri?: string | null;
  onChange: (uri: string | null) => void;
  theme?: Theme;
};

export default function PhotoPicker({ uri, onChange, theme }: Props) {
  const themeColors = theme?.colors || (colors as typeof colors);
  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow photo library access to attach images.');
      return;
    }
    const granted = permission.granted ?? permission.status === 'granted';
    if (!granted) {
      Alert.alert('Permission required', 'Please allow photo library access to attach images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.6,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.canceled) return;

    onChange(result.assets[0].uri);
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    const granted = permission.granted ?? permission.status === 'granted';
    if (!granted) {
      Alert.alert('Permission required', 'Please allow camera access to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.6,
      allowsEditing: false,
    });

    if (result.canceled) return;

    onChange(result.assets[0].uri);
  }

  return (
    <View style={styles.container}>
      <View style={styles.photoSection}>
        {uri ? (
          <View style={styles.previewContainer}>
            <TouchableOpacity
              onPress={pickImage}
              style={[styles.preview, { backgroundColor: themeColors.surfaceVariant }]}
              activeOpacity={0.8}
            >
              <Image source={{ uri }} style={styles.image} />
              <View style={styles.imageOverlay}>
                <Ionicons name="camera" size={20} color={themeColors.onSurface} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onChange(null)}
              style={[styles.removeButton, { backgroundColor: colors.error }]}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={16} color={colors.onPrimary} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={pickImage}
            style={[
              styles.preview,
              styles.previewEmpty,
              { backgroundColor: themeColors.surfaceVariant },
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.placeholder}>
              <Ionicons name="image-outline" size={32} color={themeColors.onSurfaceVariant} />
              <Text style={[styles.placeholderText, { color: themeColors.onSurfaceVariant }]}>
                Add Photo
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={pickImage}
            style={[styles.actionButton, { backgroundColor: themeColors.surfaceVariant }]}
            activeOpacity={0.7}
          >
            <Ionicons name="images-outline" size={18} color={themeColors.primary} />
            <Text style={[styles.actionText, { color: themeColors.primary }]}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={takePhoto}
            style={[styles.actionButton, { backgroundColor: themeColors.surfaceVariant }]}
            activeOpacity={0.7}
          >
            <Ionicons name="camera-outline" size={18} color={themeColors.primary} />
            <Text style={[styles.actionText, { color: themeColors.primary }]}>Camera</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderRadius: radii.md,
    flexDirection: 'row',
    flex: 1,
    gap: spacing.xs,
    justifyContent: 'center',
    minWidth: 0,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  actionText: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.button.fontWeight as 600,
  },
  actions: {
    flexDirection: 'row',
    flex: 1,
    gap: spacing.sm,
    minWidth: 0,
  },
  container: {
    marginVertical: spacing.xs,
  },
  image: {
    height: '100%',
    resizeMode: 'cover',
    width: '100%',
  },
  imageOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  photoSection: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  placeholder: {
    alignItems: 'center',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight as 500,
    textAlign: 'center',
  },
  preview: {
    alignItems: 'center',
    borderRadius: radii.md,
    height: 80,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 80,
  },
  previewContainer: {
    position: 'relative',
  },
  previewEmpty: {
    borderStyle: 'dashed',
    borderWidth: 2,
  },
  removeButton: {
    alignItems: 'center',
    borderRadius: 14,
    elevation: 5,
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: -8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    top: -8,
    width: 28,
  },
});
