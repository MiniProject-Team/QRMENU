import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

const Menu = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMenu();
  }, [tableId]);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/menu");
      setItems(res.data);

      const uniqueCategories = [
        ...new Set(
          res.data
            .map(item =>
              typeof item.category === "object"
                ? item.category.name
                : item.category
            )
            .filter(Boolean)
        )
      ];

      setCategories(["all", ...uniqueCategories]);
    } catch (err) {
      console.error("Error fetching menu:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existing = cart.find(i => i.id === itemId);
    if (existing && existing.quantity > 1) {
      setCart(cart.map(i =>
        i.id === itemId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      ));
    } else {
      setCart(cart.filter(i => i.id !== itemId));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const filteredItems = items.filter(item => {
    const itemCategory = typeof item.category === "object" ? item.category.name : item.category;
    const matchesCategory = activeCategory === "all" || itemCategory === activeCategory;
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="menu-page">
      <style>{`
        .menu-page {
          min-height: 100vh;
          background: #0a0a0f;
          font-family: 'Inter', -apple-system, sans-serif;
          padding-bottom: 100px;
        }

        .menu-hero {
          background: linear-gradient(135deg, #1e1e2f 0%, #0d0d14 100%);
          padding: 40px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .menu-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 50%);
          animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero-title {
          color: #fff;
          font-size: 2.5rem;
          margin: 0 0 8px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .hero-subtitle {
          color: #888;
          margin: 0;
          font-size: 1rem;
        }

        .table-tag {
          display: inline-block;
          background: rgba(99, 102, 241, 0.2);
          color: #818cf8;
          padding: 8px 20px;
          border-radius: 20px;
          margin-top: 16px;
          font-weight: 600;
        }

        .search-container {
          padding: 20px;
          background: #0a0a0f;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .search-box {
          max-width: 500px;
          margin: 0 auto;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 16px 24px 16px 50px;
          border-radius: 16px;
          border: 1px solid #222;
          background: #15151f;
          color: #fff;
          font-size: 1rem;
        }

        .search-input::placeholder { color: #555; }
        .search-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #555;
          font-size: 1.2rem;
        }

        .category-scroll {
          display: flex;
          gap: 10px;
          padding: 0 20px 20px;
          overflow-x: auto;
          background: #0a0a0f;
        }

        .category-chip {
          padding: 10px 20px;
          border-radius: 24px;
          border: none;
          background: #15151f;
          color: #888;
          cursor: pointer;
          white-space: nowrap;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s;
          border: 1px solid #222;
        }

        .category-chip:hover {
          background: #1a1a28;
          color: #fff;
        }

        .category-chip.active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border-color: transparent;
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .menu-card {
          background: linear-gradient(145deg, #15151f, #0d0d14);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #1a1a24;
          transition: all 0.3s;
        }

        .menu-card:hover {
          transform: translateY(-4px);
          border-color: #2a2a3a;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .card-image {
          height: 160px;
          background: linear-gradient(135deg, #1e1e2f, #15151f);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          position: relative;
          overflow: hidden;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-content {
          padding: 20px;
        }

        .card-name {
          color: #fff;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 0 8px;
        }

        .card-desc {
          color: #666;
          font-size: 0.85rem;
          margin: 0 0 16px;
          line-height: 1.5;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-price {
          color: #10b981;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .add-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          color: white;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        }

        .qty-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #1a1a28;
          padding: 6px 12px;
          border-radius: 12px;
        }

        .qty-btn {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: none;
          background: #252532;
          color: #fff;
          cursor: pointer;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }

        .qty-btn:hover { background: #6366f1; }
        .qty-num { color: #fff; font-weight: 600; min-width: 20px; text-align: center; }

        .cart-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(145deg, #15151f, #0d0d14);
          padding: 16px 20px;
          border-top: 1px solid #222;
          z-index: 200;
        }

        .cart-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cart-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .cart-count {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .cart-total {
          color: #fff;
          font-weight: 700;
        }

        .cart-total span {
          color: #10b981;
          margin-left: 8px;
        }

        .view-cart-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          color: white;
          padding: 14px 28px;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-cart-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
        }

        .loading {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .empty {
          text-align: center;
          padding: 60px 20px;
          color: #555;
        }

        .empty-icon { font-size: 3rem; margin-bottom: 16px; }

        @media (max-width: 640px) {
          .hero-title { font-size: 1.8rem; }
          .menu-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="menu-hero">
        <div className="hero-content">
          <h1 className="hero-title">Our Menu</h1>
          <p className="hero-subtitle">Fresh & delicious food awaits</p>
          <div className="table-tag">Table {tableId}</div>
        </div>
      </div>

      <div className="search-container">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="category-scroll">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-chip ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === "all" ? "🍴 All" : cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading menu...</div>
      ) : filteredItems.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🍽️</div>
          <p>No dishes found</p>
        </div>
      ) : (
        <div className="menu-grid">
          {filteredItems.map(item => {
            const cartItem = cart.find(c => c.id === item.id);
            return (
              <div key={item.id} className="menu-card">
                <div className="card-image">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    "🍕"
                  )}
                </div>
                <div className="card-content">
                  <h3 className="card-name">{item.name}</h3>
                  <p className="card-desc">{item.description || "Delicious dish"}</p>
                  <div className="card-footer">
                    <span className="card-price">₹{item.price}</span>
                    {cartItem ? (
                      <div className="qty-box">
                        <button className="qty-btn" onClick={() => removeFromCart(item.id)}>−</button>
                        <span className="qty-num">{cartItem.quantity}</span>
                        <button className="qty-btn" onClick={() => addToCart(item)}>+</button>
                      </div>
                    ) : (
                      <button className="add-btn" onClick={() => addToCart(item)}>
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cart.length > 0 && (
        <div className="cart-bar">
          <div className="cart-content">
            <div className="cart-info">
              <div className="cart-count">{cart.reduce((s, i) => s + i.quantity, 0)}</div>
              <div className="cart-total">
                Total:<span>₹{getCartTotal()}</span>
              </div>
            </div>
            <button className="view-cart-btn" onClick={() => navigate("/cart", { state: { cart, tableId } })}>
              View Cart →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
