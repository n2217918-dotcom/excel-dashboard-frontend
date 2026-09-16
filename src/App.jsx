import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

function App() {
  // CHANGED: instead of a plain true/false, we now store the actual
  // JWT token. "Logged in" is now defined as "we have a token" -
  // token === null means logged out, a real string means logged in.
  const [token, setToken] = useState(null);

  return token ? (
    <Dashboard token={token} onLogout={() => setToken(null)} />
  ) : (
    <LoginPage onLogin={(newToken) => setToken(newToken)} />
  );
}

export default App;
