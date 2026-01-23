import { useState, useEffect } from "react";

function App() {
  /* ================= LOGIN ================= */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  /* ================= MACHINE STATE ================= */
  const [machineInputs, setMachineInputs] = useState({
    "CFT-1": { wheelCode: "", wheelSize: "", cycles: "", load: "", testReason: "" },
    "CFT-2": { wheelCode: "", wheelSize: "", cycles: "", load: "", testReason: "" },
    "CFT-3": { wheelCode: "", wheelSize: "", cycles: "", load: "", testReason: "" },
    "RFT-1&2": { wheelCode: "", wheelSize: "", cycles: "", load: "", testReason: "" },
    "RFT-3&4": { wheelCode: "", wheelSize: "", cycles: "", load: "", testReason: "" },
    "RFT-5&6": { wheelCode: "", wheelSize: "", cycles: "", load: "", testReason: "" },
    "BI AXIAL-CV": { wheelCode: "", wheelSize: "", cycles: "", load: "", testReason: "" },
    "BI AXIAL-LP": { wheelCode: "", wheelSize: "", cycles: "", load: "", testReason: "" },
  });

  /* ================= FETCH BACKEND (FIXED) ================= */
  useEffect(() => {
    if (!isLoggedIn) return;

    fetch("https://excel-dashboard-backend-q2nl.onrender.com/api/dashboard-data")
      .then((res) => res.json())
      .then((data) => {
        const updated = { ...machineInputs };

        Object.keys(updated).forEach((machine) => {
          if (!data[machine]) return;

          updated[machine] = {
            ...updated[machine],
            wheelCode: data[machine].wheelCode || "",
            wheelSize: data[machine].wheelSize || "",
            testReason: data[machine].testReason || "",
            load:
              data[machine].bendingMovement ??
              data[machine].testLoad ??
              "",
          };
        });

        setMachineInputs(updated);
      })
      .catch((err) => console.error("Backend error:", err));
  }, [isLoggedIn]);

  /* ================= MACHINE CONFIG ================= */
  const machines = [
    { name: "CFT-1", type: "CFT", sub: "10 KN", img: "/images/cft1_2.png" },
    { name: "CFT-2", type: "CFT", sub: "60 KN", img: "/images/cft1_2.png" },
    { name: "CFT-3", type: "CFT", sub: "105 KN", img: "/images/cft3.png" },
    { name: "RFT-1&2", type: "RFT", sub: "3 TON", img: "/images/rft1_2.png" },
    { name: "RFT-3&4", type: "RFT", sub: "10 TON", img: "/images/rft3_4.png" },
    { name: "RFT-5&6", type: "RFT", sub: "10 & 15 TON", img: "/images/rft5_6.png" },
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

  /* ================= LOGIN ================= */
  const login = (e) => {
    e.preventDefault();
    if (username === "wil" && password === "123456") {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.loginPage}>
        <form style={styles.loginCard} onSubmit={login}>
          <h2 style={{ textAlign: "center" }}>Login</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input
            style={styles.loginInput}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            style={styles.loginInput}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button style={styles.loginButton}>Login</button>
        </form>
      </div>
    );
  }

  /* ================= DASHBOARD ================= */
  return (
    <div style={styles.dashboard}>
      <div style={styles.header}>
        <h2>WHEELS INDIA LIMITED</h2>
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>

      <div style={styles.grid}>
        {machines.map((m) => {
          const loadLabel = m.type === "CFT" ? "Bending Movement" : "Test Load";

          return (
            <div key={m.name} style={styles.card}>
              <div style={styles.titleBlock}>
                <div style={styles.machineName}>{m.name}</div>
                {m.sub && <div style={styles.sub}>{m.sub}</div>}
                {m.subLines && m.subLines.map((s) => (
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
  loginPage: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef2ff",
  },
  loginCard: {
    width: 320,
    padding: 25,
    background: "white",
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  loginInput: {
    width: "90%",
    height: 44,
    padding: "0 14px",
    marginBottom: 12,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
    display: "block",
    margin: "0 auto 12px",
  },
  loginButton: {
    width: "100%",
    height: 44,
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 6,
    fontWeight: 600,
  },
  dashboard: { padding: 20 },
  header: { display: "flex", justifyContent: "space-between", marginBottom: 20 },
  logoutBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 },
  card: {
    background: "white",
    padding: 14,
    borderRadius: 14,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  titleBlock: { marginBottom: 6 },
  alignRow: { display: "flex", gap: 18 },
  left: { width: 140 },
  image: { width: 130, height: "100%", objectFit: "cover", borderRadius: 6 },
  form: { flex: 1 },
  row: { display: "flex", alignItems: "center", marginBottom: 6 },
  label: { width: 120, fontSize: 12 },
  input: { width: 150, padding: 6, fontSize: 12 },
  machineName: { fontWeight: "bold", fontSize: 13 },
  sub: { fontSize: 11, color: "#2563eb" },
};

export default App;
