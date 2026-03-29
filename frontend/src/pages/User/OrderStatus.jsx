import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import GuestMobileNav from "../../components/GuestMobileNav";
import { saveCurrentOrder } from "../../utils/guestFlow";
import { formatRemainingPrep, getRemainingPrepMs, inferTotalTimeMinutes } from "../../utils/orderTimer";

const progressMap = {
  PLACED: 0,
  PENDING: 0,
  ACCEPTED: 1,
  COOKING: 2,
  PREPARING: 2,
  READY: 3,
  SERVED: 4,
  COMPLETED: 4,
};

const statusMeta = {
  PLACED: { label: "Order placed", tone: "amber", message: "The kitchen has your ticket and will confirm it shortly." },
  PENDING: { label: "Order placed", tone: "amber", message: "The kitchen has your ticket and will confirm it shortly." },
  ACCEPTED: { label: "Confirmed", tone: "blue", message: "Your order was accepted and moved into the prep queue." },
  COOKING: { label: "Preparing", tone: "orange", message: "The kitchen is actively preparing your dishes now." },
  PREPARING: { label: "Preparing", tone: "orange", message: "The kitchen is actively preparing your dishes now." },
  READY: { label: "Ready", tone: "green", message: "Your order is ready for service." },
  SERVED: { label: "Completed", tone: "slate", message: "The order has been completed. Enjoy your meal." },
  COMPLETED: { label: "Completed", tone: "slate", message: "The order has been completed. Enjoy your meal." },
};

const steps = [
  { key: "PLACED", label: "Placed" },
  { key: "ACCEPTED", label: "Confirmed" },
  { key: "COOKING", label: "Preparing" },
  { key: "READY", label: "Ready" },
  { key: "SERVED", label: "Done" },
];

const paymentAllowedStatuses = ["READY", "SERVED", "COMPLETED"];

const OrderStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 3000);
    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchOrder = async () => {
    try {
      setError("");
      const res = await API.get(`/user/orders/${orderId}`);
      setOrder(res.data);
      saveCurrentOrder({
        orderId: res.data?.id ?? res.data?.orderId ?? orderId,
        tableId: res.data?.tableId ?? null,
      });
    } catch (err) {
      console.error("Error fetching order:", err);
      setOrder(null);
      setError("Unable to load this order right now.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="guest-shell status-center">
        <style>{CSS}</style>
        <section className="status-card single">
          <p className="section-kicker">Order tracking</p>
          <h1>Loading order...</h1>
        </section>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="guest-shell status-center">
        <style>{CSS}</style>
        <section className="status-card single">
          <p className="section-kicker">Order unavailable</p>
          <h1>Order not found.</h1>
          <p>{error || "The requested order could not be loaded."}</p>
          <button className="primary-btn" onClick={() => navigate("/menu/1")}>
            Back to menu
          </button>
        </section>
      </div>
    );
  }

  const currentStatus = order?.status ?? order?.orderStatus ?? order?.OrderStatus ?? "PLACED";
  const currentStep = progressMap[currentStatus] ?? 0;
  const meta = statusMeta[currentStatus] ?? statusMeta.PLACED;
  const canProceedToPayment = paymentAllowedStatuses.includes(currentStatus);
  const startTime = order?.startTime ?? order?.orderStartTime ?? order?.createdAt;
  const totalTime = order?.totalTime ?? order?.totalTimeMinutes ?? inferTotalTimeMinutes(order?.items);
  const remainingMs = getRemainingPrepMs(startTime, totalTime, now);
  const timerLabel = formatRemainingPrep(remainingMs);

  return (
    <div className="guest-shell">
      <style>{CSS}</style>

      <header className="status-head">
        <div>
          <p className="section-kicker">Live order tracking</p>
          <h1>Order #{order.id ?? order.orderId}</h1>
          <p className="page-copy">{meta.message}</p>
        </div>

        <div className="head-meta">
          <div className="timer-badge">
            <span>Cooking timer</span>
            <strong>{timerLabel}</strong>
          </div>
          <div className={`status-badge tone-${meta.tone}`}>{meta.label}</div>
        </div>
      </header>

      <section className="status-layout">
        <article className="status-card">
          <div className="progress-rail">
            {steps.map((step, index) => (
              <div key={step.key} className="step-block">
                <div className={`step-dot ${index < currentStep ? "done" : ""} ${index === currentStep ? "live" : ""}`} />
                <strong>{step.label}</strong>
              </div>
            ))}
          </div>

          <div className="items-list">
            <h2>Order items</h2>
            {(order.items ?? []).length === 0 ? (
              <p className="muted-copy">No item details available for this order.</p>
            ) : (
              order.items.map((item, index) => (
                <div key={index} className="item-row">
                  <span>{item.menuItem?.name || item.itemName || `Item ${item.menuItemId ?? ""}`}</span>
                  <strong>x{item.quantity}</strong>
                </div>
              ))
            )}
          </div>
        </article>

        <aside className="summary-card">
          <p className="section-kicker">Dining table</p>
          <h2>{order.tableId ?? "-"}</h2>
          <div className="timer-panel">
            <span>Estimated prep time</span>
            <strong>{totalTime ?? 0} min</strong>
            <p className="muted-copy">Remaining: {timerLabel}</p>
          </div>
          <p className="muted-copy">
            {canProceedToPayment
              ? "Order is ready for settlement. You can proceed with payment now."
              : "Payment will unlock once the order is ready or completed."}
          </p>
          <button
            className="secondary-btn large"
            onClick={() => navigate("/payment", { state: { orderId: order.id ?? order.orderId } })}
            disabled={!canProceedToPayment}
          >
            {canProceedToPayment ? "Proceed to payment" : "Payment locked"}
          </button>
          <button className="primary-btn large" onClick={() => navigate(`/menu/${order.tableId || 1}`)}>
            Order more
          </button>
        </aside>
      </section>

      <GuestMobileNav currentTableId={order.tableId} />
    </div>
  );
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');

  .guest-shell {
    min-height: 100vh;
    padding: 24px;
    background:
      radial-gradient(circle at top left, rgba(34, 211, 238, 0.2), transparent 24%),
      radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.16), transparent 28%),
      linear-gradient(180deg, #effbff 0%, #dff4fb 100%);
    color: #0f2230;
    font-family: 'Manrope', sans-serif;
  }

  .status-center {
    display: grid;
    place-items: center;
  }

  .status-head,
  .status-card,
  .summary-card {
    background: rgba(248, 253, 255, 0.88);
    border: 1px solid rgba(15, 34, 48, 0.08);
    box-shadow: 0 24px 80px rgba(18, 64, 90, 0.1);
    backdrop-filter: blur(12px);
    border-radius: 28px;
  }

  .status-head,
  .status-card,
  .summary-card {
    padding: 24px;
  }

  .status-head {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
  }

  .head-meta {
    display: grid;
    gap: 12px;
    justify-items: end;
  }

  .section-kicker {
    margin: 0 0 10px;
    color: #0891b2;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 0.72rem;
    font-weight: 800;
  }

  h1,
  h2 {
    margin: 0;
    font-family: 'Fraunces', serif;
    letter-spacing: -0.04em;
  }

  h1 {
    font-size: clamp(2rem, 4vw, 3rem);
  }

  .page-copy,
  .muted-copy,
  .single p {
    color: #557180;
    line-height: 1.7;
  }

  .page-copy {
    margin: 10px 0 0;
    max-width: 680px;
  }

  .status-badge {
    border-radius: 999px;
    padding: 10px 16px;
    font-size: 0.82rem;
    font-weight: 800;
  }

  .timer-badge,
  .timer-panel {
    border-radius: 20px;
    background: rgba(8, 145, 178, 0.1);
    border: 1px solid rgba(8, 145, 178, 0.14);
  }

  .timer-badge {
    min-width: 180px;
    padding: 14px 16px;
    text-align: right;
  }

  .timer-badge span,
  .timer-panel span {
    display: block;
    color: #557180;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }

  .timer-badge strong,
  .timer-panel strong {
    display: block;
    margin-top: 6px;
    font-size: 1.6rem;
    font-weight: 800;
    color: #0f2230;
  }

  .tone-amber { background: rgba(250, 204, 21, 0.18); color: #9a6700; }
  .tone-blue { background: rgba(56, 189, 248, 0.18); color: #0369a1; }
  .tone-orange { background: rgba(251, 146, 60, 0.18); color: #c2410c; }
  .tone-green { background: rgba(16, 185, 129, 0.18); color: #0f766e; }
  .tone-slate { background: rgba(148, 163, 184, 0.18); color: #475569; }

  .status-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.8fr);
    gap: 18px;
    margin-top: 18px;
  }

  .progress-rail {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 24px;
  }

  .step-block {
    display: grid;
    gap: 10px;
    justify-items: center;
    text-align: center;
  }

  .step-dot {
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: rgba(15, 34, 48, 0.14);
    border: 4px solid rgba(15, 34, 48, 0.06);
  }

  .step-dot.done {
    background: #0f766e;
  }

  .step-dot.live {
    background: #0891b2;
    box-shadow: 0 0 0 8px rgba(8, 145, 178, 0.14);
  }

  .items-list h2 {
    margin-bottom: 16px;
    font-size: 1.8rem;
  }

  .item-row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: center;
    padding: 14px 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.82);
    border: 1px solid rgba(15, 34, 48, 0.08);
  }

  .item-row + .item-row {
    margin-top: 10px;
  }

  .summary-card h2 {
    font-size: 3rem;
    margin-bottom: 12px;
  }

  .timer-panel {
    margin: 18px 0;
    padding: 16px;
  }

  .timer-panel .muted-copy {
    margin: 10px 0 0;
  }

  .primary-btn {
    border: none;
    border-radius: 16px;
    padding: 12px 16px;
    color: #fff;
    background: linear-gradient(135deg, #0891b2, #155e75);
    font: inherit;
    font-weight: 800;
    cursor: pointer;
  }

  .secondary-btn {
    border: none;
    border-radius: 16px;
    padding: 12px 16px;
    color: #0f2230;
    background: rgba(8, 145, 178, 0.12);
    border: 1px solid rgba(8, 145, 178, 0.18);
    font: inherit;
    font-weight: 800;
    cursor: pointer;
  }

  .secondary-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .primary-btn.large {
    width: 100%;
    margin-top: 18px;
    padding: 16px;
  }

  .secondary-btn.large {
    width: 100%;
    margin-top: 18px;
    padding: 16px;
  }

  .single {
    max-width: 560px;
    text-align: center;
  }

  @media (max-width: 900px) {
    .status-head,
    .status-layout,
    .progress-rail {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .guest-shell {
      padding: 12px;
    }

    .status-head,
    .status-card,
    .summary-card {
      padding: 16px;
      border-radius: 22px;
    }

    .status-head {
      gap: 12px;
    }

    .head-meta {
      justify-items: start;
    }

    h1 {
      font-size: 1.9rem;
    }

    .page-copy,
    .muted-copy {
      font-size: 0.95rem;
    }

    .status-badge {
      width: fit-content;
    }

    .progress-rail {
      display: flex;
      gap: 14px;
      overflow-x: auto;
      padding-bottom: 8px;
      margin-bottom: 18px;
    }

    .step-block {
      min-width: 78px;
    }

    .item-row {
      padding: 12px 14px;
      border-radius: 16px;
      font-size: 0.95rem;
    }

    .summary-card h2 {
      font-size: 2.4rem;
    }

    .primary-btn.large,
    .secondary-btn.large {
      min-height: 48px;
    }
  }
`;

export default OrderStatus;
