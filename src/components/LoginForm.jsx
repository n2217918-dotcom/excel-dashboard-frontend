import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { FiEye, FiEyeOff, FiUser, FiLock } from "react-icons/fi";

// IntroAnimation animates form.card (scale/y/blur), form.inputs as an
// array with stagger (opacity/x), and form.button separately. This
// component groups the username field, password field, and the
// remember/forgot row into three "input" targets, matching that.
//
// This component owns no entrance animation of its own — it only ever
// exposes DOM nodes. IntroAnimation is the single source of truth for
// opacity/transform.
//
// It also owns no authentication logic — it only collects input and
// reports it upward via onSubmit. Validation and credential checking
// live in services/auth.js, called from LoginPage.
const LoginForm = forwardRef(function LoginForm({ onSubmit, error }, ref) {
  const cardRef = useRef(null);
  const usernameGroupRef = useRef(null);
  const passwordGroupRef = useRef(null);
  const optionsRowRef = useRef(null);
  const buttonRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      card: cardRef.current,
      inputs: [usernameGroupRef.current, passwordGroupRef.current, optionsRowRef.current].filter(Boolean),
      button: buttonRef.current,
    }),
    []
  );

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ username, password, rememberMe });
  };

  return (
    <form ref={cardRef} className="login-card" onSubmit={handleSubmit}>
      <h2 className="login-card-title">Sign In</h2>
      <p className="login-card-subtitle">Access your industrial dashboard</p>

      <div ref={usernameGroupRef} className="input-group">
        <label htmlFor="username" className="input-label">
          Username
        </label>
        <div className="input-field">
          <FiUser className="input-icon" />
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
      </div>

      <div ref={passwordGroupRef} className="input-group">
        <label htmlFor="password" className="input-label">
          Password
        </label>
        <div className="input-field">
          <FiLock className="input-icon" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="eye-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>

      <div ref={optionsRowRef} className="login-options">
        <label className="remember-me">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span className="checkbox-custom"></span>
          Remember Me
        </label>
        <a href="#forgot" className="forgot-password">
          Forgot Password?
        </a>
      </div>

      {error && (
        <p style={{ color: "#ff6b6b", fontSize: "0.85rem", margin: "-8px 0 0" }}>
          {error}
        </p>
      )}

      <button ref={buttonRef} type="submit" className="login-button">
        Login
      </button>
    </form>
  );
});

export default LoginForm;