import { useEffect, useState } from "react";
import API from "../../api/axios";
import OpsLayout from "../../components/ops/OpsLayout";

const fmtCurrency = (value) => `Rs ${Number(value ?? 0).toLocaleString("en-IN")}`;

const ManageMenu = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    available: true,
  });

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      setError("");
      const res = await API.get("/admin/menu/all");
      setItems(res.data || []);
    } catch (err) {
      console.error("Error fetching menu:", err);
      setItems([]);
      setError("Unable to load menu items from the server.");
    }
  };

  const fetchCategories = async () => {
    try {
      setError("");
      const res = await API.get("/admin/categories/all");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
      setError("Unable to load menu categories from the server.");
    }
  };

  const addItem = async () => {
    if (!form.name || !form.price || !form.categoryId) return;

    try {
      setLoading(true);
      setError("");
      await API.post("/admin/menu/add", {
        ...form,
        price: parseFloat(form.price),
        categoryId: parseInt(form.categoryId, 10),
      });
      setForm({ name: "", price: "", description: "", categoryId: "", available: true });
      fetchItems();
    } catch (err) {
      console.error("Error adding menu item:", err);
      setError("Unable to add menu item right now.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (id) => {
    try {
      setError("");
      await API.put(`/admin/menu/toggle/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Error toggling menu item:", err);
      setError("Unable to update menu item availability.");
    }
  };

  const deleteItem = async (id) => {
    try {
      setError("");
      await API.delete(`/admin/menu/delete/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Error deleting menu item:", err);
      setError("Unable to delete menu item right now.");
    }
  };

  const availableCount = items.filter((item) => item.available).length;
  const unavailableCount = items.length - availableCount;

  return (
    <OpsLayout
      title="Menu Management"
      subtitle="Create, organize, and control availability for the dishes visible to customers."
      eyebrow="Admin / Menu"
      role="admin"
      badge={`${items.length} items`}
      actions={
        <button className="ops-primary-btn" onClick={addItem} disabled={loading || !form.name || !form.price || !form.categoryId}>
          {loading ? "Saving..." : "Add item"}
        </button>
      }
    >
      <style>{CSS}</style>

      <section className="admin-grid">
        <article className="panel-card tall">
          <div className="panel-headline">
            <h3>Add or update menu items</h3>
            <p>Use one structured form to keep pricing, descriptions, and categories consistent.</p>
          </div>

          <div className="form-grid">
            <label className="field">
              <span>Item name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Butter Chicken" />
            </label>

            <label className="field">
              <span>Price</span>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="320" />
            </label>

            <label className="field">
              <span>Category</span>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field field-wide">
              <span>Description</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short dish description for guests and staff."
              />
            </label>
          </div>
        </article>

        <article className="stats-panel">
          <div className="stat-card">
            <span>Total menu items</span>
            <strong>{items.length}</strong>
          </div>
          <div className="stat-card">
            <span>Available now</span>
            <strong>{availableCount}</strong>
          </div>
          <div className="stat-card">
            <span>Unavailable</span>
            <strong>{unavailableCount}</strong>
          </div>
        </article>
      </section>

      <section className="panel-card">
        <div className="panel-headline row">
          <div>
            <h3>Current menu catalog</h3>
            <p>Toggle visibility instantly when an item goes out of stock or comes back online.</p>
          </div>
        </div>

        {error ? <div className="error-state">{error}</div> : null}

        {items.length === 0 ? (
          <div className="empty-state">No menu items available yet.</div>
        ) : (
          <div className="menu-grid">
            {items.map((item) => (
              <article key={item.id} className={`menu-card ${item.available ? "" : "muted"}`}>
                <div className="menu-card-head">
                  <div>
                    <span className="menu-tag">{item.category?.name || "Uncategorized"}</span>
                    <h4>{item.name}</h4>
                  </div>
                  <span className={`status-dot ${item.available ? "live" : "off"}`}>{item.available ? "Live" : "Off"}</span>
                </div>

                <p>{item.description || "No description added yet."}</p>

                <div className="menu-card-foot">
                  <strong>{fmtCurrency(item.price)}</strong>
                  <div className="action-row">
                    <button className="secondary-btn" onClick={() => toggleAvailability(item.id)}>
                      {item.available ? "Disable" : "Enable"}
                    </button>
                    <button className="danger-btn-inline" onClick={() => deleteItem(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </OpsLayout>
  );
};

const CSS = `
  .ops-primary-btn,
  .secondary-btn,
  .danger-btn-inline {
    border: none;
    border-radius: 14px;
    padding: 12px 16px;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  .ops-primary-btn {
    background: #17212b;
    color: #fff;
  }

  .admin-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) 280px;
    gap: 18px;
  }

  .panel-card,
  .stats-panel {
    padding: 22px;
    border-radius: 24px;
    background: rgba(255, 252, 246, 0.84);
    border: 1px solid rgba(23, 33, 43, 0.08);
    box-shadow: 0 24px 80px rgba(77, 56, 20, 0.09);
  }

  .tall { min-height: 320px; }

  .panel-headline h3 {
    margin: 0 0 8px;
    font-size: 1.15rem;
  }

  .panel-headline p,
  .menu-card p,
  .empty-state,
  .field span,
  .stat-card span {
    color: #6d7785;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .form-grid {
    margin-top: 18px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .field {
    display: grid;
    gap: 8px;
    font-size: 0.86rem;
    font-weight: 700;
  }

  .field input,
  .field select,
  .field textarea {
    width: 100%;
    border: 1px solid rgba(23, 33, 43, 0.1);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.74);
    padding: 14px 15px;
    font: inherit;
    color: #17212b;
  }

  .field textarea {
    min-height: 110px;
    resize: vertical;
  }

  .field-wide {
    grid-column: 1 / -1;
  }

  .stats-panel {
    display: grid;
    gap: 14px;
  }

  .stat-card {
    padding: 18px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.72);
    border: 1px solid rgba(23, 33, 43, 0.08);
  }

  .stat-card strong {
    display: block;
    margin-top: 8px;
    font-size: 2rem;
    letter-spacing: -0.05em;
  }

  .menu-grid {
    margin-top: 18px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 14px;
  }

  .menu-card {
    padding: 18px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.74);
    border: 1px solid rgba(23, 33, 43, 0.08);
    display: grid;
    gap: 14px;
  }

  .menu-card.muted {
    opacity: 0.72;
  }

  .menu-card-head,
  .menu-card-foot,
  .action-row {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
  }

  .menu-card h4 {
    margin: 8px 0 0;
    font-size: 1.05rem;
  }

  .menu-tag,
  .status-dot {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 999px;
    padding: 6px 10px;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.04em;
  }

  .menu-tag {
    background: rgba(23, 33, 43, 0.06);
    color: #6d7785;
  }

  .status-dot.live {
    background: rgba(53, 197, 138, 0.14);
    color: #1b8f61;
  }

  .status-dot.off {
    background: rgba(239, 107, 115, 0.14);
    color: #b4434b;
  }

  .secondary-btn {
    background: #17212b;
    color: #fff;
  }

  .danger-btn-inline {
    background: #f4ded6;
    color: #9b3e3e;
  }

  .empty-state {
    padding: 28px 0 8px;
    text-align: center;
  }

  .error-state {
    margin-top: 18px;
    padding: 12px 14px;
    border-radius: 14px;
    background: rgba(255, 244, 244, 0.92);
    border: 1px solid rgba(180, 67, 75, 0.18);
    color: #b4434b;
  }

  @media (max-width: 980px) {
    .admin-grid {
      grid-template-columns: 1fr;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default ManageMenu;
