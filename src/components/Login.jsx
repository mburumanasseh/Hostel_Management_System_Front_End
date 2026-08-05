
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await login({
        email,
        password,
      });

      const { access_token, user } = response.data;

      if (rememberMe) {
        localStorage.setItem(
          "access_token",
          access_token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      } else {
        sessionStorage.setItem(
          "access_token",
          access_token
        );

        sessionStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      console.log(
        "Logged in user:",
        user
      );

      navigate("/");

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

        <h1>Welcome back</h1>

        <p className="login-subtitle">
          Sign in to your hostel management account
        </p>

        {error && (
          <div className="login-error">
            {typeof error === "object"
              ? JSON.stringify(error)
              : error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="email">
              EMAIL ADDRESS
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@mwangaza.ac.ke"
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="password">
              PASSWORD
            </label>

            <div className="password-wrapper">

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                ◉
              </button>

            </div>

          </div>


          {/* OPTIONS */}

          <div className="login-options">

            <label className="remember-me">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(
                    e.target.checked
                  )
                }
              />

              <span>
                Remember me
              </span>

            </label>


            <button
              type="button"
              className="forgot-password"
              onClick={() =>
                navigate(
                  "/forgot-password"
                )
              }
            >
              Forgot password?
            </button>

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >

            <span className="login-icon">
              ↪
            </span>

            {loading
              ? "Signing in..."
              : "Sign In"}

          </button>

        </form>


        {/* REGISTER */}

        <div className="register-section">

          <span>
            New staff member?
          </span>{" "}

          <button
            type="button"
            className="create-account"
            onClick={() =>
              navigate("/register")
            }
          >
            Create an account
          </button>

        </div>

      </div>

    </div>
  );
}
