import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      setError("Enter both username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", form);
      const { token, role } = res.data;
      login(token, role);
      navigate(role === "ROLE_ADMIN" ? "/admin" : "/kitchen");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <style>{CSS}</style>

      <section className="auth-info">
        <p className="auth-eyebrow">Restaurant operations suite</p>
        <h1>Run service, kitchen, and menu control from one secure workspace.</h1>
        <p className="auth-copy">
          Sign in to access live order management, admin configuration, dining floor setup, and kitchen execution tools.
        </p>

        <div className="auth-metrics">
          <article>
            <span>Live Queue</span>
            <strong>Kitchen + Admin</strong>
          </article>
          <article>
            <span>Access Model</span>
            <strong>Role-protected routes</strong>
          </article>
          <article>
            <span>Flow</span>
            <strong>Order to service handoff</strong>
          </article>
        </div>
      </section>

      <section className="auth-card">
        <div className="auth-card-head">
          <div className="auth-mark">QRM</div>
          <div>
            <h2>Sign in</h2>
            <p>Use your assigned account to continue.</p>
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="field">
          <span>Username</span>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter username"
          />
        </div>

        <div className="field">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter password"
          />
        </div>

        <button className="submit-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Continue"}
        </button>
      </section>
    </div>
  );
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .auth-shell {
    min-height: 100vh;
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(380px, 460px);
    background:
      radial-gradient(circle at top left, rgba(244, 183, 64, 0.22), transparent 24%),
      radial-gradient(circle at bottom right, rgba(83, 128, 255, 0.12), transparent 24%),
      linear-gradient(180deg, #f7f3ea 0%, #efe7da 100%);
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #17212b;
  }

  .auth-info,
  .auth-card {
    padding: 48px;
  }

  .auth-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .auth-eyebrow {
    margin: 0 0 14px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 0.74rem;
    color: #b66b2c;
    font-weight: 700;
  }

  .auth-info h1 {
    margin: 0;
    font-size: clamp(2.4rem, 5vw, 4.6rem);
    line-height: 0.95;
    letter-spacing: -0.06em;
    max-width: 760px;
  }

  .auth-copy {
    margin: 20px 0 0;
    max-width: 620px;
    color: #6d7785;
    line-height: 1.8;
    font-size: 1rem;
  }

  .auth-metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-top: 32px;
    max-width: 780px;
  }

  .auth-metrics article,
  .auth-card {
    background: rgba(255, 252, 246, 0.84);
    border: 1px solid rgba(23, 33, 43, 0.08);
    box-shadow: 0 24px 80px rgba(77, 56, 20, 0.09);
    backdrop-filter: blur(12px);
  }

  .auth-metrics article {
    padding: 18px;
    border-radius: 22px;
  }

  .auth-metrics span,
  .auth-card-head p,
  .field span {
    color: #6d7785;
  }

  .auth-metrics strong {
    display: block;
    margin-top: 8px;
    font-size: 1rem;
  }

  .auth-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 18px;
    border-left: 1px solid rgba(23, 33, 43, 0.08);
  }

  .auth-card-head {
    display: grid;
    grid-template-columns: 62px 1fr;
    gap: 14px;
    align-items: center;
  }

  .auth-card-head h2 {
    margin: 0 0 6px;
    font-size: 1.7rem;
  }

  .auth-card-head p {
    margin: 0;
  }

  .auth-mark {
    width: 62px;
    height: 62px;
    border-radius: 20px;
    background: #17212b;
    color: #fff;
    display: grid;
    place-items: center;
    font-size: 0.94rem;
    font-weight: 800;
    letter-spacing: 0.08em;
  }

  .field {
    display: grid;
    gap: 8px;
    font-size: 0.86rem;
    font-weight: 700;
  }

  .field input {
    width: 100%;
    border: 1px solid rgba(23, 33, 43, 0.1);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.74);
    padding: 15px 16px;
    font: inherit;
  }

  .submit-btn {
    border: none;
    border-radius: 16px;
    font: inherit;
  }

  .submit-btn {
    padding: 15px 18px;
    background: #17212b;
    color: #fff;
    font-weight: 800;
    cursor: pointer;
  }

  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .error-box {
    padding: 12px 14px;
    border-radius: 14px;
    background: rgba(239, 107, 115, 0.12);
    color: #b4434b;
    border: 1px solid rgba(180, 67, 75, 0.18);
  }

  @media (max-width: 980px) {
    .auth-shell {
      grid-template-columns: 1fr;
    }

    .auth-info {
      padding-bottom: 16px;
    }

    .auth-card {
      margin: 0 16px 16px;
      border-left: none;
      border-radius: 28px;
    }
  }

  @media (max-width: 640px) {
    .auth-info,
    .auth-card {
      padding: 22px;
    }

    .auth-metrics {
      grid-template-columns: 1fr;
    }
  }
`;

export default Login;
