// Centralized authentication logic. Any component that needs to log a
// user in only ever calls this function.
//
// CHANGED: this no longer checks a hardcoded username/password. It
// now sends the entered credentials to the REAL backend, which is the
// only place that should ever decide whether a login is valid.
//
// The backend responds with either:
//   { success: true, token: "..." }   - correct credentials
//   { success: false, message: "..." } - wrong credentials
// This function passes that shape straight through, unchanged, so
// LoginPage.jsx does not need to be rewritten for this change.

import { API_BASE_URL } from "./api.js";

export async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log("LOGIN RESPONSE:", data);
    return data;
  } catch (error) {
    // Network failure, backend down, etc. - not a wrong password,
    // but the caller (LoginPage) treats any non-success result the
    // same way: show the message, stay on the login screen.
    return { success: false, message: "Could not reach the server. Please try again." };
  }
}
