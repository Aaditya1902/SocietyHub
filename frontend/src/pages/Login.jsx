import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import societyHubLogo from "../assets/societyhub-logo.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const loginResponse = await api.post("/Auth/login", {
        email,
        password,
      });

      const token = loginResponse.data.token;

      localStorage.setItem("token", token);

      const meResponse = await api.get("/Auth/me");

      localStorage.setItem("role", meResponse.data.role);
      localStorage.setItem("userId", meResponse.data.userId);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        error.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-shell">

        {/* Left Branding Section */}
        <section className="login-brand">

          <div className="login-brand-content">

            <div className="login-brand-logo">
              <img
                src={societyHubLogo}
                alt="SocietyHub"
                className="login-logo"
              />
            </div>

            <div className="login-brand-heading">

              <p className="brand-eyebrow">
                SMART SOCIETY MANAGEMENT
              </p>

              <h1>
                Everything your
                <br />
                <span>society needs.</span>
              </h1>

              <p className="brand-description">
                Manage visitors, complaints, maintenance, amenities and
                residents from one simple platform.
              </p>

            </div>

            <div className="brand-features">

              <div className="brand-feature">
                <div className="feature-check">✓</div>

                <div>
                  <strong>Smart Visitor Management</strong>
                  <span>
                    Approve visitors and generate secure QR passes.
                  </span>
                </div>
              </div>

              <div className="brand-feature">
                <div className="feature-check">✓</div>

                <div>
                  <strong>Simple Society Operations</strong>
                  <span>
                    Manage complaints, bills and amenities easily.
                  </span>
                </div>
              </div>

              <div className="brand-feature">
                <div className="feature-check">✓</div>

                <div>
                  <strong>Role-Based Access</strong>
                  <span>
                    Different experiences for residents and admins.
                  </span>
                </div>
              </div>

            </div>

            <p className="brand-copyright">
              © 2026 SocietyHub
            </p>

          </div>

        </section>

        {/* Login Section */}
        <section className="login-panel">

          <div className="login-card">

            {/* Mobile Logo */}
            <div className="mobile-logo">
              <img
                src={societyHubLogo}
                alt="SocietyHub"
                className="mobile-login-logo"
              />
            </div>

            <div className="login-heading">

              <p className="login-eyebrow">
                WELCOME BACK
              </p>

              <h2>
                Sign in to your account
              </h2>

              <p>
                Access your society dashboard and services.
              </p>

            </div>

            <form
              onSubmit={handleLogin}
              className="login-form"
            >

              <div className="form-group">

                <label htmlFor="email">
                  Email address
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    ✉
                  </span>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    autoComplete="email"
                  />

                </div>

              </div>

              <div className="form-group">

                <div className="password-label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                </div>

                <div className="input-wrapper">

                  <span className="input-icon">
                    ●
                  </span>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

              {error && (
                <div className="login-error">

                  <span>!</span>

                  {error}

                </div>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="button-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <span>→</span>
                  </>
                )}

              </button>

            </form>

            <div className="login-info">

              <span className="info-dot"></span>

              Secure authentication powered by SocietyHub

            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

export default Login;