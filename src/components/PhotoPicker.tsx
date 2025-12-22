import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../lib/theme';

type Props = {
  uri?: string | null;
  onChange: (uri: string | null) => void;
  theme?: any;
};

export default function PhotoPicker({ uri, onChange, theme }: Props) {
  const themeColors = theme?.colors || colors;
  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const granted = (permission as any).granted ?? (permission as any).status === 'granted';
    if (!granted) {
      Alert.alert('Permission required', 'Please allow photo library access to attach images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.6, base64: false });

    // Handle modern API (canceled + assets) and legacy API (cancelled + uri)
    let pickedUri: string | undefined;
    if ('canceled' in result) {
      if (result.canceled) return;
      pickedUri = result.assets?.[0]?.uri;
    } else if ('cancelled' in result) {
      if ((result as any).cancelled) return;
      pickedUri = (result as any).uri ?? (result as any).assets?.[0]?.uri;
    } else {
      pickedUri = (result as any).uri ?? (result as any).assets?.[0]?.uri;
    }

    if (pickedUri) onChange(pickedUri);
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    const granted = (permission as any).granted ?? (permission as any).status === 'granted';
    if (!granted) {
      Alert.alert('Permission required', 'Please allow camera access to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });

    let pickedUri: string | undefined;
    if ('canceled' in result) {
      if (result.canceled) return;
      pickedUri = result.assets?.[0]?.uri;
    } else if ('cancelled' in result) {
      if ((result as any).cancelled) return;
      pickedUri = (result as any).uri ?? (result as any).assets?.[0]?.uri;
    } else {
      pickedUri = (result as any).uri ?? (result as any).assets?.[0]?.uri;
    }

    if (pickedUri) onChange(pickedUri);
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
            style={[styles.preview, styles.previewEmpty, { backgroundColor: themeColors.surfaceVariant }]}
            activeOpacity={0.7}
          >
            <View style={styles.placeholder}>
              <Ionicons 
                name="image-outline" 
                size={32} 
                color={themeColors.onSurfaceVariant} 
              />
              <Text style={[styles.placeholderText, { color: themeColors.onSurfaceVariant }]}>
                Add Photo
              </Text>
            </View>
          </TouchableOpacity>
        )}
        
        <View style={styles.actions}>
          <TouchableOpacity 
            onPress={pickImage} 
            style={[
              styles.actionButton, 
              { backgroundColor: themeColors.surfaceVariant }
            ]}
            activeOpacity={0.7}
          >
            <Ionicons name="images-outline" size={18} color={themeColors.primary} />
            <Text style={[styles.actionText, { color: themeColors.primary }]}>
              Gallery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={takePhoto} 
            style={[
              styles.actionButton,
              { backgroundColor: themeColors.surfaceVariant }
            ]}
            activeOpacity={0.7}
          >
            <Ionicons name="camera-outline" size={18} color={themeColors.primary} />
            <Text style={[styles.actionText, { color: themeColors.primary }]}>
              Camera
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  photoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  previewContainer: {
    position: 'relative',
  },
  preview: {
    width: 80,
    height: 80,
    borderRadius: radii.md,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewEmpty: {
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  placeholderText: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight as '500',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    gap: spacing.xs,
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  actionText: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.button.fontWeight as '600',
  },
});