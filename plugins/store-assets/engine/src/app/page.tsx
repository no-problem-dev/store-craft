export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "'Hiragino Sans', sans-serif",
        background: "#0A1628",
        color: "#fff",
        gap: 16,
      }}
    >
      <h1 style={{ fontSize: 48, fontWeight: 700 }}>store-craft engine</h1>
      <p style={{ fontSize: 20, opacity: 0.6 }}>
        /render?config=...&amp;id=... でスクリーンショットをレンダリング
      </p>
      <p style={{ fontSize: 20, opacity: 0.6 }}>
        /preview でプレビュー一覧を表示
      </p>
    </div>
  );
}
