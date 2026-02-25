import { useState } from "react";
import API from "../../api/axios";

const OrderStatus = () => {

  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);

  const checkStatus = async () => {
    const res = await API.get(`/user/orders/${orderId}`);
    setOrder(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Track Order</h2>

      <input
        placeholder="Enter Order ID"
        onChange={(e) => setOrderId(e.target.value)}
      />

      <button onClick={checkStatus}>
        Check
      </button>

      {order && (
        <div>
          <h3>Status: {order.status}</h3>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;