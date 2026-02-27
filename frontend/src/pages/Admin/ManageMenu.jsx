import { useState, useEffect } from "react";
import API from "../../api/axios";

const ManageMenu = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    available: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get("/admin/menu/all");
      setItems(res.data || []);
    } catch (err) {
      console.error("Error fetching menu:", err);
      // Demo data
      setItems([
        { id: 1, name: "Chicken Biryani", price: 250, category: { name: "Biryani" }, available: true },
        { id: 2, name: "Paneer Tikka", price: 180, category: { name: "Curry" }, available: true },
        { id: 3, name: "Butter Roti", price: 25, category: { name: "Breads" }, available: true },
        { id: 4, name: "Masala Chai", price: 30, category: { name: "Beverages" }, available: false }
      ]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/admin/categories/all");
      setCategories(res.data || []);
    } catch (err) {
      setCategories([
        { id: 1, name: "Biryani" },
        { id: 2, name: "Curry" },
        { id: 3, name: "Breads" },
        { id: 4, name: "Beverages" }
      ]);
    }
  };

  const addItem = async () => {
    if (!form.name || !form.price) return;
    try {
      setLoading(true);
      await API.post("/admin/menu/add", {
        ...form,
        price: parseFloat(form.price),
        categoryId: parseInt(form.categoryId)
      });
      setForm({ name: "", price: "", description: "", categoryId: "", available: true });
      fetchItems();
    } catch (err) {
      // Demo: add locally
      const cat = categories.find(c => c.id === parseInt(form.categoryId));
      setItems([...items, { 
        id: Date.now(), 
        name: form.name, 
        price: parseFloat(form.price),
        description: form.description,
        category: cat || { name: "Uncategorized" },
        available: true 
      }]);
      setForm({ name: "", price: "", description: "", categoryId: "", available: true });
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (id) => {
    try {
      await API.put(`/admin/menu/toggle/${id}`);
      fetchItems();
    } catch (err) {
      setItems(items.map(item => item.id === id ? { ...item, available: !item.available } : item));
    }
  };

  const deleteItem = async (id) => {
    try {
      await API.delete(`/admin/menu/delete/${id}`);
      fetchItems();
    } catch (err) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="menu-page">
      <style>{`
        .menu-page {
          min-height: 100vh;
          background: #0a0a0f;
          padding: 30px;
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .page-header {
          margin-bottom: 32px;
        }
        .page-title {
          color: #fff;
          font-size: 1.75rem;
          margin: 0 0 8px;
          font-weight: 700;
        }
        .page-subtitle {
          color: #666;
          margin: 0;
        }
        
        .add-form {
          background: linear-gradient(145deg, #15151f, #0d0d14);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 32px;
          border: 1px solid #222;
        }
        .form-title {
          color: #fff;
          font-size: 1.1rem;
          margin: 0 0 16px;
          font-weight: 600;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }
        .form-input {
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #222;
          background: #1a1a24;
          color: #fff;
          font-size: 0.95rem;
        }
        .form-input::placeholder { color: #555; }
        .form-input:focus {
          outline: none;
          border-color: #6366f1;
        }
        .form-select {
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #222;
          background: #1a1a24;
          color: #fff;
          font-size: 0.95rem;
        }
        .add-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }
        .add-btn:hover { transform: translateY(-2px); }
        
        .menu-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .stat-chip {
          background: linear-gradient(145deg, #15151f, #0d0d14);
          padding: 12px 20px;
          border-radius: 12px;
          border: 1px solid #222;
          color: #888;
        }
        .stat-chip span { color: #fff; font-weight: 600; }
        
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .menu-card {
          background: linear-gradient(145deg, #15151f, #0d0d14);
          border-radius: 20px;
          padding: 20px;
          border: 1px solid #222;
          display: flex;
          gap: 16px;
        }
        .menu-card.unavailable { opacity: 0.5; }
        .menu-img {
          width: 70px;
          height: 70px;
          border-radius: 14px;
          background: #1a1a24;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          flex-shrink: 0;
        }
        .menu-details { flex: 1; }
        .menu-name {
          color: #fff;
          font-weight: 600;
          margin: 0 0 6px;
        }
        .menu-cat {
          color: #6366f1;
          font-size: 0.85rem;
          margin: 0 0 8px;
        }
        .menu-price {
          color: #10b981;
          font-weight: 700;
          font-size: 1.1rem;
        }
        .menu-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }
        .action-btn {
          padding: 8px 14px;
          border: none;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }
        .toggle-btn {
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
        }
        .toggle-btn:hover { background: #6366f1; color: white; }
        .delete-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        .delete-btn:hover { background: #ef4444; color: white; }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #555;
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Manage Menu</h1>
        <p className="page-subtitle">Add, edit, or remove menu items</p>
      </div>

      <div className="add-form">
        <h3 className="form-title">Add New Item</h3>
        <div className="form-grid">
          <input
            type="text"
            className="form-input"
            placeholder="Item name..."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="number"
            className="form-input"
            placeholder="Price (₹)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Description..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            className="form-select"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button className="add-btn" onClick={addItem} disabled={loading || !form.name || !form.price}>
            {loading ? 'Adding...' : '+ Add Item'}
          </button>
        </div>
      </div>

      <div className="menu-stats">
        <div className="stat-chip">Total: <span>{items.length}</span></div>
        <div className="stat-chip">Available: <span style={{ color: '#10b981' }}>{items.filter(i => i.available).length}</span></div>
        <div className="stat-chip">Unavailable: <span style={{ color: '#ef4444' }}>{items.filter(i => !i.available).length}</span></div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>No menu items yet</p>
        </div>
      ) : (
        <div className="menu-grid">
          {items.map(item => (
            <div key={item.id} className={`menu-card ${!item.available ? 'unavailable' : ''}`}>
              <div className="menu-img">🍽️</div>
              <div className="menu-details">
                <h3 className="menu-name">{item.name}</h3>
                <p className="menu-cat">{item.category?.name || "Uncategorized"}</p>
                <p className="menu-price">₹{item.price}</p>
                <div className="menu-actions">
                  <button className="action-btn toggle-btn" onClick={() => toggleAvailability(item.id)}>
                    {item.available ? 'Disable' : 'Enable'}
                  </button>
                  <button className="action-btn delete-btn" onClick={() => deleteItem(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMenu;
