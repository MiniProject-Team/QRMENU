import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GuestMobileNav from "../../components/GuestMobileNav";
import { loadGuestCart, saveGuestCart } from "../../utils/guestFlow";

const fmtCurrency = (value) => `Rs ${Number(value ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stored = loadGuestCart(location.state?.tableId);
  const initialCart = location.state?.cart || stored.items || [];
  const tableId = location.state?.tableId || stored.tableId;

  const [cart, setCart] = useState(initialCart);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.cart) {
      setCart(location.state.cart);
    }
  }, [location.state?.cart]);

  useEffect(() => {
    saveGuestCart({ tableId, items: cart });
  }, [cart, tableId]);

  const updateQuantity = (itemId, change) => {
    setCart((current) =>
      current
        .map((item) => {
          if (item.id !== itemId) return item;
          return { ...item, quantity: item.quantity + change };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (itemId) => {
    setCart((current) => current.filter((item) => item.id !== itemId));
  };

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const tax = useMemo(() => subtotal * 0.1, [subtotal]);
  const grandTotal = useMemo(() => subtotal + tax, [subtotal, tax]);
  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  if (!cart.length) {
    return (
      <div className="guest-shell empty-shell">
        <style>{CSS}</style>
        <section className="empty-card">
          <p className="section-kicker">No active order</p>
          <h1>Your cart is empty.</h1>
          <p>Browse the menu and add dishes before placing an order for this table.</p>
          <button className="primary-btn" onClick={() => navigate(`/menu/${tableId || 1}`)}>
            Browse menu
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="guest-shell">
      <style>{CSS}</style>

      <header className="page-head">
        <button className="text-btn" onClick={() => navigate(`/menu/${tableId || 1}`, { state: { cart, tableId } })}>
          Back to menu
        </button>

        <div>
          <p className="section-kicker">Order review</p>
          <h1>Your table cart</h1>
          <p className="page-copy">
            Review quantities, remove anything you do not want, and send the final order directly to the kitchen.
          </p>
        </div>

        <div className="page-badge">{tableId ? `Table ${tableId}` : "Walk-in order"}</div>
      </header>

      <section className="cart-layout">
        <div className="cart-list">
          {cart.map((item) => (
            <article key={item.id} className="cart-item">
              <div className="thumb">
                {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <span>{String(item.name).slice(0, 2).toUpperCase()}</span>}
              </div>

              <div className="item-copy">
                <h3>{item.name}</h3>
                <p>{fmtCurrency(item.price)} each</p>
              </div>

              <div className="qty-box">
                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
              </div>

              <strong className="item-total">{fmtCurrency(item.price * item.quantity)}</strong>

              <button className="remove-btn" onClick={() => removeItem(item.id)}>
                Remove
              </button>
            </article>
          ))}
        </div>

        <aside className="summary-card">
          <p className="section-kicker">Summary</p>
          <h2>{itemCount} items ready</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{fmtCurrency(subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <strong>{fmtCurrency(tax)}</strong>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <strong>{fmtCurrency(grandTotal)}</strong>
          </div>

          {error ? <div className="error-box">{error}</div> : null}

          <button className="primary-btn large" onClick={() => navigate("/checkout", { state: { cart, tableId } })}>
            Continue to checkout
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
    padding: 24px;
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

  .page-head,
  .cart-item,
  .summary-card,
  .empty-card {
    background: rgba(248, 253, 255, 0.88);
    border: 1px solid rgba(15, 34, 48, 0.08);
    box-shadow: 0 24px 80px rgba(18, 64, 90, 0.1);
    backdrop-filter: blur(12px);
  }

  .empty-card,
  .summary-card,
  .cart-item,
  .page-head {
    border-radius: 28px;
  }

  .empty-card {
    max-width: 560px;
    padding: 32px;
    text-align: center;
  }

  .page-head {
    display: grid;
    gap: 14px;
    padding: 24px;
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
  h2,
  h3 {
    font-family: 'Fraunces', serif;
    letter-spacing: -0.04em;
  }

  .page-head h1,
  .empty-card h1 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 0.98;
  }

  .page-copy,
  .empty-card p,
  .item-copy p {
    color: #557180;
    line-height: 1.7;
  }

  .page-copy {
    margin: 10px 0 0;
    max-width: 760px;
  }

  .page-badge {
    width: fit-content;
    padding: 8px 14px;
    border-radius: 999px;
    background: #0f2230;
    color: #fff;
    font-weight: 800;
    font-size: 0.8rem;
  }

  .text-btn,
  .primary-btn,
  .qty-box button,
  .remove-btn {
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

  .cart-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.8fr);
    gap: 18px;
    margin-top: 18px;
  }

  .cart-list {
    display: grid;
    gap: 14px;
  }

  .cart-item {
    display: grid;
    grid-template-columns: 84px minmax(0, 1fr) auto auto auto;
    gap: 14px;
    align-items: center;
    padding: 18px;
  }

  .thumb {
    width: 84px;
    height: 84px;
    border-radius: 20px;
    overflow: hidden;
    background: linear-gradient(135deg, #d9f6fd, #eefcff);
    display: grid;
    place-items: center;
    font-weight: 800;
    color: rgba(15, 34, 48, 0.72);
  }

  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .item-copy h3 {
    margin: 0 0 6px;
    font-size: 1.3rem;
  }

  .item-copy p {
    margin: 0;
  }

  .qty-box {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px;
    border-radius: 16px;
    background: rgba(15, 34, 48, 0.08);
  }

  .qty-box button {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    background: #0f2230;
    color: #fff;
    font-weight: 800;
  }

  .qty-box span,
  .item-total {
    font-weight: 800;
  }

  .remove-btn {
    color: #b4434b;
    background: rgba(244, 222, 214, 0.92);
    border-radius: 14px;
    padding: 10px 14px;
    font-weight: 700;
  }

  .summary-card {
    height: fit-content;
    padding: 24px;
    position: sticky;
    top: 20px;
  }

  .summary-card h2 {
    margin: 0 0 18px;
    font-size: 2rem;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(15, 34, 48, 0.08);
  }

  .total-row {
    border-bottom: none;
    font-size: 1.1rem;
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
    padding: 16px;
  }

  .error-box {
    margin-top: 16px;
    padding: 12px 14px;
    border-radius: 14px;
    background: rgba(255, 243, 242, 0.92);
    border: 1px solid rgba(180, 67, 75, 0.18);
    color: #b4434b;
  }

  @media (max-width: 980px) {
    .cart-layout {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 760px) {
    .guest-shell {
      padding: 12px;
    }

    .page-head,
    .empty-card,
    .cart-item,
    .summary-card {
      border-radius: 22px;
      padding: 16px;
    }

    .page-head h1,
    .empty-card h1 {
      font-size: 1.9rem;
    }

    .page-copy {
      font-size: 0.95rem;
    }

    .cart-item {
      grid-template-columns: 72px 1fr;
      gap: 12px;
    }

    .qty-box,
    .item-total,
    .remove-btn {
      grid-column: 2;
      width: 100%;
    }

    .qty-box {
      justify-content: center;
      min-height: 46px;
    }

    .qty-box button {
      width: 40px;
      height: 40px;
    }

    .item-total {
      font-size: 1rem;
    }

    .remove-btn,
    .primary-btn.large {
      min-height: 48px;
    }

    .summary-card {
      position: static;
    }
  }
`;

export default Cart;
