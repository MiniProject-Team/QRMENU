import { useState, useEffect } from "react";
import API from "../../api/axios";

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await API.get("/admin/tables/all");
      setTables(res.data || []);
    } catch (err) {
      console.error("Error fetching tables:", err);
      // Demo data
      setTables([
        { id: 1, tableNumber: 1, active: true, qrCode: "TABLE-1" },
        { id: 2, tableNumber: 2, active: true, qrCode: "TABLE-2" },
        { id: 3, tableNumber: 3, active: true, qrCode: "TABLE-3" },
        { id: 4, tableNumber: 4, active: false, qrCode: "TABLE-4" },
        { id: 5, tableNumber: 5, active: true, qrCode: "TABLE-5" }
      ]);
    }
  };

  const addTable = async () => {
    if (!tableNumber.trim()) return;
    try {
      setLoading(true);
      await API.post("/admin/tables/add", { tableNumber: parseInt(tableNumber), active: true });
      setTableNumber("");
      fetchTables();
    } catch (err) {
      // Demo: add locally
      setTables([...tables, { 
        id: Date.now(), 
        tableNumber: parseInt(tableNumber), 
        active: true, 
        qrCode: `TABLE-${tableNumber}` 
      }]);
      setTableNumber("");
    } finally {
      setLoading(false);
    }
  };

  const toggleTable = async (id) => {
    try {
      await API.put(`/admin/tables/toggle/${id}`);
      fetchTables();
    } catch (err) {
      setTables(tables.map(t => t.id === id ? { ...t, active: !t.active } : t));
    }
  };

  const deleteTable = async (id) => {
    try {
      await API.delete(`/admin/tables/delete/${id}`);
      fetchTables();
    } catch (err) {
      setTables(tables.filter(t => t.id !== id));
    }
  };

  return (
    <div className="tables-page">
      <style>{`
        .tables-page {
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
          max-width: 200px;
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
        .add-btn:hover { transform: translateY(-2px); }
        
        .stats-row {
          display: flex;
          gap: 20px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .stat-box {
          background: linear-gradient(145deg, #15151f, #0d0d14);
          border-radius: 16px;
          padding: 20px 28px;
          border: 1px solid #222;
        }
        .stat-num { color: #fff; font-size: 2rem; font-weight: 700; }
        .stat-lbl { color: #666; font-size: 0.85rem; }
        
        .tables-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .table-card {
          background: linear-gradient(145deg, #15151f, #0d0d14);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #222;
          position: relative;
          overflow: hidden;
        }
        .table-card.inactive { opacity: 0.5; }
        .table-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }
        .table-card.active::before {
          background: linear-gradient(90deg, #10b981, #059669);
        }
        .table-card.inactive::before {
          background: #333;
        }
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .table-num {
          color: #fff;
          font-size: 2rem;
          font-weight: 700;
        }
        .table-label {
          color: #666;
          font-size: 0.85rem;
        }
        .qr-code {
          background: #1a1a24;
          padding: 8px 14px;
          border-radius: 10px;
          color: #888;
          font-size: 0.8rem;
          font-family: monospace;
        }
        .table-footer {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        .toggle-btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }
        .toggle-btn.active {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        .toggle-btn.inactive {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        .delete-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: none;
          width: 44px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1.2rem;
        }
        .delete-btn:hover { background: #ef4444; color: white; }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #555;
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Tables</h1>
        <p className="page-subtitle">Manage restaurant tables and QR codes</p>
      </div>

      <div className="add-form">
        <h3 className="form-title">Add New Table</h3>
        <div className="input-group">
          <input
            type="number"
            className="form-input"
            placeholder="Table number..."
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTable()}
          />
          <button className="add-btn" onClick={addTable} disabled={loading || !tableNumber.trim()}>
            {loading ? 'Adding...' : '+ Add Table'}
          </button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-num">{tables.length}</div>
          <div className="stat-lbl">Total Tables</div>
        </div>
        <div className="stat-box">
          <div className="stat-num" style={{ color: '#10b981' }}>{tables.filter(t => t.active).length}</div>
          <div className="stat-lbl">Active</div>
        </div>
        <div className="stat-box">
          <div className="stat-num" style={{ color: '#ef4444' }}>{tables.filter(t => !t.active).length}</div>
          <div className="stat-lbl">Inactive</div>
        </div>
      </div>

      {tables.length === 0 ? (
        <div className="empty-state">
          <p>No tables yet. Add your first table above.</p>
        </div>
      ) : (
        <div className="tables-grid">
          {tables.map(table => (
            <div key={table.id} className={`table-card ${table.active ? 'active' : 'inactive'}`}>
              <div className="table-header">
                <div>
                  <div className="table-num">{table.tableNumber}</div>
                  <div className="table-label">Table</div>
                </div>
                <div className="qr-code">{table.qrCode || `TABLE-${table.tableNumber}`}</div>
              </div>
              <div className="table-footer">
                <button 
                  className={`toggle-btn ${table.active ? 'active' : 'inactive'}`}
                  onClick={() => toggleTable(table.id)}
                >
                  {table.active ? 'Deactivate' : 'Activate'}
                </button>
                <button className="delete-btn" onClick={() => deleteTable(table.id)}>
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tables;
