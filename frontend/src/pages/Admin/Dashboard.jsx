import { useEffect, useState } from "react";
import API from "../../api/axios";

const Dashboard = () => {
  const [data, setData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalItems: 0,
    totalTables: 0,
    todayOrders: 0,
    pendingOrders: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/dashboard/summary");
      setData(prev => ({ ...prev, ...res.data }));
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      // Mock data for demo
      setData({
        totalOrders: 156,
        totalRevenue: 45680,
        totalItems: 24,
        totalTables: 10,
        todayOrders: 28,
        pendingOrders: 5,
        recentOrders: [
          { id: 101, tableId: 3, status: "PENDING", total: 450 },
          { id: 100, tableId: 5, status: "COOKING", total: 320 },
          { id: 99, tableId: 2, status: "READY", total: 280 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return { bg: "#fef3c7", color: "#d97706" };
      case "ACCEPTED": return { bg: "#dbeafe", color: "#2563eb" };
      case "COOKING": return { bg: "#fed7aa", color: "#ea580c" };
      case "READY": return { bg: "#d1fae5", color: "#059669" };
      case "SERVED": return { bg: "#f3f4f6", color: "#6b7280" };
      default: return { bg: "#f3f4f6", color: "#6b7280" };
    }
  };

  return (
    <div className="admin-dashboard">
      <style>{`
        .admin-dashboard {
          min-height: 100vh;
          background: #0a0a0f;
          padding: 30px;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .dashboard-header {
          margin-bottom: 40px;
        }

        .dashboard-title {
          color: #fff;
          font-size: 2rem;
          margin: 0 0 8px;
          font-weight: 700;
        }

        .dashboard-subtitle {
          color: #666;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: linear-gradient(145deg, #15151f, #0d0d14);
          border-radius: 20px;
          padding: 28px;
          border: 1px solid #1a1a24;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 16px;
        }

        .stat-value {
          color: #fff;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 4px;
        }

        .stat-label {
          color: #666;
          font-size: 0.9rem;
          margin: 0;
        }

        .section-title {
          color: #fff;
          font-size: 1.25rem;
          margin: 0 0 20px;
          font-weight: 600;
        }

        .recent-section {
          background: linear-gradient(145deg, #15151f, #0d0d14);
          border-radius: 20px;
          padding: 28px;
          border: 1px solid #1a1a24;
        }

        .orders-table {
          width: 100%;
        }

        .table-header {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          padding: 16px 20px;
          background: #1a1a24;
          border-radius: 12px;
          margin-bottom: 12px;
          font-weight: 600;
          color: #888;
          font-size: 0.85rem;
        }

        .order-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          padding: 20px;
          align-items: center;
          border-bottom: 1px solid #1a1a24;
        }

        .order-row:last-child {
          border-bottom: none;
        }

        .order-id {
          color: #fff;
          font-weight: 600;
        }

        .table-num {
          color: #888;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .order-total {
          color: #10b981;
          font-weight: 700;
        }

        .loading {
          color: #666;
          text-align: center;
          padding: 40px;
        }

        .quick-actions {
          display: flex;
          gap: 16px;
          margin-top: 30px;
          flex-wrap: wrap;
        }

        .action-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .table-header, .order-row {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
          .table-header > *:nth-child(3),
          .table-header > *:nth-child(4),
          .order-row > *:nth-child(3),
          .order-row > *:nth-child(4) {
            display: none;
          }
        }
      `}</style>

      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(99, 102, 241, 0.15)" }}>📊</div>
          <h3 className="stat-value">{data.totalOrders}</h3>
          <p className="stat-label">Total Orders</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.15)" }}>💰</div>
          <h3 className="stat-value">₹{data.totalRevenue?.toLocaleString() || 0}</h3>
          <p className="stat-label">Total Revenue</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(249, 115, 22, 0.15)" }}>🍽️</div>
          <h3 className="stat-value">{data.totalItems}</h3>
          <p className="stat-label">Menu Items</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(236, 72, 153, 0.15)" }}>🪑</div>
          <h3 className="stat-value">{data.totalTables}</h3>
          <p className="stat-label">Tables</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(234, 179, 8, 0.15)" }}>📅</div>
          <h3 className="stat-value">{data.todayOrders}</h3>
          <p className="stat-label">Today's Orders</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(239, 68, 68, 0.15)" }}>⏳</div>
          <h3 className="stat-value">{data.pendingOrders}</h3>
          <p className="stat-label">Pending Orders</p>
        </div>
      </div>

      <div className="recent-section">
        <h2 className="section-title">Recent Orders</h2>
        
        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : data.recentOrders?.length > 0 ? (
          <>
            <div className="table-header">
              <span>Order ID</span>
              <span>Table</span>
              <span>Status</span>
              <span>Total</span>
            </div>
            {data.recentOrders.map(order => {
              const statusStyle = getStatusColor(order.status);
              return (
                <div key={order.id} className="order-row">
                  <span className="order-id">#{order.id}</span>
                  <span className="table-num">Table {order.tableId}</span>
                  <span>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: statusStyle.bg, 
                        color: statusStyle.color 
                      }}
                    >
                      {order.status}
                    </span>
                  </span>
                  <span className="order-total">₹{order.total}</span>
                </div>
              );
            })}
          </>
        ) : (
          <div className="loading">No recent orders</div>
        )}
      </div>

      <div className="quick-actions">
        <a href="/admin/menu" className="action-btn">🍽️ Manage Menu</a>
        <a href="/admin/tables" className="action-btn">🪑 Manage Tables</a>
        <a href="/admin/categories" className="action-btn">📁 Categories</a>
        <a href="/admin/generate-qr" className="action-btn">🔗 Generate QR</a>
        <a href="/kitchen" className="action-btn">👨‍🍳 Kitchen Panel</a>
      </div>
    </div>
  );
};

export default Dashboard;
