import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(location.state?.from?.pathname ?? "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleLogin} noValidate>
        <h1>
          MINE<span>SAFE</span>
        </h1>

        <p>Mine Operations &amp; Safety Management Portal</p>

        <label className="sr-only" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />

        <label className="sr-only" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="primary-btn login-btn" disabled={submitting}>
          {submitting ? "Signing in…" : "Login"}
        </button>

        <small>Secure Mine Operations System</small>
      </form>
    </div>
  );
}

export default Login;