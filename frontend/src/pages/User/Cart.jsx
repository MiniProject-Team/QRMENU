import { useLocation, useNavigate } from "react-router-dom";

const Cart = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const orderId = location.state?.orderId;

  return (
    <div style={{ padding: 20 }}>

      <h1>Order Confirmation</h1>

      {orderId ? (
        <>
          <h2>✅ Order Placed Successfully!</h2>
          <p>Your Order ID is: <strong>{orderId}</strong></p>

          <button style={button} onClick={() => navigate("/")}>
            Back to Menu
          </button>
        </>
      ) : (
        <>
          <h2>No Order Found</h2>
          <button style={button} onClick={() => navigate("/")}>
            Go to Menu
          </button>
        </>
      )}

    </div>
  );
};

const button = {
  marginTop: 20,
  padding: "10px 20px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};

export default Cart;