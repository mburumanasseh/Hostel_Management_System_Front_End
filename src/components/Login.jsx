import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import {
  clearAuth,
  getLoggedInUser,
  getToken,
  saveAuth,
} from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingUser, setExistingUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Show switch-account only if a token is still present in this browser.
    // Do not auto-enter the app — user must sign in or explicitly continue.
    const token = getToken();
    const user = getLoggedInUser();
    if (token && user) {
      setExistingUser(user);
    } else {
      clearAuth();
      setExistingUser(null);
    }
  }, []);

  const handleSwitchAccount = () => {
    clearAuth();
    setExistingUser(null);
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleContinue = () => {
    navigate("/dashboard");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Always start clean so a previous finance/admin session cannot stick
      clearAuth();

      const response = await login({ email, password });
      const { access_token, user } = response.data;

      saveAuth(access_token, user, rememberMe);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="auth-logo-wrap">
          <img
            src="/logo-wordmark.jpg"
            alt="Zabe Hostel Management System"
            className="auth-logo"
          />
        </div>
        <h1>Welcome back</h1>
        <p className="login-subtitle">
          Sign in to your hostel management account
        </p>

        {existingUser && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.85rem 1rem",
              borderRadius: 8,
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.3)",
              fontSize: "0.95rem",
            }}
          >
            <p style={{ margin: 0 }}>
              This browser still has a session for{" "}
              <strong>
                {existingUser.first_name} {existingUser.last_name}
              </strong>{" "}
              ({existingUser.role}).
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginTop: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                className="login-button"
                onClick={handleContinue}
                style={{ padding: "0.45rem 0.9rem" }}
              >
                Continue as {existingUser.first_name}
              </button>
              <button
                type="button"
                onClick={handleSwitchAccount}
                style={{
                  padding: "0.45rem 0.9rem",
                  borderRadius: 8,
                  border: "1px solid #555",
                  background: "transparent",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                Use a different account
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="login-error">
            {typeof error === "object" ? JSON.stringify(error) : error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">EMAIL ADDRESS</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">PASSWORD</label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "inherit",
                  opacity: 0.7,
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div
            className="form-group"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember" style={{ margin: 0 }}>
              Remember me on this device
            </label>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="login-footer" style={{ marginTop: "1rem" }}>
          <span>New student?</span>{" "}
          <button
            type="button"
            className="create-account"
            onClick={() => navigate("/register")}
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}
