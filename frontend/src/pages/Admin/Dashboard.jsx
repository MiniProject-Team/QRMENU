import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const STATUS_META = {
  PENDING: { label: "Pending", color: "#f4b740", tone: "rgba(244, 183, 64, 0.14)" },
  PLACED: { label: "Pending", color: "#f4b740", tone: "rgba(244, 183, 64, 0.14)" },
  ACCEPTED: { label: "Accepted", color: "#6ea8fe", tone: "rgba(110, 168, 254, 0.14)" },
  COOKING: { label: "Cooking", color: "#ff8a3d", tone: "rgba(255, 138, 61, 0.14)" },
  PREPARING: { label: "Cooking", color: "#ff8a3d", tone: "rgba(255, 138, 61, 0.14)" },
  READY: { label: "Ready", color: "#35c58a", tone: "rgba(53, 197, 138, 0.14)" },
  SERVED: { label: "Served", color: "#97a3b6", tone: "rgba(151, 163, 182, 0.14)" },
  COMPLETED: { label: "Served", color: "#97a3b6", tone: "rgba(151, 163, 182, 0.14)" },
  CANCELLED: { label: "Cancelled", color: "#ef6b73", tone: "rgba(239, 107, 115, 0.14)" },
};

const quickLinks = [
  { to: "/admin/orders", label: "Orders", note: "Track and update live orders", glyph: "ORD" },
  { to: "/kitchen", label: "Kitchen", note: "Monitor queue and prep status", glyph: "KIT" },
  { to: "/admin/menu", label: "Menu", note: "Edit items, prices, and stock", glyph: "MNU" },
  { to: "/admin/tables", label: "Tables", note: "Manage seating and activity", glyph: "TBL" },
  { to: "/admin/categories", label: "Categories", note: "Keep the menu organized", glyph: "CAT" },
  { to: "/admin/generate-qr", label: "QR Codes", note: "Generate table access QR", glyph: "QR" },
];

const fmtNumber = (value) => (typeof value === "number" ? value.toLocaleString("en-IN") : "0");
const fmtCurrency = (value) => `Rs ${fmtNumber(Math.round(value ?? 0))}`;

const getStatusMeta = (status) => STATUS_META[status] ?? STATUS_META.SERVED;

const getGreeting = (date) => {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(new Date());
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboard = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      setError("");
      const [summaryRes, ordersRes] = await Promise.all([
        API.get("/admin/dashboard/summary"),
        API.get("/admin/orders"),
      ]);

      setSummary(summaryRes.data ?? {});
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setSummary({});
      setOrders([]);
      setError("Unable to load dashboard data from the server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    const poll = setInterval(() => fetchDashboard(true), 30000);
    return () => clearInterval(poll);
  }, [fetchDashboard]);

  const liveOrders = orders.filter((order) => !["SERVED", "COMPLETED", "CANCELLED"].includes(order.status));
  const servedOrders = orders.filter((order) => ["SERVED", "COMPLETED"].includes(order.status));
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))
    .slice(0, 6);

  const pipeline = [
    { key: "placed", label: "Queued", count: orders.filter((o) => ["PLACED", "PENDING"].includes(o.status)).length, color: "#f4b740" },
    { key: "accepted", label: "Accepted", count: orders.filter((o) => o.status === "ACCEPTED").length, color: "#6ea8fe" },
    { key: "cooking", label: "Cooking", count: orders.filter((o) => ["COOKING", "PREPARING"].includes(o.status)).length, color: "#ff8a3d" },
    { key: "ready", label: "Ready", count: orders.filter((o) => o.status === "READY").length, color: "#35c58a" },
  ];

  const busiestTables = Object.values(
    orders.reduce((acc, order) => {
      const key = order.tableId ?? "NA";
      acc[key] ??= { tableId: key, orders: 0, revenue: 0 };
      acc[key].orders += 1;
      acc[key].revenue += order.totalAmount ?? 0;
      return acc;
    }, {})
  )
    .sort((a, b) => b.orders - a.orders || b.revenue - a.revenue)
    .slice(0, 4);

  const summaryData = summary ?? {};
  const cards = [
    {
      title: "Revenue",
      value: fmtCurrency(summaryData.totalRevenue ?? 0),
      hint: "Gross revenue tracked across paid and served orders",
      tone: "emerald",
      aside: `${fmtNumber(summaryData.completedOrders ?? servedOrders.length)} completed`,
    },
    {
      title: "Orders",
      value: fmtNumber(summaryData.totalOrders ?? orders.length),
      hint: "Total orders recorded in the system",
      tone: "blue",
      aside: `${fmtNumber(liveOrders.length)} live`,
    },
    {
      title: "Pending Attention",
      value: fmtNumber(summaryData.pendingOrders ?? pipeline[0].count),
      hint: "Orders waiting for kitchen action",
      tone: "amber",
      aside: liveOrders.length > 0 ? "Needs follow-up" : "Stable",
    },
    {
      title: "Floor Capacity",
      value: fmtNumber(summaryData.totalTables ?? 0),
      hint: "Configured tables currently available",
      tone: "slate",
      aside: `${fmtNumber(summaryData.totalItems ?? 0)} menu items`,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-shell">
      <style>{CSS}</style>

      <header className="admin-topbar">
        <div>
          <p className="eyebrow">Operations overview</p>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">
            {getGreeting(now)}. Monitor orders, kitchen throughput, and dining activity in one place.
          </p>
        </div>

        <div className="topbar-actions">
          <div className="clock-card">
            <span className="clock-time">
              {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
            <span className="clock-date">
              {now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
          <button className={`ghost-btn ${refreshing ? "is-spinning" : ""}`} onClick={() => fetchDashboard(true)}>
            Refresh
          </button>
          <button className="danger-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {loading ? (
        <div className="loading-grid">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="skeleton-card" />
          ))}
        </div>
      ) : (
        <>
          {error ? <section className="error-banner">{error}</section> : null}
          <section className="hero-grid">
            <div className="hero-panel">
              <div className="hero-copy">
                <p className="hero-kicker">Live business health</p>
                <h2>Restaurant pulse is {liveOrders.length > 5 ? "busy" : liveOrders.length > 0 ? "active" : "steady"} right now.</h2>
                <p>
                  {liveOrders.length > 0
                    ? `${liveOrders.length} active orders are moving through the kitchen. ${pipeline[3].count} are ready for service.`
                    : "No active orders at the moment. The floor is clear and the kitchen is caught up."}
                </p>
              </div>

              <div className="hero-highlights">
                <div className="hero-highlight">
                  <span className="highlight-label">Completion Rate</span>
                  <strong>
                    {orders.length > 0 ? `${Math.round((servedOrders.length / orders.length) * 100)}%` : "0%"}
                  </strong>
                </div>
                <div className="hero-highlight">
                  <span className="highlight-label">Avg Ticket</span>
                  <strong>{fmtCurrency(orders.length ? (summaryData.totalRevenue ?? 0) / Math.max(orders.length, 1) : 0)}</strong>
                </div>
                <div className="hero-highlight">
                  <span className="highlight-label">Top Table</span>
                  <strong>{busiestTables[0] ? `T${busiestTables[0].tableId}` : "None"}</strong>
                </div>
              </div>
            </div>

            <div className="action-panel">
              <div className="panel-head">
                <h3>Action Center</h3>
                <span>Quick access</span>
              </div>
              <div className="quick-link-list">
                {quickLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="quick-link">
                    <span className="quick-glyph">{link.glyph}</span>
                    <span>
                      <strong>{link.label}</strong>
                      <small>{link.note}</small>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="metric-grid">
            {cards.map((card) => (
              <article key={card.title} className={`metric-card tone-${card.tone}`}>
                <span className="metric-title">{card.title}</span>
                <strong className="metric-value">{card.value}</strong>
                <span className="metric-hint">{card.hint}</span>
                <span className="metric-aside">{card.aside}</span>
              </article>
            ))}
          </section>

          <section className="workspace-grid">
            <div className="workspace-main">
              <div className="panel-card">
                <div className="panel-head">
                  <h3>Order Pipeline</h3>
                  <span>{fmtNumber(liveOrders.length)} active orders</span>
                </div>

                <div className="pipeline-grid">
                  {pipeline.map((stage) => (
                    <div key={stage.key} className="pipeline-card">
                      <span className="pipeline-dot" style={{ background: stage.color }} />
                      <strong>{fmtNumber(stage.count)}</strong>
                      <span>{stage.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel-card">
                <div className="panel-head">
                  <h3>Recent Orders</h3>
                  <Link to="/admin/orders" className="text-link">
                    Open orders
                  </Link>
                </div>

                <div className="orders-table">
                  <div className="orders-head">
                    <span>Order</span>
                    <span>Table</span>
                    <span>Status</span>
                    <span>Items</span>
                    <span className="align-right">Total</span>
                  </div>

                  {recentOrders.length === 0 ? (
                    <div className="empty-state">No orders available yet.</div>
                  ) : (
                    recentOrders.map((order) => {
                      const meta = getStatusMeta(order.status);
                      const itemCount = Array.isArray(order.items)
                        ? order.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0)
                        : 0;

                      return (
                        <div key={order.id} className="orders-row">
                          <span className="mono">#{order.id}</span>
                          <span>T{order.tableId ?? "-"}</span>
                          <span className="status-pill" style={{ color: meta.color, background: meta.tone }}>
                            {meta.label}
                          </span>
                          <span>{fmtNumber(itemCount)}</span>
                          <span className="align-right mono">{fmtCurrency(order.totalAmount ?? 0)}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <aside className="workspace-side">
              <div className="panel-card">
                <div className="panel-head">
                  <h3>Floor Snapshot</h3>
                  <span>Best performing tables</span>
                </div>
                <div className="table-list">
                  {busiestTables.length === 0 ? (
                    <div className="empty-state compact">No table activity yet.</div>
                  ) : (
                    busiestTables.map((table) => (
                      <div key={table.tableId} className="table-row">
                        <div>
                          <strong>Table {table.tableId}</strong>
                          <small>{fmtNumber(table.orders)} orders</small>
                        </div>
                        <span className="mono">{fmtCurrency(table.revenue)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="panel-card accent-panel">
                <div className="panel-head">
                  <h3>Service Notes</h3>
                  <span>Operational focus</span>
                </div>
                <ul className="note-list">
                  <li>Watch queued orders and keep acceptance time low.</li>
                  <li>Move ready orders quickly to reduce table turnaround delay.</li>
                  <li>Review menu and table setup before peak traffic starts.</li>
                </ul>
              </div>
            </aside>
          </section>
        </>
      )}
    </div>
  );
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; }

  body {
    margin: 0;
  }

  .admin-shell {
    --bg: #f3efe6;
    --ink: #17212b;
    --muted: #6d7785;
    --line: rgba(23, 33, 43, 0.08);
    --card: rgba(255, 252, 246, 0.84);
    --card-strong: #fffdf8;
    --shadow: 0 24px 80px rgba(77, 56, 20, 0.09);
    min-height: 100vh;
    padding: 28px;
    background:
      radial-gradient(circle at top left, rgba(244, 183, 64, 0.18), transparent 28%),
      radial-gradient(circle at bottom right, rgba(83, 128, 255, 0.1), transparent 26%),
      linear-gradient(180deg, #f7f3ea 0%, #efe7da 100%);
    color: var(--ink);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .admin-topbar,
  .hero-panel,
  .action-panel,
  .metric-card,
  .panel-card {
    background: var(--card);
    border: 1px solid var(--line);
    box-shadow: var(--shadow);
    backdrop-filter: blur(12px);
  }

  .admin-topbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    padding: 28px;
    border-radius: 28px;
    margin-bottom: 22px;
  }

  .eyebrow {
    margin: 0 0 10px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 0.72rem;
    color: #b66b2c;
    font-weight: 700;
  }

  .page-title {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3.25rem);
    line-height: 0.95;
    letter-spacing: -0.05em;
  }

  .page-subtitle {
    margin: 12px 0 0;
    max-width: 720px;
    color: var(--muted);
    font-size: 0.98rem;
    line-height: 1.6;
  }

  .topbar-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .clock-card {
    min-width: 220px;
    padding: 12px 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.66);
    border: 1px solid rgba(23, 33, 43, 0.07);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .clock-time,
  .mono {
    font-family: 'IBM Plex Mono', monospace;
  }

  .clock-time {
    font-size: 1rem;
    font-weight: 600;
  }

  .clock-date {
    font-size: 0.77rem;
    color: var(--muted);
  }

  .ghost-btn,
  .danger-btn {
    border: none;
    border-radius: 16px;
    padding: 13px 18px;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
  }

  .ghost-btn {
    background: #17212b;
    color: #fff;
  }

  .danger-btn {
    background: #f4ded6;
    color: #9b3e3e;
  }

  .ghost-btn:hover,
  .danger-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(23, 33, 43, 0.12);
  }

  .is-spinning {
    opacity: 0.72;
  }

  .hero-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(320px, 0.9fr);
    gap: 18px;
    margin-bottom: 18px;
  }

  .hero-panel,
  .action-panel,
  .panel-card {
    border-radius: 26px;
    padding: 24px;
  }

  .hero-panel {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    min-height: 250px;
    background:
      linear-gradient(135deg, rgba(255, 250, 239, 0.94), rgba(247, 242, 230, 0.84)),
      radial-gradient(circle at top right, rgba(244, 183, 64, 0.16), transparent 24%);
  }

  .hero-copy h2 {
    margin: 10px 0 14px;
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    line-height: 1.05;
    letter-spacing: -0.04em;
  }

  .hero-copy p {
    margin: 0;
    max-width: 620px;
    color: var(--muted);
    line-height: 1.7;
  }

  .hero-kicker {
    margin: 0;
    color: #7b6650;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    font-size: 0.72rem;
    font-weight: 800;
  }

  .hero-highlights {
    width: min(260px, 100%);
    display: grid;
    gap: 12px;
  }

  .hero-highlight {
    padding: 16px 18px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(23, 33, 43, 0.07);
  }

  .highlight-label {
    display: block;
    color: var(--muted);
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 8px;
  }

  .hero-highlight strong {
    font-size: 1.25rem;
    letter-spacing: -0.03em;
  }

  .panel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 18px;
  }

  .panel-head h3 {
    margin: 0;
    font-size: 1.05rem;
    letter-spacing: -0.03em;
  }

  .panel-head span,
  .text-link,
  .metric-hint,
  .metric-aside,
  .empty-state,
  .table-row small {
    color: var(--muted);
  }

  .quick-link-list {
    display: grid;
    gap: 10px;
  }

  .quick-link {
    display: grid;
    grid-template-columns: 46px 1fr;
    gap: 12px;
    align-items: center;
    padding: 12px;
    border-radius: 18px;
    text-decoration: none;
    color: inherit;
    background: rgba(255, 255, 255, 0.64);
    border: 1px solid rgba(23, 33, 43, 0.07);
    transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
  }

  .quick-link:hover {
    transform: translateY(-1px);
    border-color: rgba(23, 33, 43, 0.16);
    background: rgba(255, 255, 255, 0.9);
  }

  .quick-glyph {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: #17212b;
    color: #fff;
    display: grid;
    place-items: center;
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    font-weight: 800;
  }

  .quick-link strong,
  .table-row strong {
    display: block;
    margin-bottom: 3px;
    font-size: 0.95rem;
  }

  .quick-link small {
    display: block;
    color: var(--muted);
    line-height: 1.45;
  }

  .metric-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 18px;
  }

  .metric-card {
    border-radius: 24px;
    padding: 22px;
    display: grid;
    gap: 10px;
  }

  .metric-title {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--muted);
    font-weight: 800;
  }

  .metric-value {
    font-size: clamp(1.6rem, 3vw, 2.3rem);
    letter-spacing: -0.05em;
    line-height: 1;
  }

  .metric-hint,
  .metric-aside {
    font-size: 0.84rem;
    line-height: 1.5;
  }

  .tone-emerald { background: linear-gradient(180deg, rgba(231, 249, 240, 0.92), rgba(255, 253, 248, 0.84)); }
  .tone-blue { background: linear-gradient(180deg, rgba(233, 241, 255, 0.92), rgba(255, 253, 248, 0.84)); }
  .tone-amber { background: linear-gradient(180deg, rgba(255, 243, 216, 0.94), rgba(255, 253, 248, 0.84)); }
  .tone-slate { background: linear-gradient(180deg, rgba(241, 242, 245, 0.96), rgba(255, 253, 248, 0.84)); }

  .workspace-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(320px, 0.9fr);
    gap: 18px;
  }

  .workspace-main,
  .workspace-side {
    display: grid;
    gap: 18px;
  }

  .pipeline-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }

  .pipeline-card {
    border-radius: 18px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(23, 33, 43, 0.07);
    display: grid;
    gap: 8px;
  }

  .pipeline-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
  }

  .pipeline-card strong {
    font-size: 1.6rem;
    letter-spacing: -0.04em;
  }

  .pipeline-card span:last-child {
    color: var(--muted);
    font-size: 0.84rem;
  }

  .orders-table {
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid rgba(23, 33, 43, 0.07);
    background: rgba(255, 255, 255, 0.68);
  }

  .orders-head,
  .orders-row {
    display: grid;
    grid-template-columns: 110px 90px 140px 90px 1fr;
    gap: 12px;
    align-items: center;
    padding: 14px 18px;
  }

  .orders-head {
    background: rgba(23, 33, 43, 0.05);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.68rem;
    font-weight: 800;
    color: var(--muted);
  }

  .orders-row {
    border-top: 1px solid rgba(23, 33, 43, 0.06);
    font-size: 0.92rem;
  }

  .status-pill {
    width: fit-content;
    padding: 7px 12px;
    border-radius: 999px;
    font-size: 0.77rem;
    font-weight: 800;
    letter-spacing: 0.03em;
  }

  .align-right {
    text-align: right;
  }

  .table-list,
  .note-list {
    display: grid;
    gap: 10px;
  }

  .table-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 14px 0;
    border-bottom: 1px solid rgba(23, 33, 43, 0.06);
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .accent-panel {
    background: linear-gradient(180deg, rgba(255, 244, 226, 0.92), rgba(255, 251, 244, 0.88));
  }

  .note-list {
    margin: 0;
    padding-left: 18px;
    color: var(--ink);
  }

  .note-list li {
    line-height: 1.7;
    color: #5f6875;
  }

  .text-link {
    text-decoration: none;
    font-size: 0.86rem;
    font-weight: 700;
  }

  .loading-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .skeleton-card {
    min-height: 160px;
    border-radius: 26px;
    background: linear-gradient(90deg, rgba(255,255,255,0.42) 25%, rgba(255,255,255,0.74) 50%, rgba(255,255,255,0.42) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.25s linear infinite;
  }

  .empty-state {
    padding: 24px 18px;
    text-align: center;
    font-size: 0.92rem;
  }

  .compact {
    padding: 12px 0;
  }

  .error-banner {
    margin-bottom: 18px;
    padding: 14px 18px;
    border-radius: 18px;
    background: rgba(255, 244, 244, 0.92);
    border: 1px solid rgba(180, 67, 75, 0.18);
    color: #b4434b;
    box-shadow: var(--shadow);
  }

  @keyframes shimmer {
    from { background-position: 200% 0; }
    to { background-position: -200% 0; }
  }

  @media (max-width: 1180px) {
    .hero-grid,
    .workspace-grid,
    .metric-grid {
      grid-template-columns: 1fr;
    }

    .hero-panel {
      flex-direction: column;
    }

    .hero-highlights {
      width: 100%;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 760px) {
    .admin-shell {
      padding: 16px;
    }

    .admin-topbar {
      padding: 20px;
    }

    .topbar-actions {
      justify-content: stretch;
    }

    .clock-card,
    .ghost-btn,
    .danger-btn {
      width: 100%;
    }

    .hero-highlights,
    .pipeline-grid {
      grid-template-columns: 1fr 1fr;
    }

    .orders-head,
    .orders-row {
      grid-template-columns: 90px 70px 110px 60px 1fr;
      font-size: 0.84rem;
    }
  }

  @media (max-width: 560px) {
    .orders-head {
      display: none;
    }

    .orders-row {
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .orders-row > span:nth-child(5) {
      grid-column: span 2;
      text-align: left;
    }

    .hero-highlights,
    .pipeline-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default Dashboard;
