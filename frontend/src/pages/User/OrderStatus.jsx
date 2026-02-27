import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

const OrderStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 3000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await API.get(`/user/orders/track/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusProgress = (status) => {
    const steps = { "PENDING": 0, "ACCEPTED": 1, "COOKING": 2, "READY": 3, "SERVED": 4 };
    return steps[status] || 0;
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "PENDING": 
        return { label: "Order Placed", color: "#f59e0b", icon: "⏳", message: "Waiting for kitchen confirmation" };
      case "ACCEPTED": 
        return { label: "Confirmed", color: "#8b5cf6", icon: "✓", message: "Your order has been confirmed" };
      case "COOKING": 
        return { label: "Preparing", color: "#f97316", icon: "👨‍🍳", message: "Your food is being prepared" };
      case "READY": 
        return { label: "Ready", color: "#10b981", icon: "🍽️", message: "Your food is ready to serve!" };
      case "SERVED": 
        return { label: "Completed", color: "#6b7280", icon: "✓", message: "Enjoy your meal!" };
      default: 
        return { label: status, color: "#6b7280", icon: "❓", message: "Processing" };
    }
  };

  if (loading) {
    return (
      <div className="status-loading">
        <style>{`
          .status-loading {
            min-height: 100vh;
            background: #0a0a0f;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', sans-serif;
          }
          .spinner {
            width: 48px;
            height: 48px;
            border: 4px solid #222;
            border-top-color: #6366f1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          .loading-text { color: #666; margin-top: 16px; }
        `}</style>
        <div className="spinner"></div>
        <p className="loading-text">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="error-page">
        <style>{`
          .error-page {
            min-height: 100vh;
            background: #0a0a0f;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', sans-serif;
          }
          .error-icon { font-size: 4rem; margin-bottom: 16px; }
          .error-title { color: #fff; font-size: 1.5rem; margin-bottom: 24px; }
          .back-btn {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            border: none;
            padding: 14px 32px;
            border-radius: 14px;
            font-weight: 600;
            cursor: pointer;
          }
        `}</style>
        <div className="error-icon">😕</div>
        <h2 className="error-title">Order not found</h2>
        <button className="back-btn" onClick={() => navigate("/menu/1")}>
          Back to Menu
        </button>
      </div>
    );
  }

  const currentStep = getStatusProgress(order.status);
  const statusInfo = getStatusInfo(order.status);

  const steps = [
    { key: "PENDING", label: "Placed" },
    { key: "ACCEPTED", label: "Confirmed" },
    { key: "COOKING", label: "Preparing" },
    { key: "READY", label: "Ready" },
    { key: "SERVED", label: "Done" }
  ];

  return (
    <div className="status-page">
      <style>{`
        .status-page {
          min-height: 100vh;
          background: #0a0a0f;
          padding: 30px 20px;
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .status-card {
          max-width: 500px;
          margin: 0 auto;
          background: linear-gradient(145deg, #15151f, #0d0d14);
          border-radius: 24px;
          padding: 32px;
          border: 1px solid #222;
        }
        .order-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .order-label { color: #666; font-size: 0.9rem; margin: 0 0 4px; }
        .order-number { color: #fff; font-size: 2rem; font-weight: 700; margin: 0; }
        
        .status-display {
          text-align: center;
          margin-bottom: 32px;
        }
        .status-icon-wrap {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin: 0 auto 16px;
        }
        .status-label { color: #fff; font-size: 1.5rem; font-weight: 700; margin: 0 0 8px; }
        .status-message { color: #666; margin: 0; }
        
        .progress-steps {
          display: flex;
          justify-content: space-between;
          margin: 32px 0;
          position: relative;
        }
        .progress-steps::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 12px;
          right: 12px;
          height: 3px;
          background: #222;
        }
        .step { display: flex; flex-direction: column; align-items: center; z-index: 1; }
        .step-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #15151f;
          border: 3px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          font-size: 1rem;
          transition: 0.3s;
        }
        .step-circle.active { border-color: #6366f1; background: #6366f1; box-shadow: 0 0 20px rgba(99, 102, 241, 0.5); }
        .step-circle.completed { border-color: #10b981; background: #10b981; }
        .step-label { font-size: 0.7rem; color: #555; text-transform: uppercase; }
        .step-label.active { color: #6366f1; }
        
        .items-box { margin-top: 32px; }
        .items-title { color: #fff; font-size: 1.1rem; margin: 0 0 16px; font-weight: 600; }
        .item-row {
          display: flex;
          justify-content: space-between;
          padding: 14px;
          background: #1a1a24;
          border-radius: 12px;
          margin-bottom: 10px;
        }
        .item-name { color: #ccc; }
        .item-qty { color: #666; background: #222; padding: 4px 10px; border-radius: 8px; font-size: 0.85rem; }
        
        .table-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 14px;
          margin-top: 24px;
        }
        .table-label { color: #888; }
        .table-num { color: #818cf8; font-size: 1.5rem; font-weight: 700; }
        
        .order-btn {
          width: 100%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          padding: 16px;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 24px;
          transition: 0.2s;
        }
        .order-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3); }
      `}</style>

      <div className="status-card">
        <div className="order-header">
          <p className="order-label">Order ID</p>
          <h1 className="order-number">#{order.id}</h1>
        </div>

        <div className="status-display">
          <div 
            className="status-icon-wrap"
            style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}
          >
            {statusInfo.icon}
          </div>
          <h2 className="status-label" style={{ color: statusInfo.color }}>{statusInfo.label}</h2>
          <p className="status-message">{statusInfo.message}</p>
        </div>

        <div className="progress-steps">
          {steps.map((step, index) => (
            <div key={step.key} className="step">
              <div className={`step-circle ${index < currentStep ? 'completed' : ''} ${index === currentStep ? 'active' : ''}`}>
                {index < currentStep ? '✓' : ''}
              </div>
              <span className={`step-label ${index <= currentStep ? 'active' : ''}`}>{step.label}</span>
            </div>
          ))}
        </div>

        <div className="items-box">
          <h3 className="items-title">Order Items</h3>
          {order.items?.map((item, idx) => (
            <div key={idx} className="item-row">
              <span className="item-name">{item.menuItem?.name || "Item"}</span>
              <span className="item-qty">x{item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="table-box">
          <span className="table-label">Table</span>
          <span className="table-num">{order.tableId}</span>
        </div>

        <button className="order-btn" onClick={() => navigate(`/menu/${order.tableId}`)}>
          Order More
        </button>
      </div>
    </div>
  );
};

export default OrderStatus;
