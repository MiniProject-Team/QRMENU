import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import GuestMobileNav from "../../components/GuestMobileNav";
import { loadCurrentOrder, saveCurrentOrder } from "../../utils/guestFlow";

const methodOptions = [
  { value: "CASH", label: "Cash", note: "Pay at the table or counter" },
  { value: "UPI", label: "UPI", note: "Fast phone payment" },
  { value: "CARD", label: "Card", note: "Debit or credit card" },
];

const paymentAllowedStatuses = ["READY", "SERVED", "COMPLETED"];

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storedOrder = loadCurrentOrder();
  const [orderId, setOrderId] = useState(
    location.state?.orderId ? String(location.state.orderId) : storedOrder?.orderId ? String(storedOrder.orderId) : ""
  );
  const [method, setMethod] = useState("CASH");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [checkingOrder, setCheckingOrder] = useState(true);
  const [orderStatus, setOrderStatus] = useState("");

  useEffect(() => {
    const verifyOrder = async () => {
      if (!orderId) {
        setCheckingOrder(false);
        return;
      }

      try {
        setCheckingOrder(true);
        setError("");
        const res = await API.get(`/user/orders/${orderId}`);
        const status = res.data?.status ?? res.data?.orderStatus ?? res.data?.OrderStatus ?? "";
        setOrderStatus(status);
        saveCurrentOrder({
          orderId: res.data?.id ?? res.data?.orderId ?? Number(orderId),
          tableId: res.data?.tableId ?? storedOrder?.tableId ?? null,
        });
      } catch (err) {
        console.error("Unable to verify order for payment:", err);
        setError("Unable to verify the order before payment.");
      } finally {
        setCheckingOrder(false);
      }
    };

    verifyOrder();
  }, [orderId]);

  const canPay = paymentAllowedStatuses.includes(orderStatus);

  const pay = async () => {
    if (!orderId.trim()) {
      setError("Enter an order ID before continuing.");
      return;
    }

    if (!canPay) {
      setError("Payment is available only after the order is ready or completed.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await API.post("/user/payment/pay", {
        orderId: Number(orderId),
        method,
      });

      const payload = res.data ?? { orderId: Number(orderId), status: "SUCCESS", paymentMethod: method };
      setSuccess(payload);
      saveCurrentOrder({ orderId: payload.orderId ?? Number(orderId), tableId: storedOrder?.tableId ?? null });
    } catch (err) {
      console.error("Payment failed:", err);
      setSuccess(null);
      setError("Unable to complete the payment right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guest-shell">
      <style>{CSS}</style>

      <header className="payment-head">
        <button className="text-btn" onClick={() => navigate(-1)}>
          Back
        </button>

        <div>
          <p className="section-kicker">Payment desk</p>
          <h1>Complete payment for the order.</h1>
          <p className="page-copy">Use the saved order ID and choose the payment method that matches the guest checkout flow.</p>
        </div>
      </header>

      <section className="payment-layout">
        <article className="payment-card">
          <label className="field">
            <span>Order ID</span>
            <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Enter order ID" />
          </label>

          <div className="method-grid">
            {methodOptions.map((option) => (
              <button
                key={option.value}
                className={`method-card ${method === option.value ? "active" : ""}`}
                onClick={() => setMethod(option.value)}
              >
                <strong>{option.label}</strong>
                <span>{option.note}</span>
              </button>
            ))}
          </div>

          {checkingOrder ? <div className="info-box">Checking order status...</div> : null}
          {!checkingOrder && orderStatus ? (
            <div className={`status-box ${canPay ? "is-ready" : "is-locked"}`}>
              Order status: <strong>{orderStatus}</strong>
            </div>
          ) : null}
          {error ? <div className="error-box">{error}</div> : null}
          {success ? (
            <div className="success-box">
              <strong>Payment recorded</strong>
              <span>Order #{success.orderId} was processed with {success.paymentMethod || method}.</span>
            </div>
          ) : null}

          <button className="primary-btn large" onClick={pay} disabled={loading || checkingOrder || !canPay}>
            {loading ? "Processing..." : canPay ? "Confirm payment" : "Payment unavailable"}
          </button>

          {success ? (
            <button className="secondary-btn large" onClick={() => navigate(`/order-status/${success.orderId}`)}>
              Back to order status
            </button>
          ) : null}
        </article>

        <aside className="info-card">
          <p className="section-kicker">Checkout notes</p>
          <h2>Keep the final handoff clear.</h2>
          <ul>
            <li>Verify the order ID with the guest before accepting payment.</li>
            <li>Use cash for table settlement and UPI or card for direct digital closure.</li>
            <li>After payment, return to order status if you need to confirm service completion.</li>
          </ul>
        </aside>
      </section>

      <GuestMobileNav currentTableId={storedOrder?.tableId} />
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

  .payment-head,
  .payment-card,
  .info-card {
    background: rgba(248, 253, 255, 0.88);
    border: 1px solid rgba(15, 34, 48, 0.08);
    box-shadow: 0 24px 80px rgba(18, 64, 90, 0.1);
    backdrop-filter: blur(12px);
    border-radius: 28px;
  }

  .payment-head,
  .payment-card,
  .info-card {
    padding: 24px;
  }

  .payment-head {
    display: grid;
    gap: 14px;
  }

  .section-kicker,
  .field span {
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
    line-height: 0.98;
  }

  .page-copy,
  .method-card span,
  .info-card li {
    color: #557180;
    line-height: 1.7;
  }

  .payment-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.8fr);
    gap: 18px;
    margin-top: 18px;
  }

  .field {
    display: grid;
    gap: 10px;
  }

  .field input {
    border: 1px solid rgba(15, 34, 48, 0.1);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.76);
    padding: 16px 18px;
    font: inherit;
    color: #0f2230;
  }

  .method-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-top: 18px;
  }

  .method-card,
  .text-btn,
  .primary-btn {
    border: none;
    font: inherit;
    cursor: pointer;
  }

  .method-card {
    text-align: left;
    padding: 16px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.74);
    border: 1px solid rgba(15, 34, 48, 0.08);
  }

  .method-card.active {
    background: linear-gradient(135deg, #0891b2, #155e75);
    color: #fff;
  }

  .method-card.active span {
    color: rgba(255, 255, 255, 0.76);
  }

  .method-card strong {
    display: block;
    margin-bottom: 6px;
  }

  .text-btn {
    width: fit-content;
    background: transparent;
    color: #0c7a96;
    font-weight: 800;
    padding: 0;
  }

  .primary-btn {
    border-radius: 16px;
    padding: 12px 16px;
    color: #fff;
    background: linear-gradient(135deg, #0891b2, #155e75);
    font-weight: 800;
  }

  .secondary-btn {
    border: 1px solid rgba(8, 145, 178, 0.18);
    border-radius: 16px;
    padding: 12px 16px;
    color: #0f2230;
    background: rgba(8, 145, 178, 0.12);
    font: inherit;
    font-weight: 800;
    cursor: pointer;
  }

  .primary-btn:disabled,
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
    margin-top: 12px;
    padding: 16px;
  }

  .error-box,
  .info-box,
  .status-box,
  .success-box {
    margin-top: 16px;
    padding: 12px 14px;
    border-radius: 14px;
  }

  .info-box {
    background: rgba(224, 247, 250, 0.72);
    border: 1px solid rgba(8, 145, 178, 0.12);
    color: #0e7490;
  }

  .status-box {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(15, 34, 48, 0.08);
    color: #0f2230;
  }

  .status-box.is-ready {
    background: rgba(224, 247, 250, 0.92);
    border-color: rgba(8, 145, 178, 0.18);
    color: #0e7490;
  }

  .status-box.is-locked {
    background: rgba(255, 248, 224, 0.92);
    border-color: rgba(217, 119, 6, 0.18);
    color: #9a6700;
  }

  .error-box {
    background: rgba(255, 243, 242, 0.92);
    border: 1px solid rgba(180, 67, 75, 0.18);
    color: #b4434b;
  }

  .success-box {
    display: grid;
    gap: 4px;
    background: rgba(224, 247, 250, 0.92);
    border: 1px solid rgba(8, 145, 178, 0.18);
    color: #0e7490;
  }

  .info-card ul {
    padding-left: 18px;
    margin: 18px 0 0;
  }

  @media (max-width: 900px) {
    .payment-layout,
    .method-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .guest-shell {
      padding: 12px;
    }

    .payment-head,
    .payment-card,
    .info-card {
      padding: 16px;
      border-radius: 22px;
    }

    h1 {
      font-size: 1.9rem;
    }

    .page-copy {
      font-size: 0.95rem;
    }

    .field input {
      padding: 14px 16px;
      font-size: 16px;
    }

    .method-card {
      padding: 14px;
      border-radius: 16px;
      min-height: 72px;
    }

    .primary-btn.large,
    .secondary-btn.large {
      min-height: 48px;
    }
  }
`;

export default Payment;
