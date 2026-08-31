// Centralized authentication logic. Any component that needs to log a
// user in only ever calls this function — swapping in a real backend
// call later means editing this one file, not every place that
// currently checks a username/password.
//
// Kept async/Promise-based on purpose, even though today's check is
// synchronous — this is the shape a real fetch()-based login call
// will already have, so callers won't need to change when this
// function's internals eventually do.

const VALID_USERNAME = "wil";
const VALID_PASSWORD = "WH#ee@LS&";

export async function login(username, password) {
  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    return { success: true };
  }
  return { success: false, message: "Invalid credentials" };
}