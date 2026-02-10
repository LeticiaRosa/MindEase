export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 24,
        backgroundColor: "#f0f4f8",
      }}
    >
      <h1
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: "#1a202c",
          marginBottom: 8,
        }}
      >
        🧠 MindEase
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "#718096",
          textAlign: "center",
        }}
      >
        Seu assistente de bem-estar cognitivo
      </p>
    </div>
  );
}
