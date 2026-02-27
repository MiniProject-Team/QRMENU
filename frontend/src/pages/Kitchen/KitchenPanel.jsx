import { useEffect, useState } from "react";
import API from "../../api/axios";

const KitchenPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/kitchen/orders/active");
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, endpoint) => {
    try {
      await API.put(`/kitchen/orders/${endpoint}/${id}`);
      fetchOrders();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const parseItem = (item) => {
    if (typeof item !== "string") {
      return { name: String(item ?? ""), qty: "" };
    }
    const match = item.match(/^(.*)\s+x\s+(\d+)$/i);
    if (match) {
      return { name: match[1].trim(), qty: match[2] };
    }
    return { name: item, qty: "" };
  };

  // Status flow: PENDING → ACCEPTED → COOKING → READY → SERVED
  // Display as: Pending → In Progress → Complete
  
  const getStatusDisplay = (status) => {
    switch (status) {
      case "PENDING":
      case "PLACED":
        return { label: "Pending", color: "#f59e0b", icon: "⏳", step: 0 };
      case "ACCEPTED": 
        return { label: "Accepted", color: "#8b5cf6", icon: "✓", step: 1 };
      case "PREPARING": 
        return { label: "In Progress", color: "#f97316", icon: "👨‍🍳", step: 2 };
      case "READY": 
        return { label: "Ready", color: "#10b981", icon: "🍽️", step: 3 };
      case "SERVED": 
        return { label: "Completed", color: "#6b7280", icon: "✓", step: 4 };
      default: 
        return { label: status, color: "#6b7280", icon: "❓", step: -1 };
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === "active") return order.status !== "SERVED";
    if (activeTab === "completed") return order.status === "SERVED";
    return true;
  });

  const getActionButton = (order) => {
    const status = order.status;
    
    // Pending → Click to Accept
    if (status === "PENDING" || status === "PLACED") {
      return (
        <button 
          className="action-btn btn-accept"
          onClick={() => updateStatus(order.orderId, "accept")}
        >
          ✓ Accept Order
        </button>
      );
    }
    
    // Accepted → Click to Start Cooking (In Progress)
    if (status === "ACCEPTED") {
      return (
        <button 
          className="action-btn btn-progress"
          onClick={() => updateStatus(order.orderId, "cooking")}
        >
          👨‍🍳 Start Cooking
        </button>
      );
    }
    
    // Cooking (In Progress) → Click when Ready
    if (status === "PREPARING") {
      return (
        <button 
          className="action-btn btn-ready"
          onClick={() => updateStatus(order.orderId, "ready")}
        >
          ✓ Mark Ready
        </button>
      );
    }
    
    // Ready → Click when Served (Complete)
    if (status === "READY") {
      return (
        <button 
          className="action-btn btn-complete"
          onClick={() => updateStatus(order.orderId, "served")}
        >
          ✓ Complete Order
        </button>
      );
    }
    
    return null;
  };

  return (
    <div className="kitchen-container">
      <style>{`
        .kitchen-container {
          min-height: 100vh;
          background: #0a0a0f;
          padding: 20px;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .kitchen-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .kitchen-header h1 {
          color: #fff;
          font-size: 2rem;
          margin: 0 0 8px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .kitchen-header p {
          color: #888;
          margin: 0;
          font-size: 0.95rem;
        }

        .kitchen-stats {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .stat-card {
          background: linear-gradient(145deg, #15151f 0%, #0d0d14 100%);
          padding: 18px 28px;
          border-radius: 16px;
          text-align: center;
          min-width: 100px;
          border: 1px solid #222;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .stat-number.pending { color: #f59e0b; }
        .stat-number.progress { color: #f97316; }
        .stat-number.ready { color: #10b981; }
        .stat-number.completed { color: #6b7280; }

        .stat-label {
          color: #666;
          margin: 5px 0 0;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tab-buttons {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 25px;
        }

        .tab-btn {
          padding: 10px 24px;
          border: none;
          border-radius: 12px;
          background: #15151f;
          color: #888;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s;
          border: 1px solid #222;
        }

        .tab-btn:hover {
          background: #1a1a28;
          color: #fff;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border-color: transparent;
        }

        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .order-card {
          background: linear-gradient(145deg, #15151f 0%, #0d0d14 100%);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #222;
          transition: all 0.2s;
        }

        .order-card:hover {
          border-color: #333;
          transform: translateY(-2px);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .order-id {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .order-table {
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
          padding: 6px 14px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.85rem;
        }

        /* Progress Steps */
        .progress-steps {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
          position: relative;
        }

        .progress-steps::before {
          content: '';
          position: absolute;
          top: 14px;
          left: 10%;
          right: 10%;
          height: 3px;
          background: #222;
          z-index: 0;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 1;
        }

        .step-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #15151f;
          border: 3px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          margin-bottom: 6px;
          transition: all 0.3s;
        }

        .step-circle.active {
          border-color: #6366f1;
          background: #6366f1;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
        }

        .step-circle.completed {
          border-color: #10b981;
          background: #10b981;
        }

        .step-label {
          font-size: 0.7rem;
          color: #555;
          text-transform: uppercase;
        }

        .step-label.active {
          color: #6366f1;
        }

        /* Status Badge */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 16px;
        }

        .items-list {
          margin: 16px 0;
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #1a1a24;
        }

        .item-row:last-child {
          border-bottom: none;
        }

        .item-name {
          color: #ccc;
          font-weight: 500;
        }

        .item-qty {
          color: #666;
          background: #1a1a24;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.8rem;
        }

        .action-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s;
          margin-top: 8px;
        }

        .btn-accept {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
        }

        .btn-accept:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
        }

        .btn-progress {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
        }

        .btn-progress:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(249, 115, 22, 0.4);
        }

        .btn-ready {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .btn-ready:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
        }

        .btn-complete {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
        }

        .btn-complete:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #555;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: #888;
          margin: 0 0 8px;
        }

        .empty-state p {
          margin: 0;
          font-size: 0.9rem;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 40vh;
          color: #666;
        }

        @media (max-width: 768px) {
          .orders-grid {
            grid-template-columns: 1fr;
          }
          
          .kitchen-stats {
            gap: 12px;
          }
          
          .stat-card {
            padding: 14px 20px;
            min-width: 80px;
          }
        }
      `}</style>

      <div className="kitchen-header">
        <h1>👨‍🍳 Kitchen Panel</h1>
        <p>Track and manage orders in real-time</p>
      </div>

      <div className="kitchen-stats">
        <div className="stat-card">
          <div className="stat-number pending">{orders.filter(o => o.status === "PENDING").length}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number progress">{orders.filter(o => o.status === "PREPARING").length}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number ready">{orders.filter(o => o.status === "READY").length}</div>
          <div className="stat-label">Ready</div>
        </div>
      </div>

      <div className="tab-buttons">
        <button 
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Orders
        </button>
        <button 
          className={`tab-btn ${activeTab === "active" ? "active" : ""}`}
          onClick={() => setActiveTab("active")}
        >
          Active
        </button>
        <button 
          className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Orders Yet</h3>
          <p>New orders will appear here</p>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map(order => {
            const statusInfo = getStatusDisplay(order.status);
            return (
              <div key={order.orderId} className="order-card">
                <div className="order-header">
                  <h3 className="order-id">Order #{order.orderId}</h3>
                  <div className="order-table">Table {order.tableNumber}</div>
                </div>

                {/* Progress Steps */}
                <div className="progress-steps">
                  <div className="step">
                    <div className={`step-circle ${statusInfo.step >= 0 ? (statusInfo.step > 0 ? 'completed' : 'active') : ''}`}>
                      {statusInfo.step > 0 ? '✓' : '1'}
                    </div>
                    <span className={`step-label ${statusInfo.step >= 0 ? 'active' : ''}`}>Pending</span>
                  </div>
                  <div className="step">
                    <div className={`step-circle ${statusInfo.step >= 1 ? (statusInfo.step > 1 ? 'completed' : 'active') : ''}`}>
                      {statusInfo.step > 1 ? '✓' : '2'}
                    </div>
                    <span className={`step-label ${statusInfo.step >= 1 ? 'active' : ''}`}>Progress</span>
                  </div>
                  <div className="step">
                    <div className={`step-circle ${statusInfo.step >= 2 ? (statusInfo.step > 2 ? 'completed' : 'active') : ''}`}>
                      {statusInfo.step > 2 ? '✓' : '3'}
                    </div>
                    <span className={`step-label ${statusInfo.step >= 2 ? 'active' : ''}`}>Complete</span>
                  </div>
                </div>

                <div 
                  className="status-badge"
                  style={{ 
                    backgroundColor: `${statusInfo.color}15`, 
                    color: statusInfo.color 
                  }}
                >
                  <span>{statusInfo.icon}</span>
                  {statusInfo.label}
                </div>

                <div className="items-list">
                  {(order.items || []).map((item, i) => {
                    const parsed = parseItem(item);
                    return (
                      <div key={i} className="item-row">
                        <span className="item-name">{parsed.name}</span>
                        {parsed.qty ? <span className="item-qty">x{parsed.qty}</span> : null}
                      </div>
                    );
                  })}
                </div>

                {getActionButton(order)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KitchenPanel;
