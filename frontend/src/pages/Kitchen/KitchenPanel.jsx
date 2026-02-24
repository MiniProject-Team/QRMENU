import { useEffect, useState } from "react";
import API from "../../api/axios";

const KitchenPanel = () => {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();

    // Auto refresh every 5 sec
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);

  }, []);

  const fetchOrders = async () => {
    const res = await API.get("/kitchen/orders/active");
    setOrders(res.data);
  };

  const updateStatus = async (id, type) => {

    await API.put(`/kitchen/orders/${type}/${id}`);
    fetchOrders();
  };

  return (
    <div style={{ padding: 20 }}>

      <h1>Kitchen Panel</h1>

      {orders.length === 0 && <p>No Active Orders</p>}

      {orders.map(order => (

        <div key={order.orderId} style={card}>

          <h3>Order #{order.orderId}</h3>
          <p>Table: {order.tableNumber}</p>
          <p>Status: {order.status}</p>

          <h4>Items:</h4>
          {order.items.map((item, i) => (
            <p key={i}>• {item}</p>
          ))}

          <div style={{ marginTop: 10 }}>

            <button onClick={() =>
              updateStatus(order.orderId, "accept")
            }>
              Accept
            </button>

            <button onClick={() =>
              updateStatus(order.orderId, "cooking")
            }>
              Cooking
            </button>

            <button onClick={() =>
              updateStatus(order.orderId, "ready")
            }>
              Ready
            </button>

            <button onClick={() =>
              updateStatus(order.orderId, "served")
            }>
              Served
            </button>

          </div>

        </div>
      ))}

    </div>
  );
};

const card = {
  border: "1px solid #ccc",
  padding: 15,
  marginBottom: 15,
  borderRadius: 8,
  background: "#f9f9f9"
};

export default KitchenPanel;