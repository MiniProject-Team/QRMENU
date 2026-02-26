import { useState, useEffect } from "react";
import API from "../../api/axios";

const ManageMenu = () => {

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    categoryId: "",
    available: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await API.get("/admin/menu/all");
    setItems(res.data);
  };

  const addItem = async () => {
    await API.post("/admin/menu/add", form);
    fetchItems();
  };

  const deleteItem = async (id) => {
    await API.delete(`/admin/menu/delete/${id}`);
    fetchItems();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Manage Menu</h2>

      <input placeholder="Name"
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        } />

      <input placeholder="Price"
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        } />

      <input placeholder="Category ID"
        onChange={(e) =>
          setForm({ ...form, categoryId: e.target.value })
        } />

      <button onClick={addItem}>Add</button>

      <hr />

      {items.map(item => (
        <div key={item.id}>
          {item.name} — ₹{item.price}
          <button onClick={() => deleteItem(item.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default ManageMenu;