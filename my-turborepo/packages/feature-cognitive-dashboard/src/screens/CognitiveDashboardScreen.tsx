import { useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { FocusModeToggle } from "../components/FocusModeToggle";
import { ComplexitySlider } from "../components/ComplexitySlider";

export function CognitiveDashboardScreen() {
  const [focusMode, setFocusMode] = useState(false);
  const [complexity, setComplexity] = useState(1);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Painel Cognitivo</Text>
        <Text style={styles.subtitle}>Personalize sua experiência</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Modo de Foco</Text>
        <FocusModeToggle enabled={focusMode} onToggle={setFocusMode} />
        <Text style={styles.hint}>
          {focusMode
            ? "🎯 Distrações escondidas. Foco total!"
            : "Ative para esconder elementos não essenciais"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Complexidade da Interface</Text>
        <ComplexitySlider value={complexity} onChange={setComplexity} />
        <Text style={styles.hint}>
          {complexity === 0
            ? "Simplificado — apenas o essencial"
            : complexity === 1
              ? "Padrão — equilíbrio entre info e clareza"
              : "Detalhado — todas as informações visíveis"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências Visuais</Text>
        <View style={styles.prefGrid}>
          <View style={styles.prefItem}>
            <Text style={styles.prefLabel}>Contraste</Text>
            <Text style={styles.prefValue}>Normal</Text>
          </View>
          <View style={styles.prefItem}>
            <Text style={styles.prefLabel}>Espaçamento</Text>
            <Text style={styles.prefValue}>Confortável</Text>
          </View>
          <View style={styles.prefItem}>
            <Text style={styles.prefLabel}>Fonte</Text>
            <Text style={styles.prefValue}>Média</Text>
          </View>
          <View style={styles.prefItem}>
            <Text style={styles.prefLabel}>Animações</Text>
            <Text style={styles.prefValue}>Ligadas</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7FF",
  },
  header: {
    padding: 24,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6C63FF",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  hint: {
    fontSize: 13,
    color: "#888",
    marginTop: 8,
  },
  prefGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  prefItem: {
    backgroundColor: "#F8F7FF",
    borderRadius: 12,
    padding: 16,
    width: "47%",
  },
  prefLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  prefValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
