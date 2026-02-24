import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api/axios";

const Cart = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const { cart, tableId } = location.state || {};

  if (!cart || cart.length === 0) {
    return <h2>Cart is empty</h2>;
  }

  const placeOrder = async () => {
    try {

      const payload = {
        tableId: tableId,
        items: cart.map(i => ({
          itemId: i.id,
          quantity: i.quantity
        }))
      };

      const res = await API.post("/user/orders", payload);

      alert("Order placed successfully!");

      navigate(`/order-success/${res.data.id}`);

    } catch (err) {
      console.error("Order failed:", err);
      alert("Failed to place order");
    }
  };

  return (
    <div style={{ padding: 20 }}>

      <h1>Cart</h1>

      {cart.map(item => (
        <div key={item.id}>
          {item.name} x {item.quantity}
        </div>
      ))}

      <button onClick={placeOrder}>
        Place Order
      </button>

    </div>
  );
};

export default Cart;