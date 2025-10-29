import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radii } from '../lib/theme';

type Props = {
  uri?: string | null;
  onChange: (uri: string | null) => void;
};

export default function PhotoPicker({ uri, onChange }: Props) {
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
      <TouchableOpacity onPress={pickImage} style={styles.preview}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Add photo</Text>
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity onPress={pickImage} style={styles.actionButton}>
          <Text style={styles.actionText}>Library</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={takePhoto} style={[styles.actionButton, { marginLeft: 8 }]}>
          <Text style={styles.actionText}>Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  preview: {
    width: 96,
    height: 96,
    borderRadius: radii.sm,
    overflow: 'hidden',
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.muted,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: colors.surface,
    borderRadius: radii.sm,
  },
  actionText: {
    color: colors.primary,
    fontWeight: '600',
  },
});