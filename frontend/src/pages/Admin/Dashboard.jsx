import { useEffect, useState, useCallback } from "react";
import API from "../../api/axios";

/* ─── status config ──────────────────────────────────────────── */
const STATUS_CFG = {
  PENDING:    { label: "Pending",    color: "#f59e0b", dot: "#f59e0b" },
  PLACED:     { label: "Pending",    color: "#f59e0b", dot: "#f59e0b" },
  ACCEPTED:   { label: "Accepted",   color: "#818cf8", dot: "#818cf8" },
  COOKING:    { label: "Cooking",    color: "#f97316", dot: "#f97316" },
  PREPARING:  { label: "Cooking",    color: "#f97316", dot: "#f97316" },
  READY:      { label: "Ready",      color: "#10b981", dot: "#10b981" },
  SERVED:     { label: "Served",     color: "#4b5563", dot: "#6b7280" },
  COMPLETED:  { label: "Served",     color: "#4b5563", dot: "#6b7280" },
};

/* ─── helpers ────────────────────────────────────────────────── */
const fmt = (n) => typeof n === "number" ? n.toLocaleString("en-IN") : n ?? "—";
const fmtCurrency = (n) => `₹${fmt(n)}`;

const useClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
};

/* ─── mini sparkline bar chart ───────────────────────────────── */
const SparkBars = ({ values = [], color = "#6366f1" }) => {
  const max = Math.max(...values, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
      {values.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${Math.max(8, (v / max) * 100)}%`,
            background: color,
            borderRadius: 3,
            opacity: i === values.length - 1 ? 1 : 0.35 + (i / values.length) * 0.5,
            transition: "height 0.4s ease",
          }}
        />
      ))}
    </div>
  );
};

/* ─── animated counter ───────────────────────────────────────── */
const Counter = ({ to, prefix = "", duration = 900 }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const pct = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      setVal(Math.round(ease * to));
      if (pct < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to, duration]);
  return <>{prefix}{fmt(val)}</>;
};

/* ─── main component ─────────────────────────────────────────── */
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const time = useClock();

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await API.get("/admin/dashboard/summary");
      setData(res.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      // Demo data
      setData({
        totalOrders: 156,
        totalRevenue: 45680,
        totalItems: 24,
        totalTables: 10,
        todayOrders: 28,
        pendingOrders: 5,
        recentOrders: [
          { id: 105, tableId: 4, status: "PENDING",  total: 640,  items: 3 },
          { id: 104, tableId: 7, status: "COOKING",  total: 1200, items: 5 },
          { id: 103, tableId: 2, status: "READY",    total: 450,  items: 2 },
          { id: 102, tableId: 9, status: "ACCEPTED", total: 890,  items: 4 },
          { id: 101, tableId: 1, status: "SERVED",   total: 320,  items: 2 },
        ],
        hourlyOrders: [2, 5, 3, 8, 12, 9, 14, 18, 11, 7, 15, 28],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const t = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(t);
  }, [fetchData]);

  const d = data ?? {};

  const STATS = [
    {
      key: "revenue",
      label: "Total Revenue",
      value: d.totalRevenue ?? 0,
      prefix: "₹",
      icon: "₹",
      accent: "#10b981",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.2)",
      spark: d.hourlyOrders ?? [],
      sparkColor: "#10b981",
      sub: "All time",
    },
    {
      key: "orders",
      label: "Total Orders",
      value: d.totalOrders ?? 0,
      icon: "◈",
      accent: "#6366f1",
      bg: "rgba(99,102,241,0.08)",
      border: "rgba(99,102,241,0.2)",
      spark: d.hourlyOrders ?? [],
      sparkColor: "#6366f1",
      sub: "All time",
    },
    {
      key: "today",
      label: "Today's Orders",
      value: d.todayOrders ?? 0,
      icon: "◉",
      accent: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.2)",
      spark: d.hourlyOrders ?? [],
      sparkColor: "#f59e0b",
      sub: "Since midnight",
    },
    {
      key: "pending",
      label: "Pending Orders",
      value: d.pendingOrders ?? 0,
      icon: "⏳",
      accent: "#f87171",
      bg: "rgba(248,113,113,0.08)",
      border: "rgba(248,113,113,0.2)",
      spark: [],
      sub: "Need attention",
      urgent: (d.pendingOrders ?? 0) > 0,
    },
    {
      key: "items",
      label: "Menu Items",
      value: d.totalItems ?? 0,
      icon: "▣",
      accent: "#a78bfa",
      bg: "rgba(167,139,250,0.08)",
      border: "rgba(167,139,250,0.2)",
      spark: [],
      sub: "Active items",
    },
    {
      key: "tables",
      label: "Tables",
      value: d.totalTables ?? 0,
      icon: "⬡",
      accent: "#38bdf8",
      bg: "rgba(56,189,248,0.08)",
      border: "rgba(56,189,248,0.2)",
      spark: [],
      sub: "Dining capacity",
    },
  ];

  const QUICK = [
    { label: "Menu",       icon: "▣", href: "/admin/menu",          accent: "#a78bfa" },
    { label: "Tables",     icon: "⬡", href: "/admin/tables",         accent: "#38bdf8" },
    { label: "Categories", icon: "◈", href: "/admin/categories",     accent: "#6366f1" },
    { label: "QR Codes",   icon: "⊞", href: "/admin/generate-qr",    accent: "#10b981" },
    { label: "Kitchen",    icon: "🍳", href: "/kitchen",              accent: "#f97316" },
  ];

  return (
    <div className="db-root">
      <style>{CSS}</style>

      {/* ── top bar ── */}
      <header className="db-topbar">
        <div className="db-topbar-left">
          <div className="db-brand">
            <span className="db-brand-icon">⬡</span>
            <div>
              <div className="db-brand-name">Admin Console</div>
              <div className="db-brand-sub">Restaurant Management</div>
            </div>
          </div>
        </div>
        <div className="db-topbar-right">
          <div className="db-clock">
            <span className="db-clock-time">
              {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
            <span className="db-clock-date">
              {time.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
            </span>
          </div>
          <button
            className={`db-refresh ${refreshing ? "db-refresh--spin" : ""}`}
            onClick={() => fetchData(true)}
            title="Refresh"
          >
            ↻
          </button>
        </div>
      </header>

      {/* ── page title ── */}
      <div className="db-hero">
        <div className="db-hero-text">
          <h1 className="db-title">Dashboard</h1>
          <p className="db-desc">Good {greeting(time)}, here's your restaurant at a glance.</p>
        </div>
        {(d.pendingOrders ?? 0) > 0 && (
          <a href="/kitchen" className="db-alert-pill">
            <span className="db-alert-dot" />
            {d.pendingOrders} pending order{d.pendingOrders > 1 ? "s" : ""} — view kitchen
          </a>
        )}
      </div>

      {/* ── stats ── */}
      {loading ? (
        <div className="db-skeleton-grid">
          {[...Array(6)].map((_, i) => <div key={i} className="db-skeleton" style={{ animationDelay: `${i * 0.07}s` }} />)}
        </div>
      ) : (
        <div className="db-stats-grid">
          {STATS.map((s, i) => (
            <div
              key={s.key}
              className={`db-stat ${s.urgent ? "db-stat--urgent" : ""}`}
              style={{
                "--accent": s.accent,
                "--bg": s.bg,
                "--border": s.border,
                animationDelay: `${i * 0.06}s`,
              }}
            >
              <div className="db-stat-top">
                <div className="db-stat-icon">{s.icon}</div>
                <div className="db-stat-label">{s.label}</div>
              </div>
              <div className="db-stat-value">
                <Counter to={s.value} prefix={s.prefix ?? ""} duration={700 + i * 80} />
              </div>
              <div className="db-stat-bottom">
                <span className="db-stat-sub">{s.sub}</span>
                {s.spark?.length > 0 && <SparkBars values={s.spark.slice(-8)} color={s.sparkColor} />}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── recent orders ── */}
      <div className="db-section">
        <div className="db-section-head">
          <h2 className="db-section-title">Recent Orders</h2>
          <a href="/admin/orders" className="db-view-all">View all →</a>
        </div>

        {loading ? (
          <div className="db-loading-msg">Loading orders…</div>
        ) : (d.recentOrders ?? []).length === 0 ? (
          <div className="db-loading-msg">No orders yet today.</div>
        ) : (
          <div className="db-orders-wrap">
            <div className="db-orders-head">
              <span>Order</span>
              <span>Table</span>
              <span>Items</span>
              <span>Status</span>
              <span className="db-align-right">Total</span>
            </div>
            {(d.recentOrders ?? []).map((o, i) => {
              const sc = STATUS_CFG[o.status] ?? STATUS_CFG["SERVED"];
              return (
                <div key={o.id} className="db-order-row" style={{ animationDelay: `${i * 0.05}s` }}>
                  <span className="db-order-id">#{o.id}</span>
                  <span className="db-order-table">
                    <span className="db-table-badge">T{o.tableId}</span>
                  </span>
                  <span className="db-order-items">{o.items ?? "—"} items</span>
                  <span>
                    <span className="db-status-dot" style={{ "--dot": sc.dot }} />
                    <span className="db-status-label" style={{ color: sc.color }}>{sc.label}</span>
                  </span>
                  <span className="db-order-total db-align-right">{fmtCurrency(o.total)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── quick actions ── */}
      <div className="db-section">
        <div className="db-section-head">
          <h2 className="db-section-title">Quick Actions</h2>
        </div>
        <div className="db-quick-grid">
          {QUICK.map(q => (
            <a
              key={q.label}
              href={q.href}
              className="db-quick-card"
              style={{ "--qa": q.accent }}
            >
              <span className="db-quick-icon">{q.icon}</span>
              <span className="db-quick-label">{q.label}</span>
              <span className="db-quick-arrow">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const greeting = (t) => {
  const h = t.getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
};

/* ─── CSS ─────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .db-root {
    min-height: 100vh;
    background: #07070e;
    background-image:
      radial-gradient(ellipse 80% 40% at 50% -10%, rgba(99,102,241,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 50% 30% at 90% 80%, rgba(16,185,129,0.04) 0%, transparent 60%);
    padding: 0 0 60px;
    font-family: 'DM Sans', sans-serif;
    color: #e2e8f0;
  }

  /* ── Topbar ── */
  .db-topbar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 32px;
    border-bottom: 1px solid #111122;
    background: rgba(7,7,14,0.85);
    backdrop-filter: blur(12px);
    position: sticky; top: 0; z-index: 50;
  }
  .db-brand { display: flex; align-items: center; gap: 12px; }
  .db-brand-icon {
    font-size: 1.6rem; color: #6366f1;
    filter: drop-shadow(0 0 8px #6366f155);
  }
  .db-brand-name { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700; color: #fff; }
  .db-brand-sub { font-size: 0.72rem; color: #4b5563; letter-spacing: 0.5px; }
  .db-topbar-right { display: flex; align-items: center; gap: 16px; }
  .db-clock { text-align: right; }
  .db-clock-time {
    display: block; font-family: 'DM Mono', monospace;
    font-size: 1.1rem; font-weight: 500; color: #fff; letter-spacing: 1px;
  }
  .db-clock-date { font-size: 0.72rem; color: #4b5563; letter-spacing: 0.4px; }
  .db-refresh {
    width: 36px; height: 36px;
    background: #0d0d1a; border: 1px solid #1e1e2e;
    border-radius: 10px; color: #6b7280; font-size: 1.1rem;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .db-refresh:hover { color: #fff; border-color: #333; }
  .db-refresh--spin { animation: spin 0.6s linear infinite; color: #6366f1; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Hero ── */
  .db-hero {
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 16px;
    padding: 32px 32px 0;
  }
  .db-title {
    font-family: 'Syne', sans-serif;
    font-size: 2.2rem; font-weight: 800;
    color: #fff; letter-spacing: -1px;
    line-height: 1;
  }
  .db-desc { color: #4b5563; font-size: 0.88rem; margin-top: 6px; }
  .db-alert-pill {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.3);
    color: #fca5a5; padding: 10px 18px; border-radius: 999px;
    font-size: 0.82rem; font-weight: 600; text-decoration: none;
    animation: alertPulse 2s ease-in-out infinite;
    transition: background 0.2s;
  }
  .db-alert-pill:hover { background: rgba(248,113,113,0.14); }
  @keyframes alertPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(248,113,113,0); }
    50%       { box-shadow: 0 0 0 6px rgba(248,113,113,0.1); }
  }
  .db-alert-dot {
    width: 8px; height: 8px; border-radius: 50%; background: #f87171;
    animation: spin 0s, alertPulse 1.2s ease-in-out infinite;
  }

  /* ── Stats grid ── */
  .db-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
    padding: 28px 32px;
  }
  .db-skeleton-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
    padding: 28px 32px;
  }
  .db-skeleton {
    height: 140px; border-radius: 18px;
    background: linear-gradient(90deg, #0d0d1a 25%, #13131f 50%, #0d0d1a 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .db-stat {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 22px;
    position: relative; overflow: hidden;
    animation: fadeUp 0.4s ease both;
    transition: transform 0.15s, border-color 0.2s;
    cursor: default;
  }
  .db-stat::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--accent);
    opacity: 0.6;
    border-radius: 18px 18px 0 0;
  }
  .db-stat:hover { transform: translateY(-3px); border-color: var(--accent); }
  .db-stat:hover::before { opacity: 1; }
  .db-stat--urgent { animation: fadeUp 0.4s ease both, urgentPulse 2s ease-in-out infinite; }
  @keyframes urgentPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(248,113,113,0); }
    50%       { box-shadow: 0 0 20px rgba(248,113,113,0.15); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .db-stat-top { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .db-stat-icon {
    width: 34px; height: 34px; border-radius: 9px;
    background: rgba(255,255,255,0.05);
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; color: var(--accent);
    font-family: 'DM Mono', monospace;
  }
  .db-stat-label { font-size: 0.8rem; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .db-stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 2rem; font-weight: 800;
    color: #fff; letter-spacing: -1px;
    margin-bottom: 14px;
    line-height: 1;
  }
  .db-stat-bottom { display: flex; justify-content: space-between; align-items: flex-end; gap: 10px; }
  .db-stat-sub { font-size: 0.72rem; color: #374151; }

  /* ── Sections ── */
  .db-section { padding: 0 32px; margin-bottom: 28px; }
  .db-section-head {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 16px;
  }
  .db-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem; font-weight: 700; color: #fff;
  }
  .db-view-all {
    font-size: 0.8rem; color: #6366f1; text-decoration: none; font-weight: 600;
    transition: color 0.15s;
  }
  .db-view-all:hover { color: #818cf8; }

  /* ── Orders table ── */
  .db-orders-wrap {
    background: #0a0a15;
    border: 1px solid #111122;
    border-radius: 18px;
    overflow: hidden;
  }
  .db-orders-head {
    display: grid;
    grid-template-columns: 80px 70px 80px 1fr 100px;
    padding: 12px 20px;
    background: #0d0d1a;
    border-bottom: 1px solid #111122;
    font-size: 0.72rem; font-weight: 700;
    color: #374151; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .db-order-row {
    display: grid;
    grid-template-columns: 80px 70px 80px 1fr 100px;
    padding: 14px 20px;
    align-items: center;
    border-bottom: 1px solid #0d0d1a;
    animation: fadeUp 0.3s ease both;
    transition: background 0.15s;
  }
  .db-order-row:last-child { border-bottom: none; }
  .db-order-row:hover { background: #0d0d18; }

  .db-order-id {
    font-family: 'DM Mono', monospace; font-size: 0.88rem;
    color: #fff; font-weight: 500;
  }
  .db-table-badge {
    background: rgba(99,102,241,0.12);
    color: #818cf8; padding: 3px 9px; border-radius: 6px;
    font-size: 0.78rem; font-weight: 700;
  }
  .db-order-items { font-size: 0.82rem; color: #4b5563; }
  .db-status-dot {
    display: inline-block; width: 7px; height: 7px;
    border-radius: 50%; background: var(--dot);
    margin-right: 7px; vertical-align: middle;
  }
  .db-status-label { font-size: 0.82rem; font-weight: 600; }
  .db-order-total {
    font-family: 'DM Mono', monospace;
    font-size: 0.9rem; font-weight: 600; color: #10b981;
  }
  .db-align-right { text-align: right; }
  .db-loading-msg {
    padding: 36px; text-align: center; color: #374151; font-size: 0.88rem;
  }

  /* ── Quick actions ── */
  .db-quick-grid {
    display: flex; gap: 12px; flex-wrap: wrap;
  }
  .db-quick-card {
    display: flex; align-items: center; gap: 10px;
    background: #0a0a15; border: 1px solid #111122;
    color: #9ca3af; text-decoration: none;
    padding: 14px 20px; border-radius: 14px;
    font-size: 0.88rem; font-weight: 600;
    transition: all 0.15s;
    position: relative; overflow: hidden;
  }
  .db-quick-card::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: var(--qa); opacity: 0;
    transition: opacity 0.2s;
  }
  .db-quick-card:hover {
    border-color: var(--qa);
    color: #fff;
    background: #0d0d18;
  }
  .db-quick-card:hover::after { opacity: 0.8; }
  .db-quick-card:hover .db-quick-icon { color: var(--qa); }
  .db-quick-icon { font-size: 1.1rem; color: #4b5563; transition: color 0.15s; }
  .db-quick-label {}
  .db-quick-arrow { margin-left: auto; color: #1f2937; transition: color 0.15s; font-size: 1rem; }
  .db-quick-card:hover .db-quick-arrow { color: var(--qa); }

  @media (max-width: 700px) {
    .db-topbar { padding: 12px 16px; }
    .db-hero, .db-stats-grid, .db-skeleton-grid, .db-section { padding-left: 16px; padding-right: 16px; }
    .db-title { font-size: 1.7rem; }
    .db-stats-grid, .db-skeleton-grid { grid-template-columns: 1fr 1fr; }
    .db-orders-head { grid-template-columns: 70px 60px 1fr 90px; }
    .db-orders-head > *:nth-child(3),
    .db-order-row > *:nth-child(3) { display: none; }
    .db-order-row { grid-template-columns: 70px 60px 1fr 90px; }
    .db-clock-time { font-size: 0.9rem; }
  }
`;

export default Dashboard;