import React, { useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "./src/config";

export default function App() {
  const [health, setHealth] = useState("checking...");

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_URL}/health`);
        const data = await res.json();
        setHealth(data.status ?? "unknown");
      } catch (e) {
        setHealth("error");
      }
    };

    checkHealth();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>TravelTinder Mobile</Text>
      <Text style={styles.text}>Backend health: {health}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 16 },
  text: { fontSize: 18 },
});
