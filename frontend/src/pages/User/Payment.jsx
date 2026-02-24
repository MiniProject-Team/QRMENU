import { useState } from "react";
import API from "../../api/axios";

const Payment = () => {

  const [orderId, setOrderId] = useState("");
  const [method, setMethod] = useState("CASH");

  const pay = async () => {

    await API.post("/user/payment/pay", {
      orderId,
      method
    });

    alert("Payment Successful");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Payment</h2>

      <input
        placeholder="Order ID"
        onChange={(e) => setOrderId(e.target.value)}
      />

      <select onChange={(e) => setMethod(e.target.value)}>
        <option value="CASH">Cash</option>
        <option value="UPI">UPI</option>
        <option value="CARD">Card</option>
      </select>

      <button onClick={pay}>
        Pay
      </button>
    </div>
  );
};

export default Payment;