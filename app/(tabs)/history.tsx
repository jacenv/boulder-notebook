import { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { deleteClimb, getAllClimbs } from '@/storage/climbs';
import type { Climb } from '@/types/climb';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function HistoryScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [climbs, setClimbs] = useState<Climb[]>([]);

  useFocusEffect(
    useCallback(() => {
      getAllClimbs().then(setClimbs);
    }, [])
  );

  async function handleDelete(id: string) {
    Alert.alert('Delete climb?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteClimb(id);
          setClimbs((prev) => prev.filter((c) => c.id !== id));
        },
      },
    ]);
  }

  if (climbs.length === 0) {
    return (
      <ThemedView style={styles.empty}>
        <ThemedText type="subtitle" style={{ color: colors.icon }}>
          No climbs logged yet.
        </ThemedText>
        <ThemedText style={{ color: colors.icon, marginTop: 8 }}>
          Head to the Log tab to record your first climb!
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={climbs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <ThemedText type="title" style={styles.heading}>
            History
          </ThemedText>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { borderColor: colors.icon, backgroundColor: colors.background }]}>
            {item.photoUri && (
              <Image source={{ uri: item.photoUri }} style={styles.thumbnail} />
            )}
            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <View style={[styles.badge, { backgroundColor: colors.tint }]}>
                  <ThemedText
                    style={[
                      styles.badgeText,
                      { color: colorScheme === 'dark' ? '#151718' : '#fff' },
                    ]}
                  >
                    {item.type}
                  </ThemedText>
                </View>
                <ThemedText style={[styles.date, { color: colors.icon }]}>
                  {formatDate(item.date)}
                </ThemedText>
              </View>

              <ThemedText type="defaultSemiBold" style={styles.grade}>
                {item.grade}
              </ThemedText>

              <ThemedText style={{ color: colors.icon }}>Hold: {item.holdColor}</ThemedText>
              <ThemedText style={{ color: colors.icon }}>
                Attempts: {item.attempts}
              </ThemedText>

              {item.notes ? (
                <ThemedText style={styles.notes} numberOfLines={3}>
                  {item.notes}
                </ThemedText>
              ) : null}

              <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <ThemedText style={styles.deleteText}>Delete</ThemedText>
              </Pressable>
            </View>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  list: { padding: 16, paddingBottom: 48 },
  heading: { marginBottom: 16, marginTop: 8 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  thumbnail: { width: '100%', height: 160, resizeMode: 'cover' },
  cardBody: { padding: 14, gap: 4 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  date: { fontSize: 13 },
  grade: { fontSize: 20, marginBottom: 2 },
  notes: { marginTop: 6, fontStyle: 'italic' },
  deleteBtn: { marginTop: 10, alignSelf: 'flex-end' },
  deleteText: { color: '#e53935', fontWeight: '600' },
});
