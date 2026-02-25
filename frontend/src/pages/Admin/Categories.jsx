import { useState, useEffect } from "react";
import API from "../../api/axios";

const Categories = () => {

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await API.get("/admin/categories/all");
    setCategories(res.data);
  };

  const addCategory = async () => {
    await API.post("/admin/categories/add", { name });
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    await API.delete(`/admin/categories/delete/${id}`);
    fetchCategories();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Categories</h2>

      <input
        placeholder="Category Name"
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={addCategory}>
        Add
      </button>

      <hr />

      {categories.map(c => (
        <div key={c.id}>
          {c.name}
          <button onClick={() => deleteCategory(c.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Categories;