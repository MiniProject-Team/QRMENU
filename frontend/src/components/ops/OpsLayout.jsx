import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const adminLinks = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/menu", label: "Menu" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/tables", label: "Tables" },
  { to: "/admin/generate-qr", label: "QR" },
  { to: "/kitchen", label: "Kitchen" },
];

const kitchenLinks = [
  { to: "/kitchen", label: "Kitchen" },
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/orders", label: "Orders" },
];

const linkSet = {
  admin: adminLinks,
  kitchen: kitchenLinks,
};

const OpsLayout = ({
  title,
  subtitle,
  eyebrow,
  role = "admin",
  badge,
  children,
  actions,
}) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const navLinks = linkSet[role] ?? adminLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="ops-shell">
      <style>{CSS}</style>

      <aside className="ops-sidebar">
        <Link to={role === "kitchen" ? "/kitchen" : "/admin"} className="ops-brand">
          <span className="ops-brand-mark">{role === "kitchen" ? "KIT" : "QRM"}</span>
          <span>
            <strong>{role === "kitchen" ? "Kitchen Desk" : "QR Menu Ops"}</strong>
            <small>{role === "kitchen" ? "Service station" : "Admin workspace"}</small>
          </span>
        </Link>

        <nav className="ops-nav">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to} className={`ops-nav-link ${active ? "is-active" : ""}`}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ops-sidebar-card">
          <span className="ops-sidebar-label">Workspace</span>
          <strong>{role === "kitchen" ? "Live prep queue" : "Operational control"}</strong>
          <p>
            {role === "kitchen"
              ? "Track active tickets, prep timing, and service handoff in real time."
              : "Manage orders, menu configuration, floor setup, and restaurant operations."}
          </p>
        </div>

        <button className="ops-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="ops-main">
        <header className="ops-header">
          <div>
            {eyebrow && <p className="ops-eyebrow">{eyebrow}</p>}
            <h1 className="ops-title">{title}</h1>
            {subtitle && <p className="ops-subtitle">{subtitle}</p>}
          </div>

          <div className="ops-header-actions">
            {badge && <div className="ops-badge">{badge}</div>}
            {actions}
          </div>
        </header>

        <section className="ops-content">{children}</section>
      </main>
    </div>
  );
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

  .ops-shell {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    background:
      radial-gradient(circle at top left, rgba(244, 183, 64, 0.18), transparent 20%),
      radial-gradient(circle at bottom right, rgba(83, 128, 255, 0.1), transparent 24%),
      linear-gradient(180deg, #f7f3ea 0%, #efe7da 100%);
    color: #17212b;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .ops-sidebar {
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding: 24px 18px;
    background: rgba(253, 249, 241, 0.74);
    border-right: 1px solid rgba(23, 33, 43, 0.08);
    backdrop-filter: blur(14px);
  }

  .ops-brand {
    display: grid;
    grid-template-columns: 54px 1fr;
    gap: 12px;
    align-items: center;
    text-decoration: none;
    color: inherit;
  }

  .ops-brand-mark {
    width: 54px;
    height: 54px;
    border-radius: 18px;
    background: #17212b;
    color: #fff;
    display: grid;
    place-items: center;
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0.08em;
  }

  .ops-brand strong {
    display: block;
    font-size: 1rem;
    margin-bottom: 4px;
  }

  .ops-brand small,
  .ops-subtitle,
  .ops-sidebar-card p,
  .ops-sidebar-label {
    color: #6d7785;
  }

  .ops-nav {
    display: grid;
    gap: 8px;
  }

  .ops-nav-link {
    padding: 12px 14px;
    border-radius: 14px;
    text-decoration: none;
    color: #415063;
    font-weight: 700;
    transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
  }

  .ops-nav-link:hover {
    background: rgba(23, 33, 43, 0.06);
    color: #17212b;
    transform: translateX(2px);
  }

  .ops-nav-link.is-active {
    background: #17212b;
    color: #fff;
  }

  .ops-sidebar-card {
    margin-top: auto;
    padding: 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.66);
    border: 1px solid rgba(23, 33, 43, 0.08);
  }

  .ops-sidebar-label {
    display: block;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 0.68rem;
    font-weight: 800;
  }

  .ops-sidebar-card strong {
    display: block;
    margin-bottom: 8px;
  }

  .ops-sidebar-card p {
    margin: 0;
    line-height: 1.6;
    font-size: 0.88rem;
  }

  .ops-logout {
    border: none;
    border-radius: 16px;
    padding: 14px 16px;
    background: #f4ded6;
    color: #9b3e3e;
    font: inherit;
    font-weight: 800;
    cursor: pointer;
  }

  .ops-main {
    padding: 24px;
  }

  .ops-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 18px;
    margin-bottom: 18px;
    padding: 24px;
    border-radius: 26px;
    background: rgba(255, 252, 246, 0.84);
    border: 1px solid rgba(23, 33, 43, 0.08);
    box-shadow: 0 24px 80px rgba(77, 56, 20, 0.09);
    backdrop-filter: blur(12px);
  }

  .ops-eyebrow {
    margin: 0 0 10px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 0.72rem;
    color: #b66b2c;
    font-weight: 700;
  }

  .ops-title {
    margin: 0;
    font-size: clamp(1.8rem, 4vw, 3rem);
    letter-spacing: -0.05em;
    line-height: 0.95;
  }

  .ops-subtitle {
    margin: 12px 0 0;
    max-width: 760px;
    line-height: 1.6;
  }

  .ops-header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .ops-badge {
    padding: 12px 14px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(23, 33, 43, 0.08);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.86rem;
  }

  .ops-content {
    display: grid;
    gap: 18px;
  }

  @media (max-width: 980px) {
    .ops-shell {
      grid-template-columns: 1fr;
    }

    .ops-sidebar {
      gap: 14px;
      border-right: none;
      border-bottom: 1px solid rgba(23, 33, 43, 0.08);
    }

    .ops-sidebar-card {
      margin-top: 0;
    }
  }

  @media (max-width: 640px) {
    .ops-main,
    .ops-sidebar {
      padding: 16px;
    }

    .ops-header {
      padding: 18px;
    }

    .ops-header-actions {
      justify-content: stretch;
    }

    .ops-badge {
      width: 100%;
    }
  }
`;

export default OpsLayout;
