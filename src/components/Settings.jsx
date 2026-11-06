import { useState } from "react";
import { changePassword } from "../api";
import { getLoggedInUser } from "../utils/auth";

export default function Settings() {
  const user = getLoggedInUser();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from your current password.");
      return;
    }

    setLoading(true);
    try {
      const res = await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSuccess(res.data?.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err.response?.data?.error;
      setError(
        typeof msg === "string"
          ? msg
          : msg
            ? JSON.stringify(msg)
            : err.message || "Could not change password"
      );
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    width: "100%",
    padding: "0.65rem 0.85rem",
    borderRadius: 8,
    border: "1px solid #d0d7de",
    fontSize: "1rem",
  };

  const labelStyle = {
    display: "block",
    marginBottom: 6,
    fontSize: "0.8rem",
    fontWeight: 600,
    letterSpacing: "0.03em",
    color: "#445",
  };

  return (
    <div className="settings-page" style={{ maxWidth: 560 }}>
      <div className="page-header" style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0 }}>Settings</h1>
        <p style={{ margin: "0.4rem 0 0", opacity: 0.8 }}>
          Manage your account security and preferences.
        </p>
      </div>

      {/* Profile summary */}
      <section
        style={{
          marginBottom: "1.5rem",
          padding: "1.25rem",
          borderRadius: 12,
          background: "#fff",
          border: "1px solid #e8ecf1",
        }}
      >
        <h2 style={{ margin: "0 0 0.75rem", fontSize: "1.05rem" }}>
          Account
        </h2>
        <p style={{ margin: "0.25rem 0" }}>
          <strong>Name:</strong>{" "}
          {user
            ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
            : "—"}
        </p>
        <p style={{ margin: "0.25rem 0" }}>
          <strong>Email:</strong> {user?.email || "—"}
        </p>
        <p style={{ margin: "0.25rem 0" }}>
          <strong>Role:</strong> {user?.role || "—"}
        </p>
      </section>

      {/* Change password */}
      <section
        style={{
          padding: "1.25rem",
          borderRadius: 12,
          background: "#fff",
          border: "1px solid #e8ecf1",
        }}
      >
        <h2 style={{ margin: "0 0 0.35rem", fontSize: "1.05rem" }}>
          Change password
        </h2>
        <p style={{ margin: "0 0 1.25rem", opacity: 0.8, fontSize: "0.95rem" }}>
          Enter your current password, then choose a new password and confirm
          it.
        </p>

        {error && (
          <div
            className="login-error"
            style={{
              marginBottom: "1rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: "rgba(239,68,68,0.1)",
              color: "#b91c1c",
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: "rgba(34,197,94,0.12)",
              color: "#15803d",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label htmlFor="current_password" style={labelStyle}>
              CURRENT PASSWORD
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="current_password"
                type={show.current ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
                style={fieldStyle}
              />
              <button
                type="button"
                onClick={() =>
                  setShow((s) => ({ ...s, current: !s.current }))
                }
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  opacity: 0.7,
                }}
              >
                {show.current ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label htmlFor="new_password" style={labelStyle}>
              NEW PASSWORD
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="new_password"
                type={show.next ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
                style={fieldStyle}
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  opacity: 0.7,
                }}
              >
                {show.next ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "1.25rem" }}>
            <label htmlFor="confirm_password" style={labelStyle}>
              CONFIRM NEW PASSWORD
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="confirm_password"
                type={show.confirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
                style={fieldStyle}
              />
              <button
                type="button"
                onClick={() =>
                  setShow((s) => ({ ...s, confirm: !s.confirm }))
                }
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  opacity: 0.7,
                }}
              >
                {show.confirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
            style={{ padding: "0.65rem 1.25rem" }}
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </section>
    </div>
  );
}
