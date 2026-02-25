import { useEffect, useState } from "react";
import API from "../../api/axios";

const Dashboard = () => {

  const [data, setData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await API.get("/admin/dashboard/summary");
    setData(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      <div style={{ display: "flex", gap: 20 }}>

        <div style={card}>
          <h3>Total Orders</h3>
          <p>{data.totalOrders}</p>
        </div>

        <div style={card}>
          <h3>Total Menu Items</h3>
          <p>{data.totalItems}</p>
        </div>

      </div>
    </div>
  );
};

const card = {
  padding: 20,
  background: "#eee",
  borderRadius: 10,
};

export default Dashboard;