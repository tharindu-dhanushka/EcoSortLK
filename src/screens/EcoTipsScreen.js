import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import { getEcoTips } from '../ecoTips';

export default function EcoTipsScreen() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    getEcoTips(db)
      .then(rows => { if (active) setTips(rows); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [db, attempt]);

  if (loading) return <View style={styles.center}>
    <ActivityIndicator size="large" color="#16734a" />
    <Text style={styles.body}>Loading eco tips...</Text>
  </View>;

  if (error) return <View style={styles.center}>
    <Text accessibilityRole="alert" style={styles.body}>Could not load eco tips. Please try again.</Text>
    <Pressable accessibilityRole="button" onPress={() => setAttempt(value => value + 1)} style={styles.button}>
      <Text style={styles.buttonText}>Retry</Text>
    </Pressable>
  </View>;

  return <FlatList style={styles.page} data={tips} keyExtractor={tip => String(tip.id)}
    contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
    ListHeaderComponent={<View style={styles.header}>
      <Text accessibilityRole="header" style={styles.title}>Small habits, less waste</Text>
      <Text style={styles.body}>Every tip is available offline. Collection rules vary; confirm what your local service accepts.</Text>
    </View>}
    ListEmptyComponent={<Text style={styles.body}>No eco tips are available yet.</Text>}
    renderItem={({ item }) => <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
    </View>} />;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f5f9f5' },
  content: { padding: 18 },
  center: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f9f5' },
  header: { padding: 22, borderRadius: 20, backgroundColor: '#dff3e4', marginBottom: 18 },
  title: { fontSize: 26, fontWeight: '800', color: '#135838' },
  card: { padding: 18, marginBottom: 12, borderRadius: 14, borderWidth: 1, borderColor: '#e2eee5', backgroundColor: '#fff' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#16734a' },
  body: { fontSize: 15, lineHeight: 23, color: '#3d5145', marginTop: 8 },
  button: { padding: 16, marginTop: 16, borderRadius: 12, backgroundColor: '#16734a' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
