
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    registration_number: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(formData);

      setSuccess(
        "Student account created successfully. You can now sign in."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error(err);

      const backendError = err.response?.data?.error;

      if (typeof backendError === "object") {
        const messages = Object.values(backendError)
          .flat()
          .join(" ");

        setError(messages || "Registration failed.");
      } else {
        setError(
          backendError ||
            err.response?.data?.message ||
            "Could not create account."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Create Student Account</h1>

        <p className="login-subtitle">
          Create your hostel management account
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {success && (
          <div className="login-success">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>

          {/* FIRST NAME */}
          <div className="form-group">
            <label htmlFor="first_name">
              FIRST NAME
            </label>

            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
            />
          </div>

          {/* LAST NAME */}
          <div className="form-group">
            <label htmlFor="last_name">
              LAST NAME
            </label>

            <input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
            />
          </div>

          {/* REGISTRATION NUMBER */}
          <div className="form-group">
            <label htmlFor="registration_number">
              REGISTRATION NUMBER
            </label>

            <input
              id="registration_number"
              name="registration_number"
              type="text"
              value={formData.registration_number}
              onChange={handleChange}
              placeholder="e.g. SE001/2026"
              required
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label htmlFor="register-email">
              EMAIL ADDRESS
            </label>

            <input
              id="register-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label htmlFor="register-password">
              PASSWORD
            </label>

            <div className="password-wrapper">
              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                minLength={6}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* ROLE INFORMATION */}
          <div className="form-group">
            <label>
              ACCOUNT TYPE
            </label>

            <input
              type="text"
              value="Student"
              disabled
            />

            <small>
              Student accounts are created through public registration.
              Administrator, Warden and Finance accounts are managed
              by authorized administrators.
            </small>
          </div>

          {/* CREATE ACCOUNT */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Student Account"}
          </button>

        </form>

        {/* BACK TO LOGIN */}
        <div className="register-section">
          <span>
            Already have an account?
          </span>{" "}

          <button
            type="button"
            className="create-account"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>

      </div>
    </div>
  );
}
