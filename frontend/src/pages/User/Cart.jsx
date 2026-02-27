import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useState, useEffect } from "react";

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialCart = location.state?.cart || [];
  const tableId = location.state?.tableId;
  
  const [cart, setCart] = useState(initialCart);
  const [isPlacing, setIsPlacing] = useState(false);

  // Update cart if navigating back from menu
  useEffect(() => {
    if (location.state?.cart) {
      setCart(location.state.cart);
    }
  }, [location.state?.cart]);

  const updateQuantity = (itemId, change) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.id === itemId) {
          const newQty = item.quantity + change;
          if (newQty < 1) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="empty-cart">
        <style>{`
          .empty-cart {
            min-height: 100vh;
            background: #0a0a0f;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', sans-serif;
          }
          .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
          .empty-title { color: #fff; font-size: 1.5rem; margin-bottom: 0.5rem; }
          .empty-subtitle { color: #666; margin-bottom: 2rem; }
          .browse-btn {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            border: none;
            padding: 14px 32px;
            border-radius: 14px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
          }
        `}</style>
        <div className="empty-icon">🛒</div>
        <h2 className="empty-title">Your cart is empty</h2>
        <p className="empty-subtitle">Add items from the menu</p>
        <button className="browse-btn" onClick={() => navigate(`/menu/${tableId || 1}`)}>
          Browse Menu
        </button>
      </div>
    );
  }

  const getTotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const getTax = () => getTotal() * 0.1;
  const getGrandTotal = () => getTotal() + getTax();

  const placeOrder = async () => {
    try {
      setIsPlacing(true);
      const payload = {
        tableId: tableId,
        items: cart.map(i => ({ itemId: i.id, quantity: i.quantity }))
      };
      const res = await API.post("/user/orders/place", payload);
      navigate(`/order-status/${res.data.id}`);
    } catch (err) {
      console.error("Order failed:", err);
      alert("Failed to place order");
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="cart-page">
      <style>{`
        .cart-page {
          min-height: 100vh;
          background: #0a0a0f;
          padding: 20px;
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .cart-header {
          max-width: 600px;
          margin: 0 auto 24px;
        }
        .back-btn {
          background: none;
          border: none;
          color: #6366f1;
          cursor: pointer;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 16px;
        }
        .cart-title {
          color: #fff;
          font-size: 1.75rem;
          margin: 0 0 8px;
          font-weight: 700;
        }
        .table-badge {
          display: inline-block;
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
          padding: 6px 14px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .cart-card {
          max-width: 600px;
          margin: 0 auto;
          background: linear-gradient(145deg, #15151f, #0d0d14);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #222;
        }
        .cart-item {
          display: flex;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #1a1a24;
        }
        .cart-item:last-child { border-bottom: none; }
        .item-img {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: #1a1a24;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-right: 16px;
        }
        .item-details { flex: 1; }
        .item-name {
          color: #fff;
          font-weight: 600;
          margin: 0 0 4px;
        }
        .item-price {
          color: #666;
          font-size: 0.9rem;
        }
        .qty-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-right: 16px;
        }
        .qty-btn {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          border: none;
          background: #1a1a24;
          color: #fff;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }
        .qty-btn:hover { background: #252532; }
        .qty-btn.minus:hover { background: #ef4444; }
        .qty-value {
          color: #fff;
          font-weight: 600;
          min-width: 24px;
          text-align: center;
        }
        .item-total {
          color: #10b981;
          font-weight: 700;
          min-width: 70px;
          text-align: right;
        }
        .remove-btn {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 8px;
        }
        .remove-btn:hover { color: #ef4444; }
        .summary {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #222;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          color: #888;
          margin-bottom: 12px;
        }
        .summary-row.total {
          color: #fff;
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #222;
        }
        .summary-row.total .amount { color: #10b981; }
        .place-btn {
          width: 100%;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 16px;
          border-radius: 14px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 24px;
          transition: 0.2s;
        }
        .place-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
        }
        .place-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div className="cart-header">
        <button className="back-btn" onClick={() => navigate(`/menu/${tableId || 1}`)}>
          ← Back to Menu
        </button>
        <h1 className="cart-title">Your Cart</h1>
        <span className="table-badge">Table {tableId}</span>
      </div>

      <div className="cart-card">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-img">
              {item.imageUrl ? <img src={item.imageUrl} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:12}}/> : '🍽️'}
            </div>
            <div className="item-details">
              <p className="item-name">{item.name}</p>
              <p className="item-price">₹{item.price} each</p>
            </div>
            <div className="qty-controls">
              <button className="qty-btn minus" onClick={() => updateQuantity(item.id, -1)}>−</button>
              <span className="qty-value">{item.quantity}</span>
              <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
            </div>
            <span className="item-total">₹{item.price * item.quantity}</span>
            <button className="remove-btn" onClick={() => removeItem(item.id)}>×</button>
          </div>
        ))}

        <div className="summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{getTotal()}</span>
          </div>
          <div className="summary-row">
            <span>Tax (10%)</span>
            <span>₹{getTax().toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span className="amount">₹{getGrandTotal().toFixed(2)}</span>
          </div>
        </div>

        <button className="place-btn" onClick={placeOrder} disabled={isPlacing}>
          {isPlacing ? "Placing Order..." : "Place Order ✓"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
