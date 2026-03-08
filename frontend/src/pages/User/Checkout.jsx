import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import GuestMobileNav from "../../components/GuestMobileNav";
import { clearGuestCart, loadGuestCart, saveCurrentOrder } from "../../utils/guestFlow";

const fmtCurrency = (value) => `Rs ${Number(value ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initial = location.state?.cart?.length ? { items: location.state.cart, tableId: location.state.tableId } : loadGuestCart();

  const [cart, setCart] = useState(initial.items || []);
  const [tableId, setTableId] = useState(initial.tableId || null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.cart?.length) {
      setCart(location.state.cart);
      setTableId(location.state.tableId);
    }
  }, [location.state]);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const tax = useMemo(() => subtotal * 0.1, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);
  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const placeOrder = async () => {
    try {
      setPlacing(true);
      setError("");

      const payload = {
        tableId,
        items: cart.map((item) => ({ itemId: item.id, quantity: item.quantity })),
      };

      const res = await API.post("/user/orders/place", payload);
      const data = res?.data;
      let newId = null;

      if (typeof data === "number" || typeof data === "string") newId = data;
      else if (data?.id) newId = data.id;
      else if (data?.order?.id) newId = data.order.id;
      else if (data?.orderId) newId = data.orderId;
      else if (data?.orderID) newId = data.orderID;

      if (!newId && res?.headers?.location) {
        const match = String(res.headers.location).match(/\/(\d+)(?:$|\D)/);
        if (match) newId = match[1];
      }

      if (!newId) {
        setError("Order was submitted, but the order ID could not be confirmed.");
        return;
      }

      clearGuestCart();
      saveCurrentOrder({ orderId: newId, tableId });
      navigate(`/order-status/${newId}`);
    } catch (err) {
      console.error("Checkout failed:", err);
      setError("Unable to place the order right now.");
    } finally {
      setPlacing(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="guest-shell empty-shell">
        <style>{CSS}</style>
        <section className="checkout-card">
          <p className="section-kicker">Checkout</p>
          <h1>No items ready for checkout.</h1>
          <p>Return to the menu and add dishes before continuing.</p>
          <button className="primary-btn" onClick={() => navigate(`/menu/${tableId || 1}`)}>
            Back to menu
          </button>
        </section>
        <GuestMobileNav currentTableId={tableId} />
      </div>
    );
  }

  return (
    <div className="guest-shell">
      <style>{CSS}</style>

      <header className="checkout-head">
        <button className="text-btn" onClick={() => navigate("/cart")}>
          Back to cart
        </button>
        <div>
          <p className="section-kicker">Final review</p>
          <h1>Checkout for table {tableId ?? "-"}</h1>
          <p className="page-copy">Confirm the item list and send the order to the kitchen.</p>
        </div>
      </header>

      <section className="checkout-layout">
        <article className="checkout-card">
          <div className="summary-strip">
            <div>
              <strong>{itemCount}</strong>
              <span>items</span>
            </div>
            <div>
              <strong>{fmtCurrency(total)}</strong>
              <span>payable</span>
            </div>
          </div>

          <div className="item-list">
            {cart.map((item) => (
              <div key={item.id} className="item-row">
                <div>
                  <strong>{item.name}</strong>
                  <span>{fmtCurrency(item.price)} each</span>
                </div>
                <div className="item-meta">
                  <span>x{item.quantity}</span>
                  <strong>{fmtCurrency(item.price * item.quantity)}</strong>
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside className="checkout-card side-card">
          <div className="price-row">
            <span>Subtotal</span>
            <strong>{fmtCurrency(subtotal)}</strong>
          </div>
          <div className="price-row">
            <span>Tax</span>
            <strong>{fmtCurrency(tax)}</strong>
          </div>
          <div className="price-row total-row">
            <span>Total</span>
            <strong>{fmtCurrency(total)}</strong>
          </div>

          {error ? <div className="error-box">{error}</div> : null}

          <button className="primary-btn large" onClick={placeOrder} disabled={placing}>
            {placing ? "Placing order..." : "Confirm and place order"}
          </button>
        </aside>
      </section>

      <GuestMobileNav currentTableId={tableId} />
    </div>
  );
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');

  .guest-shell {
    min-height: 100vh;
    padding: 24px 24px 96px;
    background:
      radial-gradient(circle at top left, rgba(34, 211, 238, 0.2), transparent 24%),
      radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.16), transparent 28%),
      linear-gradient(180deg, #effbff 0%, #dff4fb 100%);
    color: #0f2230;
    font-family: 'Manrope', sans-serif;
  }

  .empty-shell {
    display: grid;
    place-items: center;
  }

  .checkout-head,
  .checkout-card {
    background: rgba(248, 253, 255, 0.88);
    border: 1px solid rgba(15, 34, 48, 0.08);
    box-shadow: 0 24px 80px rgba(18, 64, 90, 0.1);
    backdrop-filter: blur(12px);
    border-radius: 28px;
    padding: 24px;
  }

  .checkout-head {
    display: grid;
    gap: 14px;
  }

  .section-kicker {
    margin: 0 0 10px;
    color: #0891b2;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 0.72rem;
    font-weight: 800;
  }

  h1 {
    margin: 0;
    font-family: 'Fraunces', serif;
    font-size: clamp(2rem, 4vw, 3rem);
    letter-spacing: -0.04em;
  }

  .page-copy,
  .item-row span {
    color: #557180;
    line-height: 1.7;
  }

  .text-btn,
  .primary-btn {
    border: none;
    font: inherit;
    cursor: pointer;
  }

  .text-btn {
    width: fit-content;
    background: transparent;
    color: #0c7a96;
    font-weight: 800;
    padding: 0;
  }

  .checkout-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.8fr);
    gap: 18px;
    margin-top: 18px;
  }

  .summary-strip {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 18px;
  }

  .summary-strip div {
    padding: 14px;
    border-radius: 18px;
    background: rgba(15, 34, 48, 0.05);
    border: 1px solid rgba(15, 34, 48, 0.06);
  }

  .summary-strip strong {
    display: block;
    font-size: 1.3rem;
  }

  .summary-strip span {
    color: #557180;
    font-size: 0.84rem;
  }

  .item-list {
    display: grid;
    gap: 10px;
  }

  .item-row,
  .price-row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: center;
  }

  .item-row {
    padding: 14px 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(15, 34, 48, 0.08);
  }

  .item-row strong {
    display: block;
  }

  .item-meta {
    text-align: right;
  }

  .side-card {
    height: fit-content;
    position: sticky;
    top: 20px;
  }

  .price-row {
    padding: 12px 0;
    border-bottom: 1px solid rgba(15, 34, 48, 0.08);
  }

  .total-row {
    font-size: 1.1rem;
    border-bottom: none;
  }

  .primary-btn {
    border-radius: 16px;
    padding: 12px 16px;
    color: #fff;
    background: linear-gradient(135deg, #0891b2, #155e75);
    font-weight: 800;
  }

  .primary-btn.large {
    width: 100%;
    margin-top: 18px;
    min-height: 48px;
  }

  .error-box {
    margin-top: 16px;
    padding: 12px 14px;
    border-radius: 14px;
    background: rgba(255, 243, 242, 0.92);
    border: 1px solid rgba(180, 67, 75, 0.18);
    color: #b4434b;
  }

  @media (max-width: 900px) {
    .checkout-layout {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .guest-shell {
      padding: 12px 12px 96px;
    }

    .checkout-head,
    .checkout-card {
      padding: 16px;
      border-radius: 22px;
    }

    h1 {
      font-size: 1.9rem;
    }

    .summary-strip {
      grid-template-columns: 1fr;
    }

    .item-row {
      padding: 12px 14px;
      border-radius: 16px;
    }

    .side-card {
      position: static;
    }
  }
`;

export default Checkout;
