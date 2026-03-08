import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import OpsLayout from "../../components/ops/OpsLayout";

const STATUS_META = {
  ALL: { label: "All", color: "#6d7785", tone: "rgba(23, 33, 43, 0.06)" },
  PENDING: { label: "Pending", color: "#b88209", tone: "rgba(244, 183, 64, 0.14)" },
  PLACED: { label: "Pending", color: "#b88209", tone: "rgba(244, 183, 64, 0.14)" },
  ACCEPTED: { label: "Accepted", color: "#3a74d8", tone: "rgba(110, 168, 254, 0.14)" },
  PREPARING: { label: "Cooking", color: "#cf6e15", tone: "rgba(255, 138, 61, 0.14)" },
  COOKING: { label: "Cooking", color: "#cf6e15", tone: "rgba(255, 138, 61, 0.14)" },
  READY: { label: "Ready", color: "#1b8f61", tone: "rgba(53, 197, 138, 0.14)" },
  SERVED: { label: "Served", color: "#6d7785", tone: "rgba(151, 163, 182, 0.14)" },
  COMPLETED: { label: "Served", color: "#6d7785", tone: "rgba(151, 163, 182, 0.14)" },
  CANCELLED: { label: "Cancelled", color: "#b4434b", tone: "rgba(239, 107, 115, 0.14)" },
};

const STATUS_TRANSITIONS = {
  PENDING: ["ACCEPTED", "CANCELLED"],
  PLACED: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY"],
  COOKING: ["READY"],
  READY: ["SERVED"],
  SERVED: [],
  CANCELLED: [],
};

const STATUS_ENDPOINT = {
  ACCEPTED: "accept",
  PREPARING: "cooking",
  READY: "ready",
  SERVED: "served",
  CANCELLED: "cancel",
};

const TABS = ["ALL", "PENDING", "ACCEPTED", "PREPARING", "READY", "SERVED", "CANCELLED"];
const fmtCurrency = (value) => `Rs ${Number(value ?? 0).toLocaleString("en-IN")}`;
const fmtTime = (iso) =>
  iso ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "-";

const normalizeStatus = (status) => (status === "PLACED" ? "PENDING" : status === "COOKING" ? "PREPARING" : status === "COMPLETED" ? "SERVED" : status);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams();
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);
      const res = await API.get(`/admin/orders?${params.toString()}`);
      setOrders(res.data ?? []);
    } catch (error) {
      console.error("Orders fetch error:", error);
      setOrders(
        Array.from({ length: 8 }, (_, index) => ({
          id: 301 - index,
          tableId: (index % 6) + 1,
          status: ["PENDING", "ACCEPTED", "PREPARING", "READY", "SERVED"][index % 5],
          totalAmount: 250 + index * 160,
          createdAt: new Date(Date.now() - index * 9 * 60000).toISOString(),
          items: [
            { quantity: 2, itemName: "Paneer Tikka" },
            { quantity: 1, itemName: "Butter Naan" },
          ],
        }))
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdate = async (orderId, nextStatus) => {
    const endpoint = STATUS_ENDPOINT[nextStatus];
    if (!endpoint) return;

    setUpdatingId(orderId);
    try {
      await API.put(`/kitchen/orders/${endpoint}/${orderId}`);
      fetchOrders(true);
    } catch (error) {
      console.error("Order update failed:", error);
      setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, status: nextStatus } : order)));
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = normalizeStatus(order.status ?? "");
      const matchesTab = activeTab === "ALL" || status === activeTab || order.status === activeTab;
      const needle = search.trim().toLowerCase();
      const matchesSearch =
        !needle ||
        String(order.id ?? "").includes(needle) ||
        String(order.tableId ?? "").includes(needle);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, orders, search]);

  const counts = TABS.reduce((acc, tab) => {
    acc[tab] =
      tab === "ALL"
        ? orders.length
        : orders.filter((order) => {
            const status = normalizeStatus(order.status ?? "");
            return status === tab || order.status === tab;
          }).length;
    return acc;
  }, {});

  return (
    <OpsLayout
      title="Order Control"
      subtitle="Review the full restaurant queue, filter service pressure, and push status updates from one desk."
      eyebrow="Admin / Orders"
      role="admin"
      badge={`${filteredOrders.length} visible`}
      actions={
        <button className={`ops-primary-btn ${refreshing ? "muted" : ""}`} onClick={() => fetchOrders(true)}>
          Refresh
        </button>
      }
    >
      <style>{CSS}</style>

      <section className="panel-card filter-panel">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order ID or table" />
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      </section>

      <section className="tab-row">
        {TABS.map((tab) => {
          const meta = STATUS_META[tab] ?? STATUS_META.ALL;
          return (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              style={activeTab === tab ? { color: meta.color, background: meta.tone } : {}}
              onClick={() => setActiveTab(tab)}
            >
              {meta.label}
              <span>{counts[tab] ?? 0}</span>
            </button>
          );
        })}
      </section>

      <section className="panel-card table-panel">
        <div className="orders-head">
          <span>Order</span>
          <span>Table</span>
          <span>Created</span>
          <span>Status</span>
          <span>Items</span>
          <span>Total</span>
          <span>Next action</span>
        </div>

        {loading ? (
          <div className="empty-state">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">No orders match the current filters.</div>
        ) : (
          filteredOrders.map((order) => {
            const status = STATUS_META[order.status] ?? STATUS_META.ALL;
            const transitions = STATUS_TRANSITIONS[order.status] ?? STATUS_TRANSITIONS[normalizeStatus(order.status)] ?? [];
            const nextAction = transitions[0];
            const itemCount = Array.isArray(order.items) ? order.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0) : 0;

            return (
              <div key={order.id} className="orders-row">
                <span className="mono">#{order.id}</span>
                <span>T{order.tableId ?? "-"}</span>
                <span>{fmtTime(order.createdAt)}</span>
                <span className="status-pill" style={{ color: status.color, background: status.tone }}>
                  {status.label}
                </span>
                <span>{itemCount}</span>
                <span className="mono">{fmtCurrency(order.totalAmount)}</span>
                <div className="action-cell">
                  {nextAction ? (
                    <button className="secondary-btn" disabled={updatingId === order.id} onClick={() => handleUpdate(order.id, nextAction)}>
                      {updatingId === order.id ? "Updating..." : STATUS_META[nextAction]?.label || nextAction}
                    </button>
                  ) : (
                    <span className="muted-label">No action</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>
    </OpsLayout>
  );
};

const CSS = `
  .ops-primary-btn,
  .secondary-btn,
  .tab-btn {
    border: none;
    border-radius: 14px;
    padding: 12px 16px;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  .ops-primary-btn,
  .secondary-btn {
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

  .filter-panel,
  .orders-head,
  .orders-row,
  .tab-row {
    display: grid;
    gap: 12px;
  }

  .filter-panel {
    grid-template-columns: 1.4fr 180px 180px;
  }

  .filter-panel input {
    border: 1px solid rgba(23, 33, 43, 0.1);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.74);
    padding: 14px 15px;
    font: inherit;
  }

  .tab-row {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .tab-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 252, 246, 0.84);
    border: 1px solid rgba(23, 33, 43, 0.08);
  }

  .tab-btn span {
    padding: 3px 8px;
    border-radius: 999px;
    background: rgba(23, 33, 43, 0.06);
    font-size: 0.75rem;
  }

  .table-panel {
    padding: 0;
    overflow: hidden;
  }

  .orders-head,
  .orders-row {
    grid-template-columns: 90px 70px 170px 120px 70px 100px 140px;
    align-items: center;
    padding: 16px 18px;
  }

  .orders-head {
    background: rgba(23, 33, 43, 0.05);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.68rem;
    color: #6d7785;
    font-weight: 800;
  }

  .orders-row {
    border-top: 1px solid rgba(23, 33, 43, 0.06);
  }

  .mono {
    font-family: 'IBM Plex Mono', monospace;
  }

  .status-pill {
    width: fit-content;
    padding: 7px 12px;
    border-radius: 999px;
    font-size: 0.76rem;
    font-weight: 800;
  }

  .action-cell {
    display: flex;
    justify-content: flex-end;
  }

  .muted-label,
  .empty-state {
    color: #6d7785;
  }

  .empty-state {
    padding: 28px 18px;
    text-align: center;
  }

  @media (max-width: 1100px) {
    .filter-panel {
      grid-template-columns: 1fr;
    }

    .orders-head,
    .orders-row {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .orders-head span:nth-child(3),
    .orders-head span:nth-child(5),
    .orders-row span:nth-child(3),
    .orders-row span:nth-child(5) {
      display: none;
    }
  }

  @media (max-width: 620px) {
    .orders-head {
      display: none;
    }

    .orders-row {
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .action-cell {
      grid-column: 1 / -1;
      justify-content: flex-start;
    }
  }
`;

export default Orders;
