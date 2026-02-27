import { useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", form);
      const token = res.data.token;

      // Determine role based on username
      const role = form.username.toLowerCase() === "admin"
        ? "ROLE_ADMIN"
        : "ROLE_KITCHEN";

      login(token, role);

      if (role === "ROLE_ADMIN") navigate("/admin");
      else navigate("/kitchen");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <style>{`
        .login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .login-card {
          background: linear-gradient(145deg, #1e2a4a 0%, #0f1729 100%);
          border-radius: 30px;
          padding: 50px 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 25px 70px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #e94560, #ff6b6b, #4ade80);
        }

        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .login-logo {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          margin: 0 auto 20px;
          box-shadow: 0 10px 30px rgba(233, 69, 96, 0.3);
        }

        .login-title {
          color: white;
          font-size: 1.8rem;
          margin: 0 0 10px;
          font-weight: 700;
        }

        .login-subtitle {
          color: rgba(255,255,255,0.6);
          margin: 0;
          font-size: 1rem;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-label {
          display: block;
          color: rgba(255,255,255,0.7);
          margin-bottom: 10px;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .form-input {
          width: 100%;
          padding: 16px 20px;
          background: rgba(255,255,255,0.05);
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 15px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .form-input::placeholder {
          color: rgba(255,255,255,0.4);
        }

        .form-input:focus {
          outline: none;
          border-color: #e94560;
          background: rgba(233, 69, 96, 0.1);
          box-shadow: 0 0 20px rgba(233, 69, 96, 0.2);
        }

        .login-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
          border: none;
          border-radius: 15px;
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
          box-shadow: 0 10px 30px rgba(233, 69, 96, 0.3);
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(233, 69, 96, 0.5);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 12px 15px;
          border-radius: 10px;
          margin-bottom: 20px;
          text-align: center;
          font-size: 0.9rem;
        }

        .login-divider {
          display: flex;
          align-items: center;
          margin: 30px 0;
          color: rgba(255,255,255,0.4);
          font-size: 0.9rem;
        }

        .login-divider::before,
        .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.1);
        }

        .login-divider span {
          padding: 0 15px;
        }

        .role-buttons {
          display: flex;
          gap: 10px;
        }

        .role-btn {
          flex: 1;
          padding: 12px;
          background: rgba(255,255,255,0.05);
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .role-btn:hover {
          background: rgba(233, 69, 96, 0.1);
          border-color: rgba(233, 69, 96, 0.3);
        }

        .role-btn.selected {
          background: rgba(233, 69, 96, 0.2);
          border-color: #e94560;
          color: white;
        }

        .demo-info {
          text-align: center;
          margin-top: 25px;
          color: rgba(255,255,255,0.4);
          font-size: 0.8rem;
        }

        .demo-info span {
          color: #4ade80;
        }

        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-right: 10px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🍽️</div>
          <h1 className="login-title">QR Menu</h1>
          <p className="login-subtitle">Sign in to manage your restaurant</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="Enter password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyPress={handleKeyPress}
          />
        </div>

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>

        <div className="login-divider">
          <span>Demo Accounts</span>
        </div>

        <div className="role-buttons">
          <button
            className={`role-btn ${form.username.toLowerCase() === 'admin' ? 'selected' : ''}`}
            onClick={() => setForm({ ...form, username: 'admin', password: 'admin123' })}
          >
            👑 Admin
          </button>
          <button
            className={`role-btn ${form.username.toLowerCase() === 'kitchen' ? 'selected' : ''}`}
            onClick={() => setForm({ ...form, username: 'kitchen', password: 'kitchen123' })}
          >
            👨‍🍳 Kitchen
          </button>
        </div>

        <div className="demo-info">
          <p>Click the buttons above to use demo credentials</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
