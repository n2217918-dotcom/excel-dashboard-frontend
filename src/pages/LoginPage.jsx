import React, { useCallback, useRef, useState } from "react";
import Logo from "../components/Logo.jsx";
import Hero from "../components/Hero.jsx";
import LoginForm from "../components/LoginForm.jsx";
import Wheel from "../components/Wheel.jsx";
import NavBar from "../components/NavBar.jsx";
import IntroAnimation from "../components/IntroAnimation.jsx";
import { login } from "../services/auth.js";
import "../styles/LoginPage.css";

function LoginPage({ onLogin }) {
  const [introRunning, setIntroRunning] = useState(true);
  const [wakeStage, setWakeStage] = useState("idle");
  const [rotating, setRotating] = useState(false);
  const [attachedPoints, setAttachedPoints] = useState([false, false, false]);
  const [loginError, setLoginError] = useState("");

  const logoRef = useRef(null);
  const heroRef = useRef(null);
  const loginFormRef = useRef(null);
  const navBarRef = useRef(null);
  const footerRef = useRef(null);
  const wheelRef = useRef(null);

  const handleStarAttached = useCallback((index) => {
    setAttachedPoints((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, []);

  const handleComplete = useCallback(() => {
    setIntroRunning(false);
    setRotating(true);
  }, []);

  // CHANGED: login() now returns { success, token, message } instead
  // of just { success, message }. On success, we pass the REAL token
  // up to App.jsx, instead of calling onLogin() with no arguments.
  const handleCredentialsSubmit = useCallback(
    async ({ username, password }) => {
      const result = await login(username, password);

      if (result.success) {
        setLoginError("");
        if (onLogin) onLogin(result.token);
      } else {
        setLoginError(result.message || "Invalid credentials");
      }
    },
    [onLogin]
  );

  return (
    <div className="login-page">
      {introRunning && (
        <IntroAnimation
          logoRef={logoRef}
          heroRef={heroRef}
          loginFormRef={loginFormRef}
          navBarRef={navBarRef}
          footerRef={footerRef}
          wheelRef={wheelRef}
          onWheelWake={setWakeStage}
          onStarAttached={handleStarAttached}
          onComplete={handleComplete}
        />
      )}

      <div className="login-page-left">
        <Logo ref={logoRef} />
        <Hero ref={heroRef} />
        <LoginForm ref={loginFormRef} onSubmit={handleCredentialsSubmit} error={loginError} />
        <footer ref={footerRef} className="left-footer">
          <span>&copy; {new Date().getFullYear()} Wheels India Limited. All rights reserved.</span>
        </footer>
      </div>

      <div className="login-page-right">
        <NavBar ref={navBarRef} />
        <Wheel ref={wheelRef} wakeStage={wakeStage} rotating={rotating} attachedPoints={attachedPoints} />
      </div>
    </div>
  );
}

export default LoginPage;
