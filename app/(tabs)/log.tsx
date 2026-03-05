import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { saveClimb } from '@/storage/climbs';
import type { Climb, ClimbType } from '@/types/climb';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function LogScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [type, setType] = useState<ClimbType>('boulder');
  const [holdColor, setHoldColor] = useState('');
  const [grade, setGrade] = useState('');
  const [attempts, setAttempts] = useState(1);
  const [notes, setNotes] = useState('');

  async function pickPhoto(useCamera: boolean) {
    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera access is required to take photos.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        quality: 0.8,
      });
      if (!result.canceled) setPhotoUri(result.assets[0].uri);
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        quality: 0.8,
      });
      if (!result.canceled) setPhotoUri(result.assets[0].uri);
    }
  }

  function showPhotoOptions() {
    Alert.alert('Add Photo', undefined, [
      { text: 'Take Photo', onPress: () => pickPhoto(true) },
      { text: 'Choose from Library', onPress: () => pickPhoto(false) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  async function handleSave() {
    if (!holdColor.trim() || !grade.trim()) {
      Alert.alert('Missing info', 'Please fill in hold color and grade.');
      return;
    }
    const climb: Climb = {
      id: generateId(),
      date: new Date().toISOString(),
      type,
      photoUri,
      holdColor: holdColor.trim(),
      grade: grade.trim(),
      attempts,
      notes: notes.trim(),
    };
    await saveClimb(climb);
    setPhotoUri(null);
    setType('boulder');
    setHoldColor('');
    setGrade('');
    setAttempts(1);
    setNotes('');
    Alert.alert('Saved!', 'Climb logged successfully.');
  }

  const inputStyle = [
    styles.input,
    { color: colors.text, borderColor: colors.icon, backgroundColor: colors.background },
  ];

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <ThemedText type="title" style={styles.heading}>
            Log a Climb
          </ThemedText>

          {/* Photo */}
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Photo
          </ThemedText>
          <Pressable onPress={showPhotoOptions} style={[styles.photoBox, { borderColor: colors.icon }]}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            ) : (
              <ThemedText style={{ color: colors.icon }}>Tap to add photo</ThemedText>
            )}
          </Pressable>

          {/* Type */}
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Type
          </ThemedText>
          <View style={styles.toggle}>
            {(['boulder', 'board'] as ClimbType[]).map((t) => (
              <Pressable
                key={t}
                onPress={() => setType(t)}
                style={[
                  styles.toggleBtn,
                  {
                    backgroundColor: type === t ? colors.tint : 'transparent',
                    borderColor: colors.tint,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.toggleBtnText,
                    { color: type === t ? (colorScheme === 'dark' ? '#151718' : '#fff') : colors.tint },
                  ]}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          {/* Hold Color */}
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Hold Color
          </ThemedText>
          <TextInput
            style={inputStyle}
            value={holdColor}
            onChangeText={setHoldColor}
            placeholder="e.g. Blue, Yellow"
            placeholderTextColor={colors.icon}
          />

          {/* Grade */}
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Grade
          </ThemedText>
          <TextInput
            style={inputStyle}
            value={grade}
            onChangeText={setGrade}
            placeholder="e.g. V5, 6B, Kilter 30deg"
            placeholderTextColor={colors.icon}
          />

          {/* Attempts */}
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Attempts
          </ThemedText>
          <View style={styles.stepper}>
            <Pressable
              onPress={() => setAttempts((a) => Math.max(1, a - 1))}
              style={[styles.stepBtn, { borderColor: colors.tint }]}
            >
              <ThemedText style={[styles.stepBtnText, { color: colors.tint }]}>−</ThemedText>
            </Pressable>
            <ThemedText style={styles.stepCount}>{attempts}</ThemedText>
            <Pressable
              onPress={() => setAttempts((a) => a + 1)}
              style={[styles.stepBtn, { borderColor: colors.tint }]}
            >
              <ThemedText style={[styles.stepBtnText, { color: colors.tint }]}>+</ThemedText>
            </Pressable>
          </View>

          {/* Notes */}
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Notes
          </ThemedText>
          <TextInput
            style={[inputStyle, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Beta, body position, what worked..."
            placeholderTextColor={colors.icon}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Save */}
          <Pressable
            onPress={handleSave}
            style={[styles.saveBtn, { backgroundColor: colors.tint }]}
          >
            <ThemedText style={[styles.saveBtnText, { color: colorScheme === 'dark' ? '#151718' : '#fff' }]}>
              Save Climb
            </ThemedText>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 48 },
  heading: { marginBottom: 24, marginTop: 8 },
  label: { marginBottom: 6, marginTop: 16 },
  photoBox: {
    height: 180,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%', resizeMode: 'cover' },
  toggle: { flexDirection: 'row', gap: 10 },
  toggleBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  toggleBtnText: { fontWeight: '600', fontSize: 15 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  notesInput: { height: 100 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stepBtn: {
    width: 40,
    height: 40,
    borderWidth: 1.5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: { fontSize: 22, lineHeight: 26 },
  stepCount: { fontSize: 20, fontWeight: '600', minWidth: 32, textAlign: 'center' },
  saveBtn: {
    marginTop: 32,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnText: { fontWeight: '700', fontSize: 17 },
});
