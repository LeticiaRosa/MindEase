import { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";

const FOCUS_DURATION = 25 * 60; // 25 minutos
const BREAK_DURATION = 5 * 60; // 5 minutos

export function PomodoroTimer() {
  const [seconds, setSeconds] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsBreak((b) => !b);
            return isBreak ? FOCUS_DURATION : BREAK_DURATION;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isBreak]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const reset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setSeconds(FOCUS_DURATION);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mode}>{isBreak ? "☕ Pausa" : "🎯 Foco"}</Text>
      <Text style={styles.timer}>
        {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </Text>
      <View style={styles.buttons}>
        <Pressable
          style={[styles.button, isRunning && styles.buttonPause]}
          onPress={() => setIsRunning(!isRunning)}
        >
          <Text style={styles.buttonText}>
            {isRunning ? "Pausar" : "Iniciar"}
          </Text>
        </Pressable>
        <Pressable style={styles.buttonReset} onPress={reset}>
          <Text style={styles.buttonResetText}>Resetar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  timer: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#6C63FF",
    fontVariant: ["tabular-nums"],
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonPause: {
    backgroundColor: "#FF6B6B",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  buttonReset: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonResetText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 15,
  },
});
