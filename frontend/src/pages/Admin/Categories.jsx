import { useState, useEffect } from "react";
import API from "../../api/axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/admin/categories/all");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      // Demo data
      setCategories([
        { id: 1, name: "Biryani", itemCount: 8 },
        { id: 2, name: "Curry", itemCount: 12 },
        { id: 3, name: "Breads", itemCount: 6 },
        { id: 4, name: "Beverages", itemCount: 10 }
      ]);
    }
  };

  const addCategory = async () => {
    if (!name.trim()) return;
    try {
      setLoading(true);
      await API.post("/admin/categories/add", { name });
      setName("");
      fetchCategories();
    } catch (err) {
      // Demo: add locally
      setCategories([...categories, { id: Date.now(), name, itemCount: 0 }]);
      setName("");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await API.delete(`/admin/categories/delete/${id}`);
      fetchCategories();
    } catch (err) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="categories-page">
      <style>{`
        .categories-page {
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
        .input-group {
          display: flex;
          gap: 12px;
        }
        .form-input {
          flex: 1;
          padding: 14px 20px;
          border-radius: 14px;
          border: 1px solid #222;
          background: #1a1a24;
          color: #fff;
          font-size: 1rem;
        }
        .form-input::placeholder { color: #555; }
        .form-input:focus {
          outline: none;
          border-color: #6366f1;
        }
        .add-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }
        .add-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3); }
        .add-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .category-card {
          background: linear-gradient(145deg, #15151f, #0d0d14);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #222;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .cat-info h3 {
          color: #fff;
          font-size: 1.2rem;
          margin: 0 0 8px;
          font-weight: 600;
        }
        .cat-count {
          color: #666;
          font-size: 0.9rem;
        }
        .cat-count span {
          color: #6366f1;
          font-weight: 600;
        }
        .delete-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1.2rem;
          transition: 0.2s;
        }
        .delete-btn:hover {
          background: #ef4444;
          color: white;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #555;
        }
        .empty-icon { font-size: 3rem; margin-bottom: 16px; }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <p className="page-subtitle">Manage your menu categories</p>
      </div>

      <div className="add-form">
        <h3 className="form-title">Add New Category</h3>
        <div className="input-group">
          <input
            type="text"
            className="form-input"
            placeholder="Category name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCategory()}
          />
          <button className="add-btn" onClick={addCategory} disabled={loading || !name.trim()}>
            {loading ? 'Adding...' : '+ Add'}
          </button>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <p>No categories yet</p>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map(cat => (
            <div key={cat.id} className="category-card">
              <div className="cat-info">
                <h3>{cat.name}</h3>
                <p className="cat-count"><span>{cat.itemCount || 0}</span> items</p>
              </div>
              <button className="delete-btn" onClick={() => deleteCategory(cat.id)}>
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
