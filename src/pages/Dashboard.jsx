import { useState, useEffect } from "react";

function Dashboard({ onLogout }) {
  /* ================= MACHINE STATE ================= */
  const [machineInputs, setMachineInputs] = useState({
    "CFT-1": { wheelCode: "", wheelSize: "", cycles: "", acceptanceCycles: "", load: "", testReason: "" },
    "CFT-2": { wheelCode: "", wheelSize: "", cycles: "", acceptanceCycles: "", load: "", testReason: "" },
    "CFT-3": { wheelCode: "", wheelSize: "", cycles: "", acceptanceCycles: "", load: "", testReason: "" },

    "RFT-1": { wheelCode: "", wheelSize: "", cycles: "", acceptanceCycles: "", load: "", testReason: "" },
    "RFT-2": { wheelCode: "", wheelSize: "", cycles: "", acceptanceCycles: "", load: "", testReason: "" },
    "RFT-3": { wheelCode: "", wheelSize: "", cycles: "", acceptanceCycles: "", load: "", testReason: "" },
    "RFT-4": { wheelCode: "", wheelSize: "", cycles: "", acceptanceCycles: "", load: "", testReason: "" },
    "RFT-5": { wheelCode: "", wheelSize: "", cycles: "", acceptanceCycles: "", load: "", testReason: "" },
    "RFT-6": { wheelCode: "", wheelSize: "", cycles: "", acceptanceCycles: "", load: "", testReason: "" },

    "BI AXIAL-CV": { wheelCode: "", wheelSize: "", cycles: "", acceptanceCycles: "", load: "", testReason: "" },
    "BI AXIAL-LP": { wheelCode: "", wheelSize: "", cycles: "", acceptanceCycles: "", load: "", testReason: "" },
  });

  /* ================= MACHINE CONFIG ================= */
  const machines = [
    { name: "CFT-1", type: "CFT", sub: "10 KN", img: "/images/cft1_2.png" },
    { name: "CFT-2", type: "CFT", sub: "60 KN", img: "/images/cft1_2.png" },
    { name: "CFT-3", type: "CFT", sub: "105 KN", img: "/images/cft3.png" },

    { name: "RFT-1", type: "RFT", sub: "3 TON", img: "/images/rft1_2.png" },
    { name: "RFT-2", type: "RFT", sub: "3 TON", img: "/images/rft1_2.png" },
    { name: "RFT-3", type: "RFT", sub: "10 TON", img: "/images/rft3_4.png" },

    { name: "RFT-4", type: "RFT", sub: "10 TON", img: "/images/rft3_4.png" },
    { name: "RFT-5", type: "RFT", sub: "10 & 15 TON", img: "/images/rft5.png" },
    { name: "RFT-6", type: "RFT", sub: "10 & 15 TON", img: "/images/rft6.png" },

    {
      name: "BI AXIAL-CV",
      type: "BIAXIAL",
      subLines: ["VERTICAL 250 KN", "LATERAL ±100 KN"],
      img: "/images/biaxial_cv.png",
    },
    {
      name: "BI AXIAL-LP",
      type: "BIAXIAL",
      subLines: ["VERTICAL 40 KN", "LATERAL ±40 KN"],
      img: "/images/biaxial_lp.png",
    },
  ];

  /* ================= FETCH BACKEND ================= */
  useEffect(() => {
    const fetchData = () => {
      fetch("https://excel-dashboard-backend-q2nl.onrender.com/api/dashboard-data")
        .then((res) => res.json())
        .then((data) => {
          setMachineInputs((prev) => {
            const updated = { ...prev };

            Object.keys(updated).forEach((machine) => {
              if (!data[machine]) return;

              updated[machine] = {
                ...updated[machine],
                wheelCode: data[machine].wheelCode || "",
                wheelSize: data[machine].wheelSize || "",
                cycles: data[machine].cycles || "",
                acceptanceCycles: data[machine].acceptedCycles || "",
                testReason: data[machine].testReason || "",
                load:
                  data[machine].bendingMovement ??
                  data[machine].testLoad ??
                  data[machine].testSpec ??   // ★ CHANGED: was data[machine].testspec (lowercase s) — now matches backend field name testSpec
                  "",
              };
            });

            return updated;
          });
        })
        .catch((err) => console.error("Backend error:", err));
    };

    // Initial fetch
    fetchData();

    // Auto-refresh every 45 seconds
    const interval = setInterval(fetchData, 45000);

    return () => clearInterval(interval);
  }, []);

  /* ================= DATE ================= */
  const today = new Date();

  const formattedDate =
    String(today.getDate()).padStart(2, "0") +
    "/" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "/" +
    String(today.getFullYear())
   /* ================= TIME ================= */
    const timeOnly = new Date().toLocaleTimeString();
    console.log(timeOnly);

  /* ================= MINI CORNER PROGRESS RING (all cards) =================
     Shared radius/circumference constants — the actual percent is
     computed per-machine inside the .map() below, from that machine's
     own cycles/acceptanceCycles, so every card gets its own value. */
  const miniRingRadius = 18;
  const miniRingCircumference = 2 * Math.PI * miniRingRadius;

  /* ================= DASHBOARD ================= */
  return (
    <div style={styles.dashboard}>
      <div style={styles.header}>
        <h2>WHEELS INDIA LIMITED</h2>
        <button style={styles.logoutBtn} onClick={onLogout}>
          Logout
        </button>
      </div>

      <div style={styles.pageTitle}>
        PRODUCT TESTING LIVE DATA - {formattedDate} - {timeOnly}
      </div>

      <div style={styles.grid}>
        {machines.map((m) => {
          const loadLabel =
            m.type === "CFT"
              ? "Bending Movement"
              : m.type === "BIAXIAL"
              ? "Test Spec"   // ★ ADDED: BI AXIAL now labels this row "Test Spec" instead of "Test Load"
              : "Test Load";

          const cardData = machineInputs[m.name];
          const cardCyclesNum = parseFloat(cardData.cycles) || 0;
          const cardAcceptedNum = parseFloat(cardData.acceptanceCycles) || 0;
          const cardRawPercent =
            cardAcceptedNum > 0 ? (cardCyclesNum / cardAcceptedNum) * 100 : 0;
          const cardClampedPercent = Math.min(Math.max(cardRawPercent, 0), 100);
          const cardPercentLabel = `${cardRawPercent.toFixed(1)}%`;
          const cardMiniRingOffset =
            miniRingCircumference * (1 - cardClampedPercent / 100);

          return (
            <div key={m.name} style={styles.card}>
              <div style={styles.miniRingBadge}>
                <span style={styles.miniRingLabel}>Test Status</span>
                <svg width="46" height="46" viewBox="0 0 46 46">
                  <circle
                    cx="23"
                    cy="23"
                    r={miniRingRadius}
                    stroke="#fca5a5"
                    strokeWidth="5"
                    fill="none"
                  />
                  <circle
                    cx="23"
                    cy="23"
                    r={miniRingRadius}
                    stroke="#16a34a"
                    strokeWidth="5"
                    fill="none"
                    strokeDasharray={miniRingCircumference}
                    strokeDashoffset={cardMiniRingOffset}
                    strokeLinecap="round"
                    transform="rotate(-90 23 23)"
                  />
                  <text
                    x="23"
                    y="27"
                    textAnchor="middle"
                    style={styles.miniRingText}
                  >
                    {cardPercentLabel}
                  </text>
                </svg>
              </div>

              <div style={styles.titleBlock}>
                <div style={styles.machineName}>{m.name}</div>
                {m.sub && <div style={styles.sub}>{m.sub}</div>}
                {m.subLines &&
                  m.subLines.map((s) => (
                    <div key={s} style={styles.sub}>{s}</div>
                  ))}
              </div>

              <div style={styles.alignRow}>
                <div style={styles.left}>
                  <img src={m.img} alt={m.name} style={styles.image} />
                </div>

                <div style={styles.form}>
                  {[
                    { key: "wheelCode", label: "Wheel Code" },
                    { key: "wheelSize", label: "Wheel Size" },
                    { key: "cycles", label: "No of Cycles" },
                    { key: "acceptanceCycles", label: "Acceptance Cycles" },
                    { key: "load", label: loadLabel },
                    { key: "testReason", label: "Test Reason" },
                  ].map((f) => (
                    <div key={f.key} style={styles.row}>
                      <label style={styles.label}>{f.label}</label>
                      <input
                        style={styles.input}
                        value={machineInputs[m.name][f.key]}
                        readOnly
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  dashboard: { padding: 20 },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  logoutBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
  },
  pageTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 20,
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 },
  card: {
    background: "white",
    padding: 14,
    borderRadius: 14,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    position: "relative",
  },
  titleBlock: { marginBottom: 6, textAlign: "center" },
  alignRow: { display: "flex", gap: 18 },
  left: { width: 140 },
  image: { width: 130, height: "100%", objectFit: "cover", borderRadius: 6 },
  form: { flex: 1 },
  row: { display: "flex", alignItems: "center", marginBottom: 6 },
  label: { width: 130, fontSize: 13, fontWeight: "600", color: "#111827", display: "block" },
  input: { width: 150, padding: 6, fontSize: 13.8 },
  machineName: { fontWeight: "bold", fontSize: 14.3, textAlign: "center", color: "#111827" },
  sub: { fontSize: 12.1, color: "#2563eb", textAlign: "center" },

  /* ---- Mini corner progress ring badge (all cards) ---- */
  miniRingBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  miniRingLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#6b7280",
    whiteSpace: "nowrap",
  },
  miniRingText: { fontSize: 8.5, fontWeight: 700, fill: "#111827" },
};

export default Dashboard;