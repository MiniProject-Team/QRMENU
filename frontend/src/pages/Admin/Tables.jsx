import { useEffect, useState } from "react";
import API from "../../api/axios";
import OpsLayout from "../../components/ops/OpsLayout";

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setError("");
      const res = await API.get("/admin/tables/all");
      setTables(res.data || []);
    } catch (err) {
      console.error("Error fetching tables:", err);
      setTables([]);
      setError("Unable to load tables from the server.");
    }
  };

  const addTable = async () => {
    if (!tableNumber.trim()) return;
    try {
      setLoading(true);
      setError("");
      await API.post("/admin/tables/add", { tableNumber: parseInt(tableNumber, 10), active: true });
      setTableNumber("");
      fetchTables();
    } catch (err) {
      console.error("Error adding table:", err);
      setError("Unable to add table right now.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTable = async (id) => {
    try {
      setError("");
      await API.put(`/admin/tables/toggle/${id}`);
      fetchTables();
    } catch (err) {
      console.error("Error toggling table:", err);
      setError("Unable to update table status.");
    }
  };

  const deleteTable = async (id) => {
    try {
      setError("");
      await API.delete(`/admin/tables/delete/${id}`);
      fetchTables();
    } catch (err) {
      console.error("Error deleting table:", err);
      setError("Unable to delete table right now.");
    }
  };

  const activeTables = tables.filter((table) => table.active).length;

  return (
    <OpsLayout
      title="Table Management"
      subtitle="Control table availability and keep your QR dining floor organized."
      eyebrow="Admin / Tables"
      role="admin"
      badge={`${tables.length} tables`}
      actions={
        <button className="ops-primary-btn" onClick={addTable} disabled={loading || !tableNumber.trim()}>
          {loading ? "Adding..." : "Add table"}
        </button>
      }
    >
      <style>{CSS}</style>

      <section className="table-top">
        <article className="panel-card composer">
          <h3>Add new table</h3>
          <p>Provision a new dining table and make it immediately available for QR orders.</p>
          <input
            type="number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Table number"
          />
        </article>

        <article className="stats-panel">
          <div className="stat-card">
            <span>Total tables</span>
            <strong>{tables.length}</strong>
          </div>
          <div className="stat-card">
            <span>Active now</span>
            <strong>{activeTables}</strong>
          </div>
          <div className="stat-card">
            <span>Inactive</span>
            <strong>{tables.length - activeTables}</strong>
          </div>
        </article>
      </section>

      <section className="table-grid">
        {error ? <article className="panel-card error-state">{error}</article> : null}
        {tables.length === 0 ? (
          <article className="panel-card empty-state">No tables created yet.</article>
        ) : (
          tables.map((table) => (
            <article key={table.id} className="panel-card table-card">
              <div className="table-card-head">
                <div>
                  <span className="table-chip">Table</span>
                  <h3>{table.tableNumber}</h3>
                </div>
                <span className={`table-state ${table.active ? "active" : "inactive"}`}>
                  {table.active ? "Active" : "Inactive"}
                </span>
              </div>

              <p>QR label: TABLE-{table.tableNumber}</p>

              <div className="action-row">
                <button className="secondary-btn" onClick={() => toggleTable(table.id)}>
                  {table.active ? "Deactivate" : "Activate"}
                </button>
                <button className="danger-btn-inline" onClick={() => deleteTable(table.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))
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

  .ops-primary-btn,
  .secondary-btn {
    background: #17212b;
    color: #fff;
  }

  .danger-btn-inline {
    background: #f4ded6;
    color: #9b3e3e;
  }

  .table-top {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) 320px;
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

  .composer h3,
  .table-card h3 {
    margin: 0 0 8px;
  }

  .composer p,
  .table-card p,
  .stat-card span,
  .empty-state {
    color: #6d7785;
  }

  .composer input {
    width: 100%;
    margin-top: 16px;
    border: 1px solid rgba(23, 33, 43, 0.1);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.74);
    padding: 14px 15px;
    font: inherit;
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

  .table-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .table-card {
    display: grid;
    gap: 16px;
  }

  .table-card-head,
  .action-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .table-chip,
  .table-state {
    display: inline-flex;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .table-chip {
    background: rgba(23, 33, 43, 0.06);
    color: #6d7785;
  }

  .table-state.active {
    background: rgba(53, 197, 138, 0.14);
    color: #1b8f61;
  }

  .table-state.inactive {
    background: rgba(239, 107, 115, 0.14);
    color: #b4434b;
  }

  .empty-state {
    text-align: center;
  }

  .error-state {
    color: #b4434b;
    background: rgba(255, 244, 244, 0.92);
    border-color: rgba(180, 67, 75, 0.18);
  }

  @media (max-width: 980px) {
    .table-top {
      grid-template-columns: 1fr;
    }
  }
`;

export default Tables;
