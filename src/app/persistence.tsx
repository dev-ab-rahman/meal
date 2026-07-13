import { COLORS } from "@/constants/meal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STORAGE_KEY = "persistedNote";

export default function PersistenceScreen() {
  const [text, setText] = useState("");
  const [loaded, setLoaded] = useState<string | null>(null);

  useEffect(() => {
    // load on mount
    loadNote();
  }, []);

  async function saveNote() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, text);
      Alert.alert("Saved", "Note was saved successfully.");
      setLoaded(text);
    } catch (e) {
      Alert.alert("Error", "Failed to save note.");
    }
  }

  async function loadNote() {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      setLoaded(value);
      if (value != null) setText(value);
    } catch (e) {
      Alert.alert("Error", "Failed to load note.");
    }
  }

  async function clearNote() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setText("");
      setLoaded(null);
      Alert.alert("Cleared", "Stored note removed.");
    } catch (e) {
      Alert.alert("Error", "Failed to clear note.");
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: COLORS.text }]}>Data Persistence</Text>

        <Text style={[styles.label, { color: COLORS.textSecondary }]}>Enter text to persist:</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type something to save..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          style={[styles.input, { color: COLORS.text, borderColor: COLORS.border, backgroundColor: COLORS.surface }]}
        />

        <View style={styles.buttonsRow}>
          <View style={styles.buttonWrap}>
            <Button title="Save" onPress={saveNote} />
          </View>
          <View style={styles.buttonWrap}>
            <Button title="Load" onPress={loadNote} />
          </View>
          <View style={styles.buttonWrap}>
            <Button title="Clear" onPress={clearNote} color="#d9534f" />
          </View>
        </View>

        <Text style={[styles.label, { color: COLORS.textSecondary }]}>Last loaded value:</Text>
        <View style={[styles.preview, { borderColor: COLORS.border, backgroundColor: COLORS.surface }]}>
          <Text style={{ color: COLORS.text }}>{loaded ?? "(none)"}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    textAlignVertical: "top",
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  buttonWrap: {
    flex: 1,
  },
  preview: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 60,
  },
});
