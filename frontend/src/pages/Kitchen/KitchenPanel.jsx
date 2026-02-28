import { useEffect, useState, useCallback, useRef } from "react";
import API from "../../api/axios";

/* ─── helpers ─────────────────────────────────────────────────── */

// ── STATUS → UI mapping ──────────────────────────────────────────
// Covers every variant the backend might send back.
// If your backend uses different strings, add them here.
const STATUS_FLOW = {
  // step 0 — order just placed
  PENDING:    { label: "Pending",   color: "#f59e0b", bg: "#f59e0b18", icon: "⏳", step: 0, next: "accept",  nextLabel: "Accept Order",   nextIcon: "✓"  },
  PLACED:     { label: "Pending",   color: "#f59e0b", bg: "#f59e0b18", icon: "⏳", step: 0, next: "accept",  nextLabel: "Accept Order",   nextIcon: "✓"  },
  NEW:        { label: "Pending",   color: "#f59e0b", bg: "#f59e0b18", icon: "⏳", step: 0, next: "accept",  nextLabel: "Accept Order",   nextIcon: "✓"  },

  // step 1 — accepted by kitchen
  ACCEPTED:   { label: "Accepted",  color: "#818cf8", bg: "#818cf818", icon: "✓",  step: 1, next: "ready", nextLabel: "Mark Ready",  nextIcon: "🍽️" },
  CONFIRMED:  { label: "Accepted",  color: "#818cf8", bg: "#818cf818", icon: "✓",  step: 1, next: "ready", nextLabel: "Mark Ready",  nextIcon: "🍽️" },


  // step 3 — ready to be picked up
  READY:      { label: "Ready",     color: "#10b981", bg: "#10b98118", icon: "🍽️", step: 2, next: "served",  nextLabel: "Complete Order", nextIcon: "✅" },
  DONE:       { label: "Ready",     color: "#10b981", bg: "#10b98118", icon: "🍽️", step: 2, next: "served",  nextLabel: "Complete Order", nextIcon: "✅" },
  FOOD_READY: { label: "Ready",     color: "#10b981", bg: "#10b98118", icon: "🍽️", step: 2, next: "served",  nextLabel: "Complete Order", nextIcon: "✅" },

  // step 4 — completed
  SERVED:     { label: "Completed", color: "#4b5563", bg: "#4b556318", icon: "✅", step: 3, next: null },
  COMPLETED:  { label: "Completed", color: "#4b5563", bg: "#4b556318", icon: "✅", step: 3, next: null },
  DELIVERED:  { label: "Completed", color: "#4b5563", bg: "#4b556318", icon: "✅", step: 3, next: null },
};

const STEPS = [
  { label: "Placed",   step: 0 },
  { label: "Accepted", step: 1 },
  { label: "Ready",    step: 2 },
  { label: "Done",     step: 3 },
];

const parseItem = (item) => {
  if (typeof item !== "string") return { name: String(item ?? ""), qty: "" };
  const m = item.match(/^(.*)\s+x\s+(\d+)$/i);
  return m ? { name: m[1].trim(), qty: m[2] } : { name: item, qty: "" };
};

const elapsed = (iso) => {
  if (!iso) return null;
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
};

const urgencyLevel = (iso, status) => {
  if (!iso || status === "SERVED") return 0;
  const mins = (Date.now() - new Date(iso)) / 60000;
  if (mins > 20) return 2; // critical
  if (mins > 10) return 1; // warning
  return 0;
};

/* ─── component ───────────────────────────────────────────────── */

const KitchenPanel = () => {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [sortBy, setSortBy]       = useState("oldest");
  const [updating, setUpdating]   = useState(null); // orderId being updated
  const [tick, setTick]           = useState(0);    // force re-render for elapsed time
  const prevOrderIds              = useRef(new Set());
  const audioCtx                  = useRef(null);

  /* ── beep for new orders ── */
  const beep = useCallback(() => {
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtx.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine"; osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
    } catch (_) {}
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await API.get("/kitchen/orders/active");
      const data = res.data ?? [];
      // 🔍 DEBUG: See all current statuses from server
      console.log("[Kitchen] Active orders from server:", data.map(o => `#${o.orderId}=${o.status}`));
      // detect new orders
      const newIds = new Set(data.map(o => o.orderId));
      const hasNew = data.some(o => !prevOrderIds.current.has(o.orderId) && (o.status === "PENDING" || o.status === "PLACED"));
      if (hasNew && prevOrderIds.current.size > 0) beep();
      prevOrderIds.current = newIds;
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  }, [beep]);

  useEffect(() => {
    fetchOrders();
    const poll = setInterval(fetchOrders, 5000);
    const clock = setInterval(() => setTick(t => t + 1), 15000);
    return () => { clearInterval(poll); clearInterval(clock); };
  }, [fetchOrders]);

  const updateStatus = async (id, endpoint) => {
    setUpdating(id);
    try {
      const res = await API.put(`/kitchen/orders/${endpoint}/${id}`);
      // 🔍 DEBUG: Check browser DevTools > Console to see what the backend returns.
      // If the status string after cooking isn't in STATUS_FLOW, add it there.
      console.log(`[Kitchen] PUT /${endpoint}/${id} response:`, res?.data);
      await fetchOrders();
    } catch (err) {
      console.error(`[Kitchen] Update failed (${endpoint}/${id}):`, err?.response?.data ?? err.message);
      alert(`Failed to update order: ${err?.response?.data?.message ?? err.message}`);
    } finally {
      setUpdating(null);
    }
  };

  /* ── sorting + filtering ── */
  const filtered = orders
    .filter(o => {
      if (activeTab === "active")    return o.status !== "SERVED";
      if (activeTab === "completed") return o.status === "SERVED";
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.createdAt ?? 0) - new Date(b.createdAt ?? 0);
      if (sortBy === "newest") return new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0);
      if (sortBy === "status") {
        const sa = STATUS_FLOW[a.status]?.step ?? 99;
        const sb = STATUS_FLOW[b.status]?.step ?? 99;
        return sa - sb;
      }
      return 0;
    });

  const counts = {
    pending:  orders.filter(o => o.status === "PENDING" || o.status === "PLACED").length,
    accepted: orders.filter(o => o.status === "ACCEPTED").length,
    ready:    orders.filter(o => o.status === "READY").length,
    served:   orders.filter(o => o.status === "SERVED").length,
  };

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div className="kp-root">
      <style>{CSS}</style>

      {/* Header */}
      <header className="kp-header">
        <div className="kp-header-left">
          <span className="kp-logo">🍳</span>
          <div>
            <h1>Kitchen Panel</h1>
            <p className="kp-subtitle">Live order management</p>
          </div>
        </div>
        <div className="kp-live">
          <span className="kp-pulse" />
          Live
        </div>
      </header>

      {/* Stats bar */}
      <div className="kp-stats">
        {[
          { key: "pending",  label: "Pending",   val: counts.pending,  cls: "s-pending"  },
          { key: "accepted", label: "Accepted",  val: counts.accepted, cls: "s-accepted" },
          { key: "ready",    label: "Ready",     val: counts.ready,    cls: "s-ready"    },
          { key: "served",   label: "Completed", val: counts.served,   cls: "s-served"   },
        ].map(s => (
          <div className="kp-stat" key={s.key}>
            <span className={`kp-stat-n ${s.cls}`}>{s.val}</span>
            <span className="kp-stat-l">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="kp-toolbar">
        <div className="kp-tabs">
          {[["active","Active"],["all","All"],["completed","Done"]].map(([v,l]) => (
            <button key={v} className={`kp-tab ${activeTab===v?"kp-tab--on":""}`} onClick={()=>setActiveTab(v)}>
              {l}
              {v === "active" && counts.pending > 0 && <span className="kp-badge">{counts.pending}</span>}
            </button>
          ))}
        </div>
        <div className="kp-sort">
          <span className="kp-sort-label">Sort:</span>
          <select className="kp-select" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
            <option value="oldest">Oldest first</option>
            <option value="newest">Newest first</option>
            <option value="status">By status</option>
          </select>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="kp-loading">
          <div className="kp-spinner" />
          <span>Loading orders…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="kp-empty">
          <div className="kp-empty-icon">{activeTab === "completed" ? "✅" : "📋"}</div>
          <h3>{activeTab === "completed" ? "No completed orders yet" : "No active orders"}</h3>
          <p>{activeTab === "completed" ? "Completed orders will show here." : "New orders will appear here automatically."}</p>
        </div>
      ) : (
        <div className="kp-grid">
          {filtered.map(order => <OrderCard key={order.orderId} order={order} updating={updating} onAction={updateStatus} />)}
        </div>
      )}
    </div>
  );
};

/* ─── OrderCard ───────────────────────────────────────────────── */

const OrderCard = ({ order, updating, onAction }) => {
  const info    = STATUS_FLOW[order.status] ?? STATUS_FLOW["PENDING"];
  const age     = elapsed(order.createdAt);
  const urgency = urgencyLevel(order.createdAt, order.status);
  const isNew   = order.status === "PENDING" || order.status === "PLACED";
  const busy    = updating === order.orderId;

  return (
    <div className={`kp-card ${isNew?"kp-card--new":""} ${urgency===2?"kp-card--urgent":urgency===1?"kp-card--warn":""}`}>
      {/* Card header */}
      <div className="kp-card-head">
        <div className="kp-card-id">
          <span className="kp-order-num">#{order.orderId}</span>
          {urgency > 0 && <span className={`kp-flag ${urgency===2?"kp-flag--hot":""}`}>{urgency===2?"🔴 Late":"🟡 Waiting"}</span>}
        </div>
        <div className="kp-card-meta">
          <span className="kp-table">Table {order.tableNumber}</span>
          {age && <span className="kp-age" style={{color: urgency===2?"#f87171":urgency===1?"#fbbf24":"#6b7280"}}>⏱ {age}</span>}
        </div>
      </div>

      {/* Progress bar */}
      <div className="kp-steps">
        <div className="kp-steps-track">
          <div className="kp-steps-fill" style={{width:`${Math.min(100, (info.step/3)*100)}%`, background: info.color}} />
        </div>
        {STEPS.map(s => (
          <div className="kp-step" key={s.step}>
            <div className={`kp-step-dot ${info.step > s.step ? "done" : info.step === s.step ? "active" : ""}`}
                 style={info.step === s.step ? {borderColor: info.color, background: info.color, boxShadow:`0 0 10px ${info.color}66`} : info.step > s.step ? {} : {}}>
              {info.step > s.step ? "✓" : s.step + 1}
            </div>
            <span className={`kp-step-label ${info.step >= s.step ? "on" : ""}`}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Status badge */}
      <div className="kp-status-badge" style={{background: info.bg, color: info.color, borderColor: `${info.color}44`}}>
        <span>{info.icon}</span>
        <span>{info.label}</span>
      </div>

      {/* Items */}
      <div className="kp-items">
        {(order.items ?? []).map((item, i) => {
          const p = parseItem(item);
          return (
            <div className="kp-item" key={i}>
              <span className="kp-item-name">{p.name}</span>
              {p.qty && <span className="kp-item-qty">×{p.qty}</span>}
            </div>
          );
        })}
        {order.notes && (
          <div className="kp-notes">
            <span>📝</span> {order.notes}
          </div>
        )}
      </div>

      {/* Action button */}
      {info.next && (
        <button
          className={`kp-action kp-action--${info.next}`}
          disabled={busy}
          onClick={() => onAction(order.orderId, info.next)}
        >
          {busy ? (
            <><span className="kp-btn-spin" /> Updating…</>
          ) : (
            <>{info.nextIcon} {info.nextLabel}</>
          )}
        </button>
      )}
    </div>
  );
};

/* ─── CSS ─────────────────────────────────────────────────────── */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .kp-root {
    min-height: 100vh;
    background: #080810;
    padding: 24px 20px;
    font-family: 'Manrope', sans-serif;
    color: #e2e8f0;
  }

  /* ── Header ── */
  .kp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid #1e1e2e;
  }
  .kp-header-left { display: flex; align-items: center; gap: 14px; }
  .kp-logo { font-size: 2.2rem; }
  .kp-header h1 { font-size: 1.6rem; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
  .kp-subtitle { color: #555; font-size: 0.82rem; margin-top: 2px; }
  .kp-live {
    display: flex; align-items: center; gap: 8px;
    background: #0d1117; border: 1px solid #10b98133;
    color: #10b981; padding: 6px 14px; border-radius: 999px;
    font-size: 0.78rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
  }
  .kp-pulse {
    width: 8px; height: 8px; border-radius: 50%;
    background: #10b981;
    animation: pulse 1.8s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 #10b98166; }
    50%       { opacity: 0.7; box-shadow: 0 0 0 5px #10b98100; }
  }

  /* ── Stats ── */
  .kp-stats {
    display: flex; gap: 12px; flex-wrap: wrap;
    margin-bottom: 24px;
    background: #0d0d18;
    border: 1px solid #1e1e2e;
    border-radius: 16px;
    padding: 16px 20px;
  }
  .kp-stat { flex: 1; min-width: 70px; text-align: center; }
  .kp-stat-n { display: block; font-size: 1.8rem; font-weight: 800; font-family: 'DM Mono', monospace; }
  .kp-stat-l { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; color: #4b5563; }
  .s-pending  { color: #f59e0b; }
  .s-accepted { color: #818cf8; }
  .s-cooking  { color: #f97316; }
  .s-ready    { color: #10b981; }
  .s-served   { color: #4b5563; }

  /* ── Toolbar ── */
  .kp-toolbar {
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 12px;
    margin-bottom: 24px;
  }
  .kp-tabs { display: flex; gap: 6px; }
  .kp-tab {
    padding: 9px 20px; border: 1px solid #1e1e2e;
    border-radius: 10px; background: #0d0d18;
    color: #6b7280; font-weight: 600; font-size: 0.88rem;
    cursor: pointer; transition: all 0.15s;
    position: relative;
  }
  .kp-tab:hover { color: #fff; border-color: #333; }
  .kp-tab--on { background: #1a1a2e; color: #818cf8; border-color: #818cf844; }
  .kp-badge {
    position: absolute; top: -6px; right: -6px;
    background: #f59e0b; color: #000; font-size: 0.65rem;
    font-weight: 800; padding: 2px 6px; border-radius: 999px;
    animation: pulse 1.5s infinite;
  }
  .kp-sort { display: flex; align-items: center; gap: 8px; }
  .kp-sort-label { color: #4b5563; font-size: 0.82rem; }
  .kp-select {
    background: #0d0d18; border: 1px solid #1e1e2e;
    color: #9ca3af; padding: 8px 12px; border-radius: 10px;
    font-size: 0.82rem; cursor: pointer; outline: none;
  }
  .kp-select:focus { border-color: #818cf844; }

  /* ── Grid ── */
  .kp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 18px;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* ── Card ── */
  .kp-card {
    background: #0d0d18;
    border: 1px solid #1e1e2e;
    border-radius: 18px;
    padding: 20px;
    transition: border-color 0.2s, transform 0.15s;
  }
  .kp-card:hover { border-color: #2d2d42; transform: translateY(-2px); }
  .kp-card--new { border-color: #f59e0b44; animation: newGlow 2s ease-in-out 3; }
  @keyframes newGlow {
    0%, 100% { box-shadow: none; }
    50% { box-shadow: 0 0 20px #f59e0b22; }
  }
  .kp-card--urgent { border-color: #f8717144; }
  .kp-card--warn { border-color: #fbbf2444; }

  /* Card header */
  .kp-card-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
  .kp-card-id { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .kp-order-num { font-size: 1.05rem; font-weight: 800; color: #fff; font-family: 'DM Mono', monospace; }
  .kp-flag {
    font-size: 0.7rem; font-weight: 700;
    padding: 3px 8px; border-radius: 6px;
    background: #1a1a2e; color: #fbbf24;
  }
  .kp-flag--hot { color: #f87171; }
  .kp-card-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .kp-table {
    background: #1a1a2e; color: #818cf8;
    padding: 5px 12px; border-radius: 8px;
    font-size: 0.78rem; font-weight: 700;
  }
  .kp-age { font-size: 0.75rem; font-family: 'DM Mono', monospace; }

  /* Steps */
  .kp-steps { position: relative; display: flex; justify-content: space-between; margin: 0 0 18px; }
  .kp-steps-track {
    position: absolute; top: 12px; left: 6%; right: 6%;
    height: 2px; background: #1e1e2e; overflow: hidden;
    border-radius: 2px;
  }
  .kp-steps-fill { height: 100%; transition: width 0.5s ease; border-radius: 2px; }
  .kp-step { display: flex; flex-direction: column; align-items: center; z-index: 1; }
  .kp-step-dot {
    width: 26px; height: 26px; border-radius: 50%;
    border: 2px solid #2d2d42; background: #0d0d18;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 700; color: #4b5563;
    margin-bottom: 6px; transition: all 0.3s;
  }
  .kp-step-dot.done { border-color: #10b981; background: #10b981; color: #fff; }
  .kp-step-dot.active { color: #fff; }
  .kp-step-label { font-size: 0.62rem; color: #374151; text-transform: uppercase; letter-spacing: 0.3px; font-weight: 600; }
  .kp-step-label.on { color: #9ca3af; }

  /* Status badge */
  .kp-status-badge {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 14px; border-radius: 10px;
    font-size: 0.82rem; font-weight: 700;
    border: 1px solid transparent;
    margin-bottom: 14px;
  }

  /* Items */
  .kp-items { margin-bottom: 16px; }
  .kp-item {
    display: flex; justify-content: space-between; align-items: center;
    padding: 9px 0;
    border-bottom: 1px solid #13131e;
  }
  .kp-item:last-child { border-bottom: none; }
  .kp-item-name { color: #cbd5e1; font-size: 0.9rem; font-weight: 500; }
  .kp-item-qty {
    background: #1a1a2e; color: #6b7280;
    padding: 3px 10px; border-radius: 7px;
    font-size: 0.78rem; font-weight: 700; font-family: 'DM Mono', monospace;
  }
  .kp-notes {
    margin-top: 10px; padding: 8px 12px;
    background: #13131e; border-radius: 8px;
    font-size: 0.8rem; color: #9ca3af;
    border-left: 3px solid #f59e0b;
  }

  /* Action button */
  .kp-action {
    width: 100%; padding: 13px; border: none;
    border-radius: 12px; cursor: pointer;
    font-weight: 700; font-size: 0.9rem;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.15s;
    font-family: 'Manrope', sans-serif;
  }
  .kp-action:disabled { opacity: 0.6; cursor: not-allowed; }
  .kp-action--accept  { background: linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; }
  .kp-action--cooking { background: linear-gradient(135deg,#f97316,#ea580c); color:#fff; }
  .kp-action--ready   { background: linear-gradient(135deg,#10b981,#059669); color:#fff; }
  .kp-action--served  { background: linear-gradient(135deg,#22c55e,#16a34a); color:#fff; }
  .kp-action:not(:disabled):hover { opacity: 0.9; transform: scale(1.02); }
  .kp-action:not(:disabled):active { transform: scale(0.98); }

  .kp-btn-spin {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Loading / empty */
  .kp-loading {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 40vh; gap: 16px; color: #4b5563;
  }
  .kp-spinner {
    width: 36px; height: 36px; border-radius: 50%;
    border: 3px solid #1e1e2e; border-top-color: #818cf8;
    animation: spin 0.8s linear infinite;
  }
  .kp-empty {
    text-align: center; padding: 60px 20px; color: #4b5563;
  }
  .kp-empty-icon { font-size: 3rem; margin-bottom: 14px; }
  .kp-empty h3 { color: #6b7280; margin-bottom: 6px; font-size: 1.05rem; }
  .kp-empty p { font-size: 0.85rem; }

  @media (max-width: 640px) {
    .kp-grid { grid-template-columns: 1fr; }
    .kp-stats { gap: 8px; padding: 12px 14px; }
    .kp-stat-n { font-size: 1.4rem; }
    .kp-toolbar { flex-direction: column; align-items: stretch; }
    .kp-tabs { justify-content: center; }
  }
`;

export default KitchenPanel;