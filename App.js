import React, { Suspense, useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, Pressable, ScrollView,
  StatusBar, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { CATEGORIES } from './src/data';
import { initializeDatabase } from './src/database';
import EcoTipsScreen from './src/screens/EcoTipsScreen';

const Stack = createNativeStackNavigator();
const GREEN = '#16734a';

function Page({ children }) {
  return <ScrollView style={styles.page} contentContainerStyle={styles.content}>{children}</ScrollView>;
}
function Header({ title, subtitle }) {
  return <View style={styles.hero}><Text style={styles.heroTitle}>{title}</Text><Text style={styles.heroText}>{subtitle}</Text></View>;
}
function Button({ label, onPress, secondary = false }) {
  return <Pressable onPress={onPress} style={[styles.button, secondary && styles.buttonSecondary]}>
    <Text style={[styles.buttonText, secondary && styles.buttonSecondaryText]}>{label}</Text>
  </Pressable>;
}
function MaterialRow({ item, onPress }) {
  return <Pressable style={styles.card} onPress={onPress}>
    <View style={styles.cardRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSub}>{item.category}</Text>
      </View>
      <Text style={styles.arrow}>{item.favorite ? '★  ' : ''}›</Text>
    </View>
  </Pressable>;
}
function Section({ title, body }) {
  return <View style={styles.card}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.paragraph}>{body}</Text>
  </View>;
}

function HomeScreen({ navigation }) {
  const db = useSQLiteContext();
  const [count, setCount] = useState(0);
  useFocusEffect(useCallback(() => {
    let active = true;
    db.getFirstAsync('SELECT COUNT(*) AS total FROM waste_items').then(row => {
      if (active) setCount(row?.total ?? 0);
    }).catch(console.error);
    return () => { active = false; };
  }, [db]));
  return <Page>
    <Header title="EcoSort LK 🌱" subtitle="Learn to sort waste and care for our environment — even offline." />
    <View style={styles.stat}><Text style={styles.statNumber}>{count}</Text><Text style={styles.statText}>Waste materials in your local guide</Text></View>
    <Button label="Explore Waste Materials" onPress={() => navigation.navigate('Waste Explorer')} />
    <Button label="Browse Categories" secondary onPress={() => navigation.navigate('Categories')} />
    <Button label="Reuse Ideas" secondary onPress={() => navigation.navigate('Reuse Ideas')} />
    <Button label="Eco Tips" secondary onPress={() => navigation.navigate('Eco Tips')} />
    <Button label="Take an Eco Quiz" secondary onPress={() => navigation.navigate('Eco Quiz')} />
    <Button label="About EcoSort LK" secondary onPress={() => navigation.navigate('About')} />
    <Text style={styles.note}>Recycling services differ by location. Always confirm your local collector's requirements.</Text>
  </Page>;
}

function CategoriesScreen({ navigation }) {
  return <Page>
    <Header title="Waste Categories" subtitle="Choose a category to explore its materials." />
    {CATEGORIES.map(category =>
      <Pressable key={category.name} style={styles.card} onPress={() => navigation.navigate('Waste Explorer', { category: category.name })}>
        <Text style={styles.cardTitle}>{category.icon}  {category.name}</Text>
        <Text style={styles.cardSub}>{category.description}</Text>
      </Pressable>
    )}
  </Page>;
}

function ExplorerScreen({ navigation, route }) {
  const db = useSQLiteContext();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(route.params?.category ?? 'All');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [items, setItems] = useState([]);

  // Refresh when this screen receives focus, so favourite changes are visible.
  useFocusEffect(useCallback(() => {
    let active = true;
    const search = `%${query.trim()}%`;
    db.getAllAsync(
      `SELECT * FROM waste_items
       WHERE (? = 'All' OR category = ?)
         AND (name LIKE ? OR disposal LIKE ?)
         AND (? = 0 OR favorite = 1)
       ORDER BY name`,
      category, category, search, search, favoritesOnly ? 1 : 0
    ).then(rows => { if (active) setItems(rows); }).catch(console.error);
    return () => { active = false; };
  }, [db, query, category, favoritesOnly]));

  return <View style={styles.page}>
    <View style={styles.explorerTop}>
      <TextInput style={styles.input} value={query} onChangeText={setQuery}
        placeholder="Search waste items..." placeholderTextColor="#888" autoCorrect={false} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
        {['All', ...CATEGORIES.map(c => c.name)].map(name =>
          <Pressable key={name} onPress={() => setCategory(name)}
            style={[styles.chip, category === name && styles.chipActive]}>
            <Text style={[styles.chipText, category === name && styles.chipTextActive]}>{name}</Text>
          </Pressable>
        )}
      </ScrollView>
      <Pressable onPress={() => setFavoritesOnly(v => !v)}>
        <Text style={styles.favorites}>{favoritesOnly ? '★ Showing favorites' : '☆ Show favorites only'}</Text>
      </Pressable>
      <Text style={styles.resultCount}>{items.length} item(s) found</Text>
    </View>
    <FlatList data={items} keyExtractor={item => String(item.id)}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <MaterialRow item={item}
        onPress={() => navigation.navigate('Waste Details', { id: item.id })} />}
      ListEmptyComponent={<Text style={styles.empty}>No matching items. Try another search or filter.</Text>} />
  </View>;
}

function DetailsScreen({ route }) {
  const db = useSQLiteContext();
  const [item, setItem] = useState(null);
  const itemId = route.params.id;
  useEffect(() => {
    let active = true;
    db.getFirstAsync('SELECT * FROM waste_items WHERE id = ?', itemId)
      .then(row => { if (active) setItem(row); }).catch(console.error);
    return () => { active = false; };
  }, [db, itemId]);
  async function toggleFavorite() {
    const next = item.favorite ? 0 : 1;
    await db.runAsync('UPDATE waste_items SET favorite = ? WHERE id = ?', next, itemId);
    setItem(current => ({ ...current, favorite: next }));
  }
  if (!item) return <View style={styles.loading}><ActivityIndicator color={GREEN} /></View>;
  return <Page>
    <Header title={item.name} subtitle={`Category: ${item.category}`} />
    <Button label={item.favorite ? '★ Remove from Favorites' : '☆ Save to Favorites'} onPress={toggleFavorite} />
    <Section title="How to dispose" body={item.disposal} />
    <Section title="Preparation" body={item.preparation} />
    <Section title="Important safety note" body={item.warning} />
    <Section title="Reuse idea" body={item.reuse} />
    <Text style={styles.note}>This guide is educational. Confirm locally available collection services and follow municipal instructions.</Text>
  </Page>;
}

function ReuseScreen({ navigation }) {
  const db = useSQLiteContext();
  const [items, setItems] = useState([]);
  useEffect(() => {
    db.getAllAsync("SELECT * FROM waste_items WHERE reuse != '' ORDER BY name")
      .then(setItems).catch(console.error);
  }, [db]);
  return <View style={styles.page}>
    <FlatList data={items} keyExtractor={item => String(item.id)} contentContainerStyle={styles.list}
      ListHeaderComponent={<Header title="Reuse Ideas" subtitle="Find useful alternatives before discarding items." />}
      renderItem={({ item }) => <Pressable style={styles.card}
        onPress={() => navigation.navigate('Waste Details', { id: item.id })}>
        <Text style={styles.cardTitle}>{item.name}</Text><Text style={styles.paragraph}>{item.reuse}</Text>
      </Pressable>} />
  </View>;
}

function QuizScreen({ navigation }) {
  const db = useSQLiteContext();
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  useEffect(() => {
    db.getAllAsync('SELECT * FROM quiz_questions ORDER BY id').then(setQuestions).catch(console.error);
  }, [db]);
  if (!questions.length) return <View style={styles.loading}><ActivityIndicator color={GREEN} /></View>;
  const current = questions[index];
  const options = [current.option_1, current.option_2, current.option_3, current.option_4];
  function submit() {
    if (selected === null) return;
    const updatedScore = score + (selected === current.answer ? 1 : 0);
    if (index === questions.length - 1) {
      navigation.replace('Quiz Results', { score: updatedScore, total: questions.length });
    } else {
      setScore(updatedScore);
      setIndex(i => i + 1);
      setSelected(null);
    }
  }
  return <Page>
    <Header title="Eco Quiz" subtitle={`Question ${index + 1} of ${questions.length}`} />
    <Text style={styles.quizQuestion}>{current.question}</Text>
    {options.map((option, i) => <Pressable key={i}
      onPress={() => setSelected(i)} style={[styles.option, selected === i && styles.optionSelected]}>
      <Text style={[styles.optionText, selected === i && styles.optionTextSelected]}>{option}</Text>
    </Pressable>)}
    <Button label={index === questions.length - 1 ? 'Finish Quiz' : 'Next Question'} onPress={submit} />
    {selected === null && <Text style={styles.note}>Select an answer to continue.</Text>}
  </Page>;
}

function QuizResultsScreen({ route, navigation }) {
  const { score, total } = route.params;
  return <Page>
    <Header title="Quiz Complete! 🎉" subtitle="Thanks for learning about responsible waste sorting." />
    <View style={styles.stat}><Text style={styles.statNumber}>{score} / {total}</Text><Text style={styles.statText}>Correct answers</Text></View>
    <Button label="Try Again" onPress={() => navigation.replace('Eco Quiz')} />
    <Button label="Back to Home" secondary onPress={() => navigation.popToTop()} />
  </Page>;
}

function AboutScreen() {
  return <Page>
    <Header title="About EcoSort LK" subtitle="An offline waste sorting and recycling learning companion." />
    <Section title="Purpose" body="Help Sri Lankan users learn how to separate common household waste, avoid unsafe disposal and discover reuse ideas." />
    <Section title="Offline technology" body="Built with React Native, Expo, React Navigation and a locally stored SQLite database. No public API is needed." />
    <Section title="Important limitation" body="Recycling acceptance, e-waste facilities and municipal rules vary by location. This app offers general educational advice, not confirmed collection locations or official disposal instructions." />
    <Section title="Assignment" body="ICA 03 – Individual React Native Project. Replace this starter information with your own project details before submission." />
  </Page>;
}

function AppNavigation() {
  return <NavigationContainer>
    <StatusBar barStyle="dark-content" backgroundColor="#edf7f0" />
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#edf7f0' }, headerTintColor: GREEN,
      headerTitleStyle: { fontWeight: '700' }, contentStyle: { backgroundColor: '#f5f9f5' } }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'EcoSort LK' }} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="Waste Explorer" component={ExplorerScreen} />
      <Stack.Screen name="Waste Details" component={DetailsScreen} />
      <Stack.Screen name="Reuse Ideas" component={ReuseScreen} />
      <Stack.Screen name="Eco Tips" component={EcoTipsScreen} />
      <Stack.Screen name="Eco Quiz" component={QuizScreen} />
      <Stack.Screen name="Quiz Results" component={QuizResultsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  </NavigationContainer>;
}

export default function App() {
  return <Suspense fallback={<View style={styles.loading}><ActivityIndicator color={GREEN} size="large" /></View>}>
    <SQLiteProvider databaseName="ecosortlk.db" onInit={initializeDatabase} useSuspense>
      <AppNavigation />
    </SQLiteProvider>
  </Suspense>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f5f9f5' },
  content: { padding: 18, paddingBottom: 48 },
  list: { padding: 18, paddingBottom: 48 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { backgroundColor: '#dff3e4', borderRadius: 20, padding: 22, marginBottom: 18 },
  heroTitle: { fontSize: 27, fontWeight: '800', color: '#135838' },
  heroText: { fontSize: 14, color: '#37664d', marginTop: 6, lineHeight: 21 },
  button: { backgroundColor: GREEN, paddingVertical: 15, paddingHorizontal: 18, borderRadius: 12, marginBottom: 10, alignItems: 'center' },
  buttonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  buttonSecondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#b9d8c4' },
  buttonSecondaryText: { color: GREEN },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 17, marginBottom: 11, borderWidth: 1, borderColor: '#e2eee5' },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#233e30' },
  cardSub: { color: '#638172', fontSize: 13, marginTop: 6, lineHeight: 19 },
  arrow: { fontSize: 25, color: GREEN },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: GREEN, marginBottom: 7 },
  paragraph: { fontSize: 14, color: '#3d5145', lineHeight: 21, marginTop: 5 },
  stat: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 26, marginBottom: 18 },
  statNumber: { fontSize: 40, fontWeight: '800', color: GREEN },
  statText: { color: '#526d5c', marginTop: 5 },
  note: { color: '#6c7d70', fontSize: 12, lineHeight: 18, marginTop: 12 },
  explorerTop: { paddingHorizontal: 16, paddingTop: 12 },
  input: { borderWidth: 1, borderColor: '#b9d8c4', backgroundColor: '#fff', borderRadius: 12, padding: 13, marginBottom: 12, fontSize: 15 },
  chip: { backgroundColor: '#e8eee9', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 100, marginRight: 7, marginBottom: 12 },
  chipActive: { backgroundColor: GREEN },
  chipText: { color: '#365a45', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  favorites: { color: GREEN, fontWeight: '700', marginBottom: 7 },
  resultCount: { color: '#607c68', marginBottom: 6, fontSize: 13 },
  empty: { padding: 20, color: '#607c68', textAlign: 'center' },
  quizQuestion: { fontSize: 21, fontWeight: '700', color: '#23432f', marginBottom: 18 },
  option: { borderWidth: 1, borderColor: '#bad5c3', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
  optionSelected: { borderColor: GREEN, backgroundColor: '#dcefe2' },
  optionText: { fontSize: 15, color: '#32503c' },
  optionTextSelected: { color: '#145d3a', fontWeight: '700' },
});
