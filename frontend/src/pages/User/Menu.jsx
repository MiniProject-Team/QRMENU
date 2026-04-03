import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import GuestMobileNav from "../../components/GuestMobileNav";
import { loadGuestCart, saveGuestCart } from "../../utils/guestFlow";
import { getMenuImage } from "../../utils/menuImages";

const fmtCurrency = (value) => `Rs ${Number(value ?? 0).toLocaleString("en-IN")}`;

const getCategoryName = (item) =>
  (typeof item.category === "object" ? item.category?.name : item.category) || "Specials";

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

  const matchesCategory =
    activeCategory === "all" ||
    itemCategory?.toLowerCase() === activeCategory?.toLowerCase();

  const matchesSearch =
    item.name?.toLowerCase().includes(searchTerm.toLowerCase());

  return matchesCategory && matchesSearch;
});

  const featuredItem =
    filteredItems.find((item) => item.name?.toLowerCase().includes("paneer")) ||
    filteredItems[0] ||
    items[0] ||
    null;

  const backgroundItem =
    items.find((item) => item.name?.toLowerCase().includes("biryani")) ||
    items.find((item) => item.name?.toLowerCase().includes("chicken")) ||
    featuredItem;

  const heroImage = backgroundItem ? getMenuImage(backgroundItem) : "";
  const tableLabel = tableId ? `Table ${tableId}` : "Walk-in menu";

  return (
    <div className="menu-shell" style={{ "--hero-image": heroImage ? `url(${heroImage})` : "none" }}>
      <style>{CSS}</style>

      <section className="hero-wrap">
        <div className="hero-overlay" />

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker">Premium QR Dining</p>
            <h1>DEEP HOTEL</h1>
            <h2>Every Bite Tells a Story.</h2>
            <p className="hero-text">
              From sizzling starters to rich main courses and delightful desserts, discover flavors that stay with you.
            </p>

            <div className="hero-meta">
              <span>{tableLabel}</span>
              <span>{items.length} dishes available</span>
              <span>Live QR ordering</span>
            </div>

            <div className="hero-actions">
              <button className="view-btn" onClick={() => document.getElementById("menu-content")?.scrollIntoView({ behavior: "smooth" })}>
                View Menu
              </button>
              <button className="explore-btn" onClick={() => document.getElementById("menu-content")?.scrollIntoView({ behavior: "smooth" })}>
                Explore
              </button>
            </div>
          </div>

          <aside className="feature-panel">
            <p className="feature-label">Featured Dish</p>

            <div className="feature-image-wrap">
              {featuredItem ? <img src={getMenuImage(featuredItem)} alt={featuredItem.name} /> : null}
              <span className="feature-chip">{featuredItem ? getCategoryName(featuredItem) : "Starters"}</span>
            </div>

            {featuredItem ? (
              <>
                <span className="feature-note">Chef&apos;s recommendation</span>
                <h3>{featuredItem.name}</h3>
                <p>{featuredItem.description}</p>
                <strong>{fmtCurrency(featuredItem.price)}</strong>

                <div className="feature-tags">
                  <span>Premium plating</span>
                  <span>Fresh kitchen prep</span>
                </div>

                <div className="feature-list">
                  {filteredItems.slice(0, 3).map((item) => (
                    <button key={item.id} className="mini-card" onClick={() => setActiveCategory("all")}>
                      <strong>{item.name}</strong>
                      <span>
                        {fmtCurrency(item.price)} · {getCategoryName(item)}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="message-card">Menu unavailable</div>
            )}
          </aside>
        </div>
      </section>

      <section className="content-wrap" id="menu-content">
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

          <div className="chip-row">
            {categories.map((category) => (
              <button
                key={category}
                className={`chip ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category === "all" ? "All Items" : category}
              </button>
            ))}
          </div>
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
                    <img
                      src={getMenuImage(item)}
                      alt={item.name}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80";
                      }}
                    />
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
      </section>

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
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

  .menu-shell {
    min-height: 100vh;
    background: #120907;
    color: #f6eee8;
    font-family: 'Manrope', sans-serif;
  }

  .hero-wrap {
    position: relative;
    min-height: 880px;
    padding: 42px 24px 28px;
    background-image:
      linear-gradient(90deg, rgba(15, 5, 2, 0.82) 0%, rgba(16, 7, 4, 0.72) 38%, rgba(20, 10, 6, 0.64) 100%),
      var(--hero-image);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 18% 86%, rgba(169, 67, 18, 0.22), transparent 26%),
      linear-gradient(180deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.24));
    pointer-events: none;
  }

  .hero-grid {
    position: relative;
    z-index: 1;
    min-height: calc(880px - 70px);
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(420px, 0.78fr);
    gap: 26px;
    align-items: start;
  }

  .hero-copy {
    align-self: center;
    max-width: 840px;
    padding-top: 170px;
  }

  .hero-kicker,
  .feature-label,
  .search-field span {
    margin: 0 0 22px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 0.98rem;
    font-weight: 800;
    color: rgba(233, 219, 205, 0.9);
  }

  .hero-copy h1,
  .feature-panel h3,
  .dish-body h3 {
    margin: 0;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 700;
    letter-spacing: -0.04em;
  }

  .hero-copy h1 {
    font-size: clamp(4.8rem, 10vw, 8.8rem);
    line-height: 0.88;
    color: #fff8f1;
  }

  .hero-copy h2 {
    margin: 8px 0 18px;
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.05;
    color: #f7ede4;
  }

  .hero-text {
    max-width: 780px;
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.9;
    color: rgba(244, 232, 222, 0.9);
  }

  .hero-meta,
  .hero-actions,
  .feature-tags,
  .chip-row,
  .dish-actions {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }

  .hero-meta {
    margin-top: 28px;
  }

  .hero-meta span,
  .feature-note,
  .feature-tags span,
  .chip {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
  }

  .hero-meta span {
    padding: 11px 20px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.16);
    color: #fff6ee;
    font-weight: 700;
    backdrop-filter: blur(12px);
  }

  .hero-actions {
    margin-top: 36px;
  }

  .view-btn,
  .explore-btn,
  .primary-btn,
  .checkout-btn,
  .qty-box button,
  .mini-card {
    border: none;
    font: inherit;
    cursor: pointer;
  }

  .view-btn,
  .explore-btn {
    min-width: 160px;
    min-height: 64px;
    padding: 0 28px;
    border-radius: 22px;
    font-size: 1rem;
    font-weight: 800;
  }

  .view-btn {
    color: #fff;
    background: linear-gradient(135deg, #ec6729, #bf4214);
  }

  .explore-btn {
    color: #f4e7db;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .feature-panel {
    margin-top: 42px;
    padding: 28px;
    border-radius: 32px;
    background: linear-gradient(180deg, rgba(86, 61, 49, 0.72), rgba(63, 45, 37, 0.8));
    border: 1px solid rgba(255, 255, 255, 0.14);
    backdrop-filter: blur(14px);
    box-shadow: 0 26px 80px rgba(0, 0, 0, 0.24);
  }

  .feature-image-wrap {
    position: relative;
    overflow: hidden;
    border-radius: 30px;
    margin-bottom: 18px;
    height: 326px;
  }

  .feature-image-wrap img,
  .dish-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .feature-chip {
    position: absolute;
    left: 18px;
    bottom: 18px;
    padding: 12px 18px;
    border-radius: 999px;
    background: rgba(255, 248, 240, 0.94);
    color: #9f4d22;
    font-weight: 800;
  }

  .feature-note {
    padding: 10px 16px;
    margin-bottom: 10px;
    background: rgba(255, 255, 255, 0.1);
    color: #ebddd1;
    font-weight: 700;
  }

  .feature-panel h3 {
    font-size: 3rem;
    line-height: 0.98;
    color: #fff4ea;
  }

  .feature-panel p {
    margin: 12px 0;
    font-size: 1rem;
    color: rgba(243, 232, 223, 0.88);
  }

  .feature-panel strong {
    display: block;
    margin-bottom: 20px;
    font-size: 1.1rem;
    color: #ffddbd;
  }

  .feature-tags {
    margin-bottom: 20px;
  }

  .feature-tags span {
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #e7d8cc;
  }

  .feature-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .mini-card {
    text-align: left;
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #f2e7de;
  }

  .mini-card strong {
    display: block;
    margin-bottom: 10px;
    font-family: 'Manrope', sans-serif;
    font-size: 0.98rem;
  }

  .mini-card span {
    color: rgba(234, 221, 211, 0.86);
    line-height: 1.45;
  }

  .content-wrap {
    padding: 18px 24px 110px;
    background: linear-gradient(180deg, rgba(19, 10, 8, 0.96), rgba(16, 9, 7, 1));
  }

  .control-bar,
  .message-card,
  .dish-card,
  .cart-dock {
    background: rgba(61, 41, 34, 0.78);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.18);
    backdrop-filter: blur(12px);
  }

  .control-bar {
    margin: 0 auto 18px;
    max-width: 1800px;
    padding: 22px;
    border-radius: 28px;
  }

  .search-field {
    display: grid;
    gap: 10px;
  }

  .search-field input {
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.1);
    padding: 18px 20px;
    font: inherit;
    color: #fff4ec;
  }

  .search-field input::placeholder {
    color: rgba(244, 231, 220, 0.72);
  }

  .chip-row {
    margin-top: 16px;
  }

  .chip {
    padding: 11px 18px;
    background: rgba(255, 255, 255, 0.08);
    color: #eedfd3;
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .chip.active {
    background: linear-gradient(135deg, #eb6b2d, #bf4316);
    color: #fff;
    border-color: transparent;
  }

  .message-card {
    margin-top: 16px;
    padding: 22px;
    border-radius: 24px;
    text-align: center;
    color: #f1e1d4;
  }

  .error-card {
    color: #ffd5d0;
    background: rgba(145, 44, 39, 0.5);
  }

  .menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
    gap: 18px;
  }

  .dish-card {
    overflow: hidden;
    border-radius: 28px;
  }

  .dish-media {
    height: 220px;
    background: rgba(255, 255, 255, 0.08);
  }

  .dish-body {
    display: grid;
    gap: 14px;
    padding: 22px;
  }

  .dish-topline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .dish-tag {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 9px 14px;
    font-size: 0.78rem;
    font-weight: 800;
    background: rgba(255, 255, 255, 0.1);
    color: #f4e6db;
  }

  .dish-price {
    font-weight: 800;
    color: #ffd2ad;
  }

  .dish-body h3 {
    font-size: 2rem;
    line-height: 0.98;
    color: #fff4ec;
  }

  .dish-body p {
    margin: 0;
    color: rgba(241, 227, 217, 0.86);
    line-height: 1.7;
  }

  .primary-btn,
  .checkout-btn {
    border-radius: 16px;
    padding: 13px 18px;
    font-weight: 800;
    color: #fff;
    background: linear-gradient(135deg, #eb6b2d, #bf4316);
  }

  .qty-box {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.08);
  }

  .qty-box button {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    background: #f07b36;
    color: #fff;
    font-weight: 800;
  }

  .qty-box span {
    min-width: 20px;
    text-align: center;
    font-weight: 800;
    color: #fff4ec;
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
    color: #fff5ed;
  }

  .cart-dock strong {
    display: block;
    margin-bottom: 4px;
  }

  .cart-dock p {
    margin: 0;
    color: rgba(241, 226, 215, 0.8);
  }

  @media (max-width: 1200px) {
    .hero-grid {
      grid-template-columns: 1fr;
    }

    .hero-copy {
      padding-top: 110px;
    }

    .feature-panel {
      margin-top: 0;
    }

    .feature-list {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .hero-wrap,
    .content-wrap {
      padding-left: 12px;
      padding-right: 12px;
    }

    .hero-wrap {
      min-height: auto;
      padding-top: 18px;
    }

    .hero-grid {
      min-height: auto;
      gap: 18px;
    }

    .hero-copy {
      padding-top: 84px;
    }

    .hero-copy h1 {
      font-size: 4rem;
    }

    .hero-copy h2 {
      font-size: 1.9rem;
    }

    .view-btn,
    .explore-btn {
      width: 100%;
    }

    .feature-panel {
      padding: 18px;
      border-radius: 24px;
    }

    .feature-image-wrap {
      height: 220px;
      border-radius: 22px;
    }

    .feature-panel h3,
    .dish-body h3 {
      font-size: 2rem;
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

    .menu-grid {
      grid-template-columns: 1fr;
      gap: 14px;
    }

    .dish-card {
      border-radius: 22px;
    }

    .dish-media {
      height: 180px;
    }

    .dish-body {
      padding: 16px;
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
