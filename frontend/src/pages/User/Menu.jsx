import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import GuestMobileNav from "../../components/GuestMobileNav";
import { loadGuestCart, saveGuestCart } from "../../utils/guestFlow";

const fmtCurrency = (value) => `Rs ${Number(value ?? 0).toLocaleString("en-IN")}`;

const getCategoryName = (item) => (typeof item.category === "object" ? item.category?.name : item.category) || "Specials";

const Menu = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const storedCart = loadGuestCart(tableId);

  const [items, setItems] = useState([]);
  const [cart, setCart] = useState(storedCart.items || []);
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMenu();
  }, [tableId]);

  useEffect(() => {
    const stored = loadGuestCart(tableId);
    setCart(stored.items || []);
  }, [tableId]);

  useEffect(() => {
    saveGuestCart({ tableId, items: cart });
  }, [cart, tableId]);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/user/menu");
      const data = Array.isArray(res.data) ? res.data : [];
      setItems(data);

      const uniqueCategories = [...new Set(data.map(getCategoryName).filter(Boolean))];
      setCategories(["all", ...uniqueCategories]);
    } catch (err) {
      console.error("Error fetching menu:", err);
      setItems([]);
      setCategories(["all"]);
      setError("Unable to load the menu right now.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const existing = cart.find((entry) => entry.id === item.id);
    if (existing) {
      setCart((current) =>
        current.map((entry) => (entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry))
      );
      return;
    }

    setCart((current) => [...current, { ...item, quantity: 1 }]);
  };

  const removeFromCart = (itemId) => {
    const existing = cart.find((entry) => entry.id === itemId);
    if (!existing) return;

    if (existing.quantity > 1) {
      setCart((current) =>
        current.map((entry) => (entry.id === itemId ? { ...entry, quantity: entry.quantity - 1 } : entry))
      );
      return;
    }

    setCart((current) => current.filter((entry) => entry.id !== itemId));
  };

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const filteredItems = items.filter((item) => {
    const itemCategory = getCategoryName(item);
    const matchesCategory = activeCategory === "all" || itemCategory === activeCategory;
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredItems = filteredItems.slice(0, 3);
  const tableLabel = tableId ? `Table ${tableId}` : "Walk-in menu";

  return (
    <div className="guest-shell">
      <style>{CSS}</style>

      <header className="guest-hero">
        <div className="hero-copy">
          <p className="hero-kicker">QR dining menu</p>
          <h1>Choose dishes, review the order, and send it straight to the kitchen.</h1>
          <p className="hero-text">
            Browse the full card, filter by section, and build the table order without waiting for printed menus.
          </p>

          <div className="hero-meta">
            <span className="table-pill">{tableLabel}</span>
            <span className="hero-note">{items.length} dishes loaded</span>
          </div>
        </div>

        <div className="hero-panel">
          <span className="panel-label">House picks</span>
          <div className="feature-list">
            {featuredItems.length === 0 ? (
              <div className="feature-card muted">
                <strong>Menu unavailable</strong>
                <span>Try refreshing when the kitchen catalog is back online.</span>
              </div>
            ) : (
              featuredItems.map((item) => (
                <div key={item.id} className="feature-card">
                  <strong>{item.name}</strong>
                  <span>{fmtCurrency(item.price)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </header>

      <section className="control-bar">
        <label className="search-field">
          <span>Search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for dishes, drinks, or desserts"
          />
        </label>
        <div className="quick-stats">
          <div className="stat-pill">
            <strong>{categories.length > 0 ? categories.length - 1 : 0}</strong>
            <span>categories</span>
          </div>
          <div className="stat-pill">
            <strong>{filteredItems.length}</strong>
            <span>visible</span>
          </div>
        </div>
      </section>

      <section className="chip-row">
        {categories.map((category) => (
          <button
            key={category}
            className={`chip ${activeCategory === category ? "active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category === "all" ? "All items" : category}
          </button>
        ))}
      </section>

      {error ? <section className="message-card error-card">{error}</section> : null}

      {loading ? (
        <section className="message-card">Loading menu...</section>
      ) : filteredItems.length === 0 ? (
        <section className="message-card">No dishes match the current search or category.</section>
      ) : (
        <section className="menu-grid">
          {filteredItems.map((item) => {
            const cartItem = cart.find((entry) => entry.id === item.id);

            return (
              <article key={item.id} className="dish-card">
                <div className="dish-media">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <div className="media-fallback">{getCategoryName(item).slice(0, 3).toUpperCase()}</div>
                  )}
                </div>

                <div className="dish-body">
                  <div className="dish-topline">
                    <span className="dish-tag">{getCategoryName(item)}</span>
                    <span className="dish-price">{fmtCurrency(item.price)}</span>
                  </div>

                  <h3>{item.name}</h3>
                  <p>{item.description || "Freshly prepared and served for table ordering."}</p>

                  <div className="dish-actions">
                    {cartItem ? (
                      <div className="qty-box">
                        <button onClick={() => removeFromCart(item.id)}>-</button>
                        <span>{cartItem.quantity}</span>
                        <button onClick={() => addToCart(item)}>+</button>
                      </div>
                    ) : (
                      <button className="primary-btn" onClick={() => addToCart(item)}>
                        Add to order
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {cart.length > 0 ? (
        <div className="cart-dock">
          <div>
            <strong>{cartCount} items in order</strong>
            <p>{fmtCurrency(cartTotal)} current total</p>
          </div>

          <button className="checkout-btn" onClick={() => navigate("/cart", { state: { cart, tableId } })}>
            Review cart
          </button>
        </div>
      ) : null}

      <GuestMobileNav currentTableId={tableId} />
    </div>
  );
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');

  .guest-shell {
    --ink: #201818;
    --muted: #557180;
    --line: rgba(15, 34, 48, 0.1);
    --paper: rgba(248, 253, 255, 0.88);
    --accent: #0891b2;
    --accent-deep: #155e75;
    min-height: 100vh;
    padding: 24px 24px 96px;
    background:
      radial-gradient(circle at top left, rgba(34, 211, 238, 0.2), transparent 24%),
      radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.16), transparent 28%),
      linear-gradient(180deg, #effbff 0%, #dff4fb 100%);
    color: #0f2230;
    font-family: 'Manrope', sans-serif;
  }

  .guest-hero,
  .control-bar,
  .message-card,
  .dish-card,
  .cart-dock {
    background: var(--paper);
    border: 1px solid var(--line);
    box-shadow: 0 24px 80px rgba(18, 64, 90, 0.1);
    backdrop-filter: blur(12px);
  }

  .guest-hero {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.8fr);
    gap: 18px;
    padding: 28px;
    border-radius: 30px;
  }

  .hero-kicker,
  .panel-label,
  .search-field span {
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 0.72rem;
    font-weight: 800;
    color: var(--accent);
  }

  .hero-copy h1 {
    margin: 12px 0;
    max-width: 760px;
    font-family: 'Fraunces', serif;
    font-size: clamp(2.2rem, 5vw, 4.2rem);
    line-height: 0.98;
    letter-spacing: -0.05em;
  }

  .hero-text {
    max-width: 640px;
    margin: 0;
    color: var(--muted);
    line-height: 1.8;
  }

  .hero-meta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 22px;
  }

  .table-pill,
  .hero-note,
  .dish-tag,
  .chip {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 8px 14px;
    font-size: 0.78rem;
    font-weight: 800;
  }

  .table-pill {
    background: #0f2230;
    color: #fff;
  }

  .hero-note,
  .dish-tag {
    background: rgba(178, 74, 45, 0.1);
    color: var(--accent-deep);
  }

  .hero-panel {
    padding: 20px;
    border-radius: 24px;
    background:
      radial-gradient(circle at top right, rgba(34, 211, 238, 0.22), transparent 36%),
      linear-gradient(180deg, rgba(250, 254, 255, 0.96), rgba(230, 247, 252, 0.92));
    border: 1px solid rgba(15, 34, 48, 0.08);
  }

  .feature-list {
    display: grid;
    gap: 12px;
    margin-top: 16px;
  }

  .feature-card {
    display: grid;
    gap: 4px;
    padding: 14px 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.74);
    border: 1px solid rgba(15, 34, 48, 0.08);
  }

  .feature-card span,
  .feature-card.muted {
    color: var(--muted);
  }

  .control-bar {
    margin-top: 18px;
    padding: 18px;
    border-radius: 24px;
    display: grid;
    gap: 14px;
  }

  .search-field {
    display: grid;
    gap: 10px;
  }

  .search-field input {
    width: 100%;
    border: 1px solid rgba(15, 34, 48, 0.1);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.76);
    padding: 16px 18px;
    font: inherit;
    color: #0f2230;
  }

  .quick-stats {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .stat-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 16px;
    background: rgba(15, 34, 48, 0.05);
    border: 1px solid rgba(15, 34, 48, 0.06);
  }

  .stat-pill strong {
    font-size: 0.95rem;
  }

  .stat-pill span {
    color: var(--muted);
    font-size: 0.82rem;
    text-transform: lowercase;
  }

  .chip-row {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding: 18px 4px 4px;
  }

  .chip {
    border: 1px solid rgba(15, 34, 48, 0.08);
    background: rgba(255, 250, 244, 0.74);
    color: var(--muted);
    cursor: pointer;
    white-space: nowrap;
  }

  .chip.active {
    background: linear-gradient(135deg, var(--accent), var(--accent-deep));
    color: #fff;
    border-color: transparent;
  }

  .message-card {
    margin-top: 16px;
    padding: 22px;
    border-radius: 24px;
    text-align: center;
    color: var(--muted);
  }

  .error-card {
    color: #b4434b;
    background: rgba(255, 243, 242, 0.92);
    border-color: rgba(180, 67, 75, 0.18);
  }

  .menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 18px;
    margin-top: 18px;
  }

  .dish-card {
    overflow: hidden;
    border-radius: 26px;
  }

  .dish-media {
    height: 200px;
    background: linear-gradient(135deg, #d9f6fd, #eefcff);
  }

  .dish-media img,
  .media-fallback {
    width: 100%;
    height: 100%;
  }

  .dish-media img {
    object-fit: cover;
    display: block;
  }

  .media-fallback {
    display: grid;
    place-items: center;
    color: rgba(15, 34, 48, 0.72);
    font-family: 'Fraunces', serif;
    font-size: 2.4rem;
    letter-spacing: 0.08em;
  }

  .dish-body {
    display: grid;
    gap: 14px;
    padding: 20px;
  }

  .dish-topline,
  .dish-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .dish-price {
    font-weight: 800;
    color: var(--accent-deep);
  }

  .dish-body h3 {
    margin: 0;
    font-family: 'Fraunces', serif;
    font-size: 1.35rem;
    line-height: 1.05;
  }

  .dish-body p {
    margin: 0;
    color: var(--muted);
    line-height: 1.7;
  }

  .primary-btn,
  .qty-box button,
  .checkout-btn {
    border: none;
    font: inherit;
    cursor: pointer;
  }

  .primary-btn,
  .checkout-btn {
    border-radius: 16px;
    padding: 12px 16px;
    font-weight: 800;
    color: #fff;
    background: linear-gradient(135deg, var(--accent), var(--accent-deep));
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

  .qty-box span {
    min-width: 20px;
    text-align: center;
    font-weight: 800;
  }

  .cart-dock {
    position: fixed;
    left: 24px;
    right: 24px;
    bottom: 20px;
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
    padding: 18px 20px;
    border-radius: 24px;
    z-index: 20;
  }

  .cart-dock strong {
    display: block;
    margin-bottom: 4px;
  }

  .cart-dock p {
    margin: 0;
    color: var(--muted);
  }

  @media (max-width: 900px) {
    .guest-hero {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .guest-shell {
      padding: 12px 12px 96px;
    }

    .guest-hero {
      padding: 18px;
      border-radius: 24px;
      gap: 14px;
    }

    .hero-copy h1 {
      font-size: 2rem;
      line-height: 1.02;
    }

    .hero-text {
      font-size: 0.95rem;
      line-height: 1.65;
    }

    .hero-panel {
      padding: 16px;
      border-radius: 20px;
    }

    .control-bar,
    .message-card {
      padding: 14px;
      border-radius: 20px;
    }

    .search-field input {
      padding: 14px 16px;
      border-radius: 16px;
      font-size: 16px;
    }

    .chip-row {
      position: sticky;
      top: 0;
      z-index: 10;
      margin: 0 -12px;
      padding: 12px;
      background: linear-gradient(180deg, rgba(223, 244, 251, 0.96), rgba(223, 244, 251, 0.78));
      backdrop-filter: blur(10px);
    }

    .chip {
      min-height: 42px;
      padding: 10px 14px;
    }

    .menu-grid {
      grid-template-columns: 1fr;
      gap: 14px;
    }

    .dish-card {
      border-radius: 22px;
    }

    .dish-media {
      height: 160px;
    }

    .dish-body {
      padding: 16px;
      gap: 12px;
    }

    .dish-topline {
      align-items: flex-start;
    }

    .dish-body h3 {
      font-size: 1.2rem;
    }

    .dish-actions {
      justify-content: stretch;
    }

    .primary-btn,
    .checkout-btn {
      width: 100%;
      min-height: 48px;
    }

    .cart-dock {
      left: 12px;
      right: 12px;
      bottom: 12px;
      padding: 14px;
      border-radius: 20px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .checkout-btn {
      width: 100%;
    }
  }
`;

export default Menu;
