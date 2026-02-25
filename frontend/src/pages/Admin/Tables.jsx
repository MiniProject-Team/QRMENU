import { useState, useEffect } from "react";
import API from "../../api/axios";

const Tables = () => {

  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({
    tableNumber: "",
    active: true,
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    const res = await API.get("/admin/tables/all");
    setTables(res.data);
  };

  const addTable = async () => {
    await API.post("/admin/tables/add", form);
    fetchTables();
  };

  const deleteTable = async (id) => {
    await API.delete(`/admin/tables/delete/${id}`);
    fetchTables();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Tables</h2>

      <input placeholder="Table No"
        onChange={(e) =>
          setForm({ ...form, tableNumber: e.target.value })
        } />

      <button onClick={addTable}>Add</button>

      <hr />

      {tables.map(t => (
        <div key={t.id}>
          Table {t.tableNumber}
          <button onClick={() => deleteTable(t.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Tables;