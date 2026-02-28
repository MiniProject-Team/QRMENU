import { useEffect, useState, useCallback, useRef } from "react";
import API from "../../api/axios";

/* ─── constants ───────────────────────────────────────────────── */

const STATUS_META = {
  ALL:        { label: "All",       color: "#9ca3af", bg: "rgba(156,163,175,0.1)",  border: "rgba(156,163,175,0.2)" },
  PENDING:    { label: "Pending",   color: "#f59e0b", bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.25)" },
  PLACED:     { label: "Pending",   color: "#f59e0b", bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.25)" },
  ACCEPTED:   { label: "Accepted",  color: "#818cf8", bg: "rgba(129,140,248,0.1)",  border: "rgba(129,140,248,0.25)" },
  PREPARING:  { label: "Cooking",   color: "#f97316", bg: "rgba(249,115,22,0.1)",   border: "rgba(249,115,22,0.25)" },
  COOKING:    { label: "Cooking",   color: "#f97316", bg: "rgba(249,115,22,0.1)",   border: "rgba(249,115,22,0.25)" },
  READY:      { label: "Ready",     color: "#10b981", bg: "rgba(16,185,129,0.1)",   border: "rgba(16,185,129,0.25)" },
  SERVED:     { label: "Served",    color: "#6b7280", bg: "rgba(107,114,128,0.1)",  border: "rgba(107,114,128,0.2)" },
  COMPLETED:  { label: "Served",    color: "#6b7280", bg: "rgba(107,114,128,0.1)",  border: "rgba(107,114,128,0.2)" },
  CANCELLED:  { label: "Cancelled", color: "#f87171", bg: "rgba(248,113,113,0.1)",  border: "rgba(248,113,113,0.25)" },
};

const STATUS_TRANSITIONS = {
  PENDING:   ["ACCEPTED", "CANCELLED"],
  PLACED:    ["ACCEPTED", "CANCELLED"],
  ACCEPTED:  ["PREPARING", "CANCELLED"],
  PREPARING: ["READY"],
  COOKING:   ["READY"],
  READY:     ["SERVED"],
  SERVED:    [],
  COMPLETED: [],
  CANCELLED: [],
};

const STATUS_ENDPOINT = {
  ACCEPTED:  "accept",
  PREPARING: "cooking",
  READY:     "ready",
  SERVED:    "served",
  CANCELLED: "cancel",
};

const TABS = ["ALL", "PENDING", "ACCEPTED", "PREPARING", "READY", "SERVED", "CANCELLED"];
const PAGE_SIZE = 15;

/* ─── helpers ─────────────────────────────────────────────────── */

const fmt = (n) => (typeof n === "number" ? n.toLocaleString("en-IN") : n ?? "—");
const fmtCurrency = (n) => `₹${fmt(n)}`;

const fmtTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const elapsed = (iso) => {
  if (!iso) return null;
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};

const parseItem = (item) => {
  if (typeof item === "object" && item !== null) {
    return { name: item.name ?? item.itemName ?? String(item), qty: item.quantity ?? item.qty ?? 1, price: item.price ?? null };
  }
  if (typeof item === "string") {
    const m = item.match(/^(.*)\s+x\s*(\d+)$/i);
    if (m) return { name: m[1].trim(), qty: m[2], price: null };
  }
  return { name: String(item ?? ""), qty: 1, price: null };
};

const normStatus = (s) => (s === "PLACED" ? "PENDING" : s === "COMPLETED" ? "SERVED" : s === "COOKING" ? "PREPARING" : s);

/* ─── sub-components ──────────────────────────────────────────── */

const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] ?? STATUS_META["ALL"];
  return (
    <span className="ord-badge" style={{ color: m.color, background: m.bg, borderColor: m.border }}>
      <span className="ord-badge-dot" style={{ background: m.color }} />
      {m.label}
    </span>
  );
};

const StatusSelect = ({ order, onUpdate }) => {
  const transitions = STATUS_TRANSITIONS[order.status] ?? [];
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (transitions.length === 0) return <StatusBadge status={order.status} />;

  const handleSelect = async (newStatus) => {
    setOpen(false);
    setLoading(true);
    await onUpdate(order.id ?? order.orderId, STATUS_ENDPOINT[newStatus], newStatus);
    setLoading(false);
  };

  return (
    <div className="ord-status-wrap" ref={ref}>
      <button
        className="ord-status-btn"
        onClick={() => setOpen(o => !o)}
        disabled={loading}
        title="Change status"
      >
        {loading
          ? <span className="ord-mini-spin" />
          : <StatusBadge status={order.status} />
        }
        <span className="ord-chevron">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="ord-dropdown">
          {transitions.map(s => {
            const m = STATUS_META[s] ?? STATUS_META["ALL"];
            return (
              <button key={s} className="ord-dd-item" onClick={() => handleSelect(s)}>
                <span className="ord-dd-dot" style={{ background: m.color }} />
                <span style={{ color: m.color }}>{m.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const OrderDetail = ({ order }) => {
  const items = (order.items ?? []).map(parseItem);
  const subtotal = items.reduce((s, i) => s + (i.price ? i.price * i.qty : 0), 0);

  return (
    <div className="ord-detail">
      <div className="ord-detail-grid">
        <div className="ord-detail-col">
          <div className="ord-detail-label">Order ID</div>
          <div className="ord-detail-val mono">#{order.id ?? order.orderId}</div>
        </div>
        <div className="ord-detail-col">
          <div className="ord-detail-label">Table</div>
          <div className="ord-detail-val">Table {order.tableId ?? order.tableNumber ?? "—"}</div>
        </div>
        <div className="ord-detail-col">
          <div className="ord-detail-label">Placed at</div>
          <div className="ord-detail-val mono">{fmtTime(order.createdAt)} · {fmtDate(order.createdAt)}</div>
        </div>
        <div className="ord-detail-col">
          <div className="ord-detail-label">Total</div>
          <div className="ord-detail-val ord-green mono">{fmtCurrency(order.total ?? order.totalAmount)}</div>
        </div>
      </div>

      {order.notes && (
        <div className="ord-detail-notes">
          <span className="ord-detail-label">📝 Notes</span>
          <p>{order.notes}</p>
        </div>
      )}

      <div className="ord-items-table">
        <div className="ord-items-head">
          <span>Item</span>
          <span className="ta-center">Qty</span>
          <span className="ta-right">Price</span>
          <span className="ta-right">Subtotal</span>
        </div>
        {items.length === 0 && (
          <div className="ord-items-empty">No item details available</div>
        )}
        {items.map((item, i) => (
          <div key={i} className="ord-items-row">
            <span className="ord-item-name">{item.name}</span>
            <span className="ta-center ord-item-qty">×{item.qty}</span>
            <span className="ta-right ord-item-price">
              {item.price ? fmtCurrency(item.price) : "—"}
            </span>
            <span className="ta-right ord-item-sub">
              {item.price ? fmtCurrency(item.price * item.qty) : "—"}
            </span>
          </div>
        ))}
        {subtotal > 0 && (
          <div className="ord-items-total">
            <span>Total</span>
            <span className="ta-right ord-green mono">{fmtCurrency(subtotal)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── main component ──────────────────────────────────────────── */

const Orders = () => {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch]       = useState("");
  const [dateFrom, setDateFrom]   = useState("");
  const [dateTo, setDateTo]       = useState("");
  const [page, setPage]           = useState(1);
  const [expanded, setExpanded]   = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const searchRef = useRef();

  /* ── fetch ── */
  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo)   params.set("to", dateTo);
      const res = await API.get(`/admin/orders?${params}`);
      setOrders(res.data ?? []);
    } catch (err) {
      console.error("Orders fetch error:", err);
      // demo data
      const demo = Array.from({ length: 40 }, (_, i) => {
        const statuses = ["PENDING","ACCEPTED","PREPARING","READY","SERVED","CANCELLED"];
        const s = statuses[i % statuses.length];
        const base = new Date(Date.now() - i * 7 * 60000);
        return {
          id: 200 - i,
          orderId: 200 - i,
          tableId: (i % 10) + 1,
          tableNumber: (i % 10) + 1,
          status: s,
          total: 200 + (i * 137 % 1800),
          totalAmount: 200 + (i * 137 % 1800),
          createdAt: base.toISOString(),
          notes: i % 7 === 0 ? "No chilli, extra sauce" : null,
          items: [
            `Butter Chicken x ${(i % 3) + 1}`,
            `Garlic Naan x 2`,
            ...(i % 2 === 0 ? [`Mango Lassi x 1`] : []),
          ],
        };
      });
      setOrders(demo);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  /* ── status update ── */
  const handleUpdate = useCallback(async (id, endpoint, newStatus) => {
    setUpdatingId(id);
    // optimistic update
    setOrders(prev => prev.map(o =>
      (o.id === id || o.orderId === id) ? { ...o, status: newStatus } : o
    ));
    try {
      await API.put(`/kitchen/orders/${endpoint}/${id}`);
      console.log(`[Orders] updated #${id} → ${newStatus}`);
    } catch (err) {
      console.error(`[Orders] update failed:`, err?.response?.data ?? err.message);
      fetchOrders(true); // revert on error
    } finally {
      setUpdatingId(null);
    }
  }, [fetchOrders]);

  /* ── filtering ── */
  const filtered = orders.filter(o => {
    const normTab = activeTab === "ALL" ? null : activeTab;
    const oStatus = normStatus(o.status ?? "");
    if (normTab && oStatus !== normTab && o.status !== normTab) return false;

    const q = search.trim().toLowerCase();
    if (q) {
      const id = String(o.id ?? o.orderId ?? "");
      const table = String(o.tableId ?? o.tableNumber ?? "");
      if (!id.includes(q) && !table.includes(q)) return false;
    }
    return true;
  });

  /* ── tab counts ── */
  const tabCounts = TABS.reduce((acc, t) => {
    acc[t] = t === "ALL"
      ? orders.length
      : orders.filter(o => normStatus(o.status) === t || o.status === t).length;
    return acc;
  }, {});

  /* ── pagination ── */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const gotoPage = (p) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
    setExpanded(null);
  };

  // reset page on filter change
  useEffect(() => { setPage(1); setExpanded(null); }, [activeTab, search, dateFrom, dateTo]);

  /* ── render ── */
  return (
    <div className="ord-root">
      <style>{CSS}</style>

      {/* ── Header ── */}
      <div className="ord-header">
        <div>
          <h1 className="ord-title">Orders</h1>
          <p className="ord-sub">{fmt(orders.length)} total orders</p>
        </div>
        <button
          className={`ord-refresh-btn ${refreshing ? "spinning" : ""}`}
          onClick={() => fetchOrders(true)}
          title="Refresh"
        >↻ Refresh</button>
      </div>

      {/* ── Controls ── */}
      <div className="ord-controls">
        {/* Search */}
        <div className="ord-search-wrap">
          <span className="ord-search-icon">⌕</span>
          <input
            ref={searchRef}
            className="ord-search"
            placeholder="Search order ID or table…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="ord-search-clear" onClick={() => { setSearch(""); searchRef.current?.focus(); }}>✕</button>
          )}
        </div>

        {/* Date range */}
        <div className="ord-date-range">
          <label className="ord-date-label">From</label>
          <input type="date" className="ord-date-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <label className="ord-date-label">To</label>
          <input type="date" className="ord-date-input" value={dateTo}   onChange={e => setDateTo(e.target.value)} />
          {(dateFrom || dateTo) && (
            <button className="ord-date-clear" onClick={() => { setDateFrom(""); setDateTo(""); }}>Clear</button>
          )}
        </div>
      </div>

      {/* ── Status tabs ── */}
      <div className="ord-tabs-wrap">
        <div className="ord-tabs">
          {TABS.map(t => {
            const m = STATUS_META[t] ?? STATUS_META["ALL"];
            const count = tabCounts[t] ?? 0;
            return (
              <button
                key={t}
                className={`ord-tab ${activeTab === t ? "ord-tab--on" : ""}`}
                style={activeTab === t ? { "--tc": m.color, "--tb": m.bg, "--tbd": m.border } : {}}
                onClick={() => setActiveTab(t)}
              >
                {m.label}
                <span className="ord-tab-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="ord-table-wrap">
        {/* Table head */}
        <div className="ord-thead">
          <span>Order</span>
          <span>Table</span>
          <span>Time</span>
          <span>Status</span>
          <span className="ta-right">Total</span>
          <span className="ta-center">Items</span>
          <span className="ta-center">Actions</span>
        </div>

        {loading ? (
          <div className="ord-skeletons">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="ord-skeleton-row" style={{ animationDelay: `${i * 0.05}s` }} />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="ord-empty">
            <div className="ord-empty-icon">📋</div>
            <div className="ord-empty-title">No orders found</div>
            <div className="ord-empty-sub">Try adjusting your filters or date range.</div>
          </div>
        ) : (
          <div className="ord-tbody">
            {paginated.map((order, idx) => {
              const id = order.id ?? order.orderId;
              const isExpanded = expanded === id;
              const isUpdating = updatingId === id;

              return (
                <div
                  key={id}
                  className={`ord-row-wrap ${isExpanded ? "ord-row-wrap--open" : ""}`}
                  style={{ animationDelay: `${idx * 0.03}s` }}
                >
                  {/* Main row */}
                  <div
                    className={`ord-row ${isUpdating ? "ord-row--updating" : ""}`}
                    onClick={() => setExpanded(isExpanded ? null : id)}
                  >
                    <span className="ord-cell-id mono">#{id}</span>
                    <span>
                      <span className="ord-table-pill">T{order.tableId ?? order.tableNumber}</span>
                    </span>
                    <span className="ord-cell-time">
                      <span className="ord-time-main mono">{fmtTime(order.createdAt)}</span>
                      <span className="ord-time-age">{elapsed(order.createdAt)}</span>
                    </span>
                    <span onClick={e => e.stopPropagation()}>
                      <StatusSelect order={order} onUpdate={handleUpdate} />
                    </span>
                    <span className="ta-right ord-total mono">{fmtCurrency(order.total ?? order.totalAmount)}</span>
                    <span className="ta-center ord-item-count">
                      {(order.items ?? []).length} <span className="ord-items-label">items</span>
                    </span>
                    <span className="ta-center ord-expand-btn">
                      <span className={`ord-chevron-big ${isExpanded ? "open" : ""}`}>›</span>
                    </span>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="ord-detail-wrap">
                      <OrderDetail order={order} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {!loading && filtered.length > PAGE_SIZE && (
        <div className="ord-pagination">
          <span className="ord-page-info">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="ord-page-btns">
            <button className="ord-page-btn" disabled={page === 1} onClick={() => gotoPage(1)}>«</button>
            <button className="ord-page-btn" disabled={page === 1} onClick={() => gotoPage(page - 1)}>‹</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p;
              if (totalPages <= 5) p = i + 1;
              else if (page <= 3) p = i + 1;
              else if (page >= totalPages - 2) p = totalPages - 4 + i;
              else p = page - 2 + i;
              return (
                <button
                  key={p}
                  className={`ord-page-btn ${page === p ? "ord-page-btn--on" : ""}`}
                  onClick={() => gotoPage(p)}
                >{p}</button>
              );
            })}
            <button className="ord-page-btn" disabled={page === totalPages} onClick={() => gotoPage(page + 1)}>›</button>
            <button className="ord-page-btn" disabled={page === totalPages} onClick={() => gotoPage(totalPages)}>»</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── CSS ─────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ord-root {
    min-height: 100vh;
    background: #07070e;
    background-image: radial-gradient(ellipse 70% 30% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 60%);
    padding: 32px 28px 60px;
    font-family: 'DM Sans', sans-serif;
    color: #e2e8f0;
  }

  .mono { font-family: 'DM Mono', monospace; }
  .ta-right  { text-align: right; }
  .ta-center { text-align: center; }
  .ord-green { color: #10b981; }

  /* ── Header ── */
  .ord-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 28px;
  }
  .ord-title {
    font-family: 'Syne', sans-serif;
    font-size: 2rem; font-weight: 800; color: #fff; letter-spacing: -1px;
  }
  .ord-sub { color: #4b5563; font-size: 0.82rem; margin-top: 4px; }
  .ord-refresh-btn {
    display: flex; align-items: center; gap: 7px;
    background: #0d0d1a; border: 1px solid #1e1e2e;
    color: #6b7280; padding: 9px 16px; border-radius: 10px;
    font-size: 0.82rem; font-weight: 600; cursor: pointer;
    transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .ord-refresh-btn:hover { color: #fff; border-color: #333; }
  .ord-refresh-btn.spinning { color: #6366f1; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Controls ── */
  .ord-controls {
    display: flex; gap: 12px; flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .ord-search-wrap {
    position: relative; flex: 1; min-width: 220px;
  }
  .ord-search-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: #4b5563; font-size: 1.1rem; pointer-events: none;
  }
  .ord-search {
    width: 100%; background: #0a0a15; border: 1px solid #1a1a28;
    color: #e2e8f0; padding: 10px 36px 10px 38px;
    border-radius: 11px; font-size: 0.88rem; outline: none;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.15s;
  }
  .ord-search::placeholder { color: #374151; }
  .ord-search:focus { border-color: #6366f155; }
  .ord-search-clear {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    background: none; border: none; color: #4b5563; cursor: pointer;
    font-size: 0.75rem; padding: 4px;
  }
  .ord-search-clear:hover { color: #9ca3af; }

  .ord-date-range {
    display: flex; align-items: center; gap: 8px;
    background: #0a0a15; border: 1px solid #1a1a28;
    border-radius: 11px; padding: 0 14px;
  }
  .ord-date-label { font-size: 0.75rem; color: #4b5563; font-weight: 600; white-space: nowrap; }
  .ord-date-input {
    background: transparent; border: none; color: #9ca3af;
    font-size: 0.82rem; outline: none; padding: 10px 4px;
    font-family: 'DM Mono', monospace; cursor: pointer;
    color-scheme: dark;
  }
  .ord-date-input:focus { color: #e2e8f0; }
  .ord-date-clear {
    background: none; border: none; color: #f87171;
    font-size: 0.75rem; cursor: pointer; font-weight: 600;
    padding: 4px 0; white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Tabs ── */
  .ord-tabs-wrap {
    overflow-x: auto; margin-bottom: 16px;
    scrollbar-width: none;
  }
  .ord-tabs-wrap::-webkit-scrollbar { display: none; }
  .ord-tabs {
    display: flex; gap: 6px; white-space: nowrap;
    padding-bottom: 2px;
  }
  .ord-tab {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 16px; border: 1px solid #1a1a28;
    border-radius: 10px; background: #0a0a15; color: #6b7280;
    font-size: 0.82rem; font-weight: 600; cursor: pointer;
    transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .ord-tab:hover { color: #9ca3af; border-color: #2a2a38; }
  .ord-tab--on {
    background: var(--tb); color: var(--tc);
    border-color: var(--tbd);
  }
  .ord-tab-count {
    background: rgba(255,255,255,0.07);
    padding: 1px 7px; border-radius: 999px;
    font-size: 0.7rem;
  }

  /* ── Table ── */
  .ord-table-wrap {
    background: #090912;
    border: 1px solid #111122;
    border-radius: 18px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .ord-thead {
    display: grid;
    grid-template-columns: 80px 65px 110px 1fr 100px 70px 70px;
    padding: 11px 20px;
    background: #0d0d1a;
    border-bottom: 1px solid #111122;
    font-size: 0.7rem; font-weight: 700;
    color: #2d2d42; text-transform: uppercase; letter-spacing: 0.7px;
  }

  /* skeletons */
  .ord-skeletons { padding: 8px 0; }
  .ord-skeleton-row {
    margin: 0 16px 8px;
    height: 52px; border-radius: 10px;
    background: linear-gradient(90deg, #0d0d1a 25%, #111120 50%, #0d0d1a 75%);
    background-size: 200% 100%;
    animation: shimmer 1.3s infinite;
  }
  @keyframes shimmer {
    0%   { background-position:  200% 0; }
    100% { background-position: -200% 0; }
  }

  /* empty */
  .ord-empty {
    padding: 60px 20px; text-align: center;
  }
  .ord-empty-icon { font-size: 2.5rem; margin-bottom: 12px; }
  .ord-empty-title { color: #6b7280; font-size: 1rem; font-weight: 600; margin-bottom: 6px; }
  .ord-empty-sub { color: #374151; font-size: 0.82rem; }

  /* rows */
  .ord-tbody { padding: 6px 0; }
  .ord-row-wrap {
    animation: fadeUp 0.25s ease both;
    border-bottom: 1px solid #0d0d1a;
  }
  .ord-row-wrap:last-child { border-bottom: none; }
  .ord-row-wrap--open { background: #0a0a15; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ord-row {
    display: grid;
    grid-template-columns: 80px 65px 110px 1fr 100px 70px 70px;
    padding: 13px 20px;
    align-items: center;
    cursor: pointer;
    transition: background 0.12s;
  }
  .ord-row:hover { background: #0d0d18; }
  .ord-row--updating { opacity: 0.6; pointer-events: none; }

  .ord-cell-id { font-size: 0.9rem; font-weight: 500; color: #fff; }
  .ord-table-pill {
    background: rgba(99,102,241,0.12); color: #818cf8;
    padding: 3px 9px; border-radius: 7px;
    font-size: 0.78rem; font-weight: 700;
  }
  .ord-cell-time { display: flex; flex-direction: column; gap: 2px; }
  .ord-time-main { font-size: 0.85rem; color: #cbd5e1; }
  .ord-time-age  { font-size: 0.7rem; color: #374151; }
  .ord-total { font-size: 0.9rem; font-weight: 500; color: #10b981; }
  .ord-item-count { font-size: 0.85rem; color: #9ca3af; }
  .ord-items-label { font-size: 0.72rem; color: #4b5563; }
  .ord-expand-btn { display: flex; justify-content: center; }
  .ord-chevron-big {
    display: inline-block; color: #374151; font-size: 1.3rem;
    transition: transform 0.2s, color 0.2s;
  }
  .ord-chevron-big.open { transform: rotate(90deg); color: #6366f1; }

  /* ── Status badge + dropdown ── */
  .ord-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 11px; border-radius: 8px; border: 1px solid transparent;
    font-size: 0.78rem; font-weight: 700; white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }
  .ord-badge-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

  .ord-status-wrap { position: relative; }
  .ord-status-btn {
    display: flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer; padding: 0;
  }
  .ord-chevron { font-size: 0.55rem; color: #4b5563; }
  .ord-status-btn:hover .ord-chevron { color: #9ca3af; }
  .ord-status-btn:disabled { opacity: 0.5; cursor: wait; }

  .ord-dropdown {
    position: absolute; top: calc(100% + 6px); left: 0; z-index: 100;
    background: #0f0f1e; border: 1px solid #1e1e2e;
    border-radius: 12px; padding: 6px;
    min-width: 140px;
    box-shadow: 0 16px 40px rgba(0,0,0,0.6);
    animation: dropIn 0.12s ease;
  }
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ord-dd-item {
    display: flex; align-items: center; gap: 9px;
    width: 100%; padding: 8px 12px; border: none;
    background: transparent; cursor: pointer; border-radius: 8px;
    font-size: 0.82rem; font-weight: 600; transition: background 0.12s;
    font-family: 'DM Sans', sans-serif;
  }
  .ord-dd-item:hover { background: #1a1a2e; }
  .ord-dd-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  .ord-mini-spin {
    display: inline-block; width: 14px; height: 14px;
    border: 2px solid #1e1e2e; border-top-color: #6366f1;
    border-radius: 50%; animation: spin 0.6s linear infinite;
  }

  /* ── Order detail ── */
  .ord-detail-wrap {
    border-top: 1px solid #0d0d1a;
    animation: expandIn 0.2s ease;
  }
  @keyframes expandIn {
    from { opacity: 0; max-height: 0; }
    to   { opacity: 1; max-height: 600px; }
  }
  .ord-detail {
    padding: 20px 24px;
    background: #090912;
  }
  .ord-detail-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px; margin-bottom: 16px;
  }
  .ord-detail-col {}
  .ord-detail-label { font-size: 0.7rem; color: #374151; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; margin-bottom: 4px; }
  .ord-detail-val { font-size: 0.9rem; color: #e2e8f0; font-weight: 500; }
  .ord-detail-notes {
    background: #0d0d1a; border-left: 3px solid #f59e0b;
    padding: 10px 14px; border-radius: 0 8px 8px 0;
    margin-bottom: 16px;
  }
  .ord-detail-notes p { font-size: 0.85rem; color: #9ca3af; margin-top: 4px; }

  .ord-items-table {
    background: #0d0d1a; border-radius: 12px; overflow: hidden;
  }
  .ord-items-head {
    display: grid; grid-template-columns: 1fr 60px 90px 90px;
    padding: 9px 16px;
    font-size: 0.68rem; font-weight: 700; color: #2d2d42;
    text-transform: uppercase; letter-spacing: 0.5px;
    border-bottom: 1px solid #111122;
  }
  .ord-items-row {
    display: grid; grid-template-columns: 1fr 60px 90px 90px;
    padding: 10px 16px;
    border-bottom: 1px solid #0a0a12;
    transition: background 0.1s;
  }
  .ord-items-row:last-child { border-bottom: none; }
  .ord-items-row:hover { background: #111120; }
  .ord-item-name { font-size: 0.87rem; color: #cbd5e1; }
  .ord-item-qty  { font-size: 0.82rem; color: #6b7280; font-family: 'DM Mono', monospace; }
  .ord-item-price { font-size: 0.82rem; color: #4b5563; font-family: 'DM Mono', monospace; }
  .ord-item-sub   { font-size: 0.85rem; color: #9ca3af; font-family: 'DM Mono', monospace; }
  .ord-items-empty { padding: 14px 16px; font-size: 0.82rem; color: #374151; }
  .ord-items-total {
    display: grid; grid-template-columns: 1fr 90px;
    padding: 10px 16px;
    background: #111122;
    font-size: 0.85rem; font-weight: 700; color: #6b7280;
    border-top: 1px solid #111122;
  }

  /* ── Pagination ── */
  .ord-pagination {
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 12px;
  }
  .ord-page-info { font-size: 0.78rem; color: #374151; }
  .ord-page-btns { display: flex; gap: 4px; }
  .ord-page-btn {
    width: 34px; height: 34px; border: 1px solid #1a1a28;
    background: #0a0a15; color: #6b7280;
    border-radius: 9px; font-size: 0.82rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.12s; font-family: 'DM Mono', monospace;
  }
  .ord-page-btn:disabled { opacity: 0.3; cursor: default; }
  .ord-page-btn:not(:disabled):hover { color: #fff; border-color: #333; }
  .ord-page-btn--on { background: #1a1a2e; color: #818cf8; border-color: #818cf844; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .ord-root { padding: 20px 14px 40px; }
    .ord-thead, .ord-row {
      grid-template-columns: 70px 60px 1fr 80px 44px;
    }
    .ord-thead > *:nth-child(3),
    .ord-thead > *:nth-child(6),
    .ord-row   > *:nth-child(3),
    .ord-row   > *:nth-child(6) { display: none; }
    .ord-date-range { display: none; }
    .ord-items-head,
    .ord-items-row { grid-template-columns: 1fr 50px 80px; }
    .ord-items-head > *:last-child,
    .ord-items-row  > *:last-child { display: none; }
  }
`;

export default Orders;