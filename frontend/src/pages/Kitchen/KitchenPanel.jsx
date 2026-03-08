import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import API from "../../api/axios";
import OpsLayout from "../../components/ops/OpsLayout";

const STATUS_FLOW = {
  PENDING: { label: "Queued", color: "#b88209", tone: "rgba(244, 183, 64, 0.14)", next: "accept", action: "Accept" },
  PLACED: { label: "Queued", color: "#b88209", tone: "rgba(244, 183, 64, 0.14)", next: "accept", action: "Accept" },
  ACCEPTED: { label: "Accepted", color: "#3a74d8", tone: "rgba(110, 168, 254, 0.14)", next: "ready", action: "Mark ready" },
  READY: { label: "Ready", color: "#1b8f61", tone: "rgba(53, 197, 138, 0.14)", next: "served", action: "Complete" },
  SERVED: { label: "Completed", color: "#6d7785", tone: "rgba(151, 163, 182, 0.14)", next: null, action: null },
};

const elapsed = (iso) => {
  if (!iso) return "-";
  const diff = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (diff < 1) return "Now";
  if (diff < 60) return `${diff} min`;
  return `${Math.floor(diff / 60)}h ${diff % 60}m`;
};

const parseItem = (item) => {
  if (typeof item === "string") return item;
  return `${item.itemName ?? item.name ?? "Item"} x ${item.quantity ?? 1}`;
};

const KitchenPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");
  const prevIds = useRef(new Set());

  const fetchOrders = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      setError("");
      const res = await API.get("/kitchen/orders/active");
      const data = res.data ?? [];
      prevIds.current = new Set(data.map((order) => order.orderId));
      setOrders(data);
    } catch (error) {
      console.error("Error loading kitchen orders:", error);
      setOrders([]);
      setError("Unable to load kitchen orders from the server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const poll = setInterval(() => fetchOrders(true), 4000);
    return () => clearInterval(poll);
  }, [fetchOrders]);

  const updateStatus = async (id, endpoint) => {
    setUpdating(id);
    try {
      setError("");
      await API.put(`/kitchen/orders/${endpoint}/${id}`);
      fetchOrders(true);
    } catch (error) {
      console.error("Kitchen update failed:", error);
      setError("Unable to update order status right now.");
    } finally {
      setUpdating(null);
    }
  };

  const visibleOrders = useMemo(() => {
    return orders.filter((order) => {
      if (activeTab === "done") return order.status === "SERVED";
      if (activeTab === "active") return order.status !== "SERVED";
      return true;
    });
  }, [activeTab, orders]);

  const counts = {
    queued: orders.filter((order) => ["PENDING", "PLACED"].includes(order.status)).length,
    accepted: orders.filter((order) => order.status === "ACCEPTED").length,
    ready: orders.filter((order) => order.status === "READY").length,
    completed: orders.filter((order) => order.status === "SERVED").length,
  };

  return (
    <OpsLayout
      title="Kitchen Panel"
      subtitle="Stay on top of queue pressure, complete tickets fast, and keep the pass moving."
      eyebrow="Kitchen / Live Queue"
      role="kitchen"
      badge={`${visibleOrders.length} tickets`}
      actions={
        <button className={`ops-primary-btn ${refreshing ? "muted" : ""}`} onClick={() => fetchOrders(true)}>
          Refresh
        </button>
      }
    >
      <style>{CSS}</style>

      <section className="stats-grid">
        {[
          { label: "Queued", value: counts.queued },
          { label: "Accepted", value: counts.accepted },
          { label: "Ready", value: counts.ready },
          { label: "Completed", value: counts.completed },
        ].map((item) => (
          <article key={item.label} className="panel-card stat-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="tab-row">
        {[
          { id: "active", label: "Active" },
          { id: "all", label: "All" },
          { id: "done", label: "Completed" },
        ].map((tab) => (
          <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </section>

      <section className="ticket-grid">
        {error ? <article className="panel-card error-state">{error}</article> : null}
        {loading ? (
          <article className="panel-card empty-state">Loading kitchen tickets...</article>
        ) : visibleOrders.length === 0 ? (
          <article className="panel-card empty-state">No tickets in this view right now.</article>
        ) : (
          visibleOrders.map((order) => {
            const flow = STATUS_FLOW[order.status] ?? STATUS_FLOW.PLACED;
            return (
              <article key={order.orderId} className="panel-card ticket-card">
                <div className="ticket-head">
                  <div>
                    <span className="table-pill">Table {order.tableNumber}</span>
                    <h3>Order #{order.orderId}</h3>
                  </div>
                  <span className="status-pill" style={{ color: flow.color, background: flow.tone }}>
                    {flow.label}
                  </span>
                </div>

                <p className="ticket-time">Open for {elapsed(order.createdAt)}</p>

                <div className="item-list">
                  {(order.items ?? []).map((item, index) => (
                    <div key={index} className="item-row">
                      {parseItem(item)}
                    </div>
                  ))}
                </div>

                {flow.next ? (
                  <button className="ops-primary-btn" disabled={updating === order.orderId} onClick={() => updateStatus(order.orderId, flow.next)}>
                    {updating === order.orderId ? "Updating..." : flow.action}
                  </button>
                ) : (
                  <div className="done-chip">Service complete</div>
                )}
              </article>
            );
          })
        )}
      </section>
    </OpsLayout>
  );
};

const CSS = `
  .ops-primary-btn,
  .tab-btn {
    border: none;
    border-radius: 14px;
    padding: 12px 16px;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  .ops-primary-btn {
    background: #17212b;
    color: #fff;
  }

  .ops-primary-btn.muted {
    opacity: 0.7;
  }

  .panel-card {
    padding: 22px;
    border-radius: 24px;
    background: rgba(255, 252, 246, 0.84);
    border: 1px solid rgba(23, 33, 43, 0.08);
    box-shadow: 0 24px 80px rgba(77, 56, 20, 0.09);
  }

  .stats-grid,
  .tab-row,
  .ticket-grid {
    display: grid;
    gap: 16px;
  }

  .stats-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .stat-card span,
  .ticket-time,
  .empty-state {
    color: #6d7785;
  }

  .stat-card strong {
    display: block;
    margin-top: 8px;
    font-size: 2rem;
    letter-spacing: -0.05em;
  }

  .tab-row {
    grid-template-columns: repeat(3, minmax(0, 160px));
  }

  .tab-btn {
    background: rgba(255, 252, 246, 0.84);
    border: 1px solid rgba(23, 33, 43, 0.08);
  }

  .tab-btn.active {
    background: #17212b;
    color: #fff;
  }

  .ticket-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  .ticket-card {
    display: grid;
    gap: 16px;
  }

  .ticket-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
  }

  .ticket-head h3 {
    margin: 10px 0 0;
  }

  .table-pill,
  .status-pill,
  .done-chip {
    display: inline-flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 0.04em;
  }

  .table-pill {
    background: rgba(23, 33, 43, 0.06);
    color: #6d7785;
  }

  .done-chip {
    background: rgba(151, 163, 182, 0.14);
    color: #6d7785;
    width: fit-content;
  }

  .item-list {
    display: grid;
    gap: 8px;
  }

  .item-row {
    padding: 12px 14px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.74);
    border: 1px solid rgba(23, 33, 43, 0.08);
  }

  .empty-state {
    text-align: center;
  }

  .error-state {
    color: #b4434b;
    background: rgba(255, 244, 244, 0.92);
    border-color: rgba(180, 67, 75, 0.18);
  }

  @media (max-width: 900px) {
    .stats-grid {
      grid-template-columns: 1fr 1fr;
    }

    .tab-row {
      grid-template-columns: 1fr;
    }
  }
`;

export default KitchenPanel;
