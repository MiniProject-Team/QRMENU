import { useEffect, useState } from "react";
import API from "../../api/axios";
import OpsLayout from "../../components/ops/OpsLayout";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setError("");
      const res = await API.get("/admin/categories/all");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
      setError("Unable to load categories from the server.");
    }
  };

  const addCategory = async () => {
    if (!name.trim()) return;
    try {
      setLoading(true);
      setError("");
      await API.post("/admin/categories/add", { name });
      setName("");
      fetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
      setError("Unable to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      setError("");
      await API.delete(`/admin/categories/delete/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Unable to delete category right now.");
    }
  };

  return (
    <OpsLayout
      title="Category Library"
      subtitle="Keep menu sections clean and predictable for guests, staff, and reporting."
      eyebrow="Admin / Categories"
      role="admin"
      badge={`${categories.length} categories`}
      actions={
        <button className="ops-primary-btn" onClick={addCategory} disabled={loading || !name.trim()}>
          {loading ? "Saving..." : "Add category"}
        </button>
      }
    >
      <style>{CSS}</style>

      <section className="panel-card setup-panel">
        <div className="panel-copy">
          <h3>Category setup</h3>
          <p>Use broad, staff-friendly category names so menu filtering and reporting stay readable.</p>
        </div>
        <div className="input-row">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter category name" />
        </div>
      </section>

      {error ? <section className="panel-card error-state">{error}</section> : null}

      <section className="category-grid">
        {categories.length === 0 ? (
          <article className="panel-card empty-state">No categories added yet.</article>
        ) : (
          categories.map((category) => (
            <article key={category.id} className="panel-card category-card">
              <div>
                <span className="category-pill">Category</span>
                <h3>{category.name}</h3>
                <p>{category.itemCount || 0} items currently assigned</p>
              </div>
              <button className="danger-btn-inline" onClick={() => deleteCategory(category.id)}>
                Delete
              </button>
            </article>
          ))
        )}
      </section>
    </OpsLayout>
  );
};

const CSS = `
  .ops-primary-btn,
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

  .danger-btn-inline {
    background: #f4ded6;
    color: #9b3e3e;
  }

  .panel-card {
    padding: 22px;
    border-radius: 24px;
    background: rgba(255, 252, 246, 0.84);
    border: 1px solid rgba(23, 33, 43, 0.08);
    box-shadow: 0 24px 80px rgba(77, 56, 20, 0.09);
  }

  .setup-panel {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 18px;
    align-items: end;
  }

  .panel-copy h3,
  .category-card h3 {
    margin: 0 0 8px;
  }

  .panel-copy p,
  .category-card p {
    margin: 0;
    color: #6d7785;
    line-height: 1.6;
  }

  .input-row input {
    width: 100%;
    border: 1px solid rgba(23, 33, 43, 0.1);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.74);
    padding: 14px 15px;
    font: inherit;
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }

  .category-card {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
  }

  .category-pill {
    display: inline-block;
    margin-bottom: 10px;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(23, 33, 43, 0.06);
    color: #6d7785;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .empty-state {
    text-align: center;
  }

  .error-state {
    color: #b4434b;
    background: rgba(255, 244, 244, 0.92);
    border-color: rgba(180, 67, 75, 0.18);
  }

  @media (max-width: 900px) {
    .setup-panel {
      grid-template-columns: 1fr;
    }
  }
`;

export default Categories;
