import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

const Menu = () => {

  const { tableId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await API.get("/admin/menu/all");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching menu:", err);
    }
  };

  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);

    if (existing) {
      setCart(cart.map(i =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

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

      // Clear cart
      setCart([]);

      // Redirect to cart page with order ID
      navigate("/cart", { state: { orderId: res.data.id } });

    } catch (err) {
      console.error("Order failed:", err);
      alert("Failed to place order");
    }
  };

  return (
    <div style={{ padding: 20 }}>

      <h1>Table {tableId} Menu</h1>

      <div>
        {items.map(item => (
          <div key={item.id} style={card}>
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
            <button onClick={() => addToCart(item)}>
              Add
            </button>
          </div>
        ))}
      </div>

      <hr />

      <h2>Cart</h2>

      {cart.map(item => (
        <div key={item.id}>
          {item.name} x {item.quantity}
        </div>
      ))}

      {cart.length > 0 && (
        <button onClick={placeOrder}>
          Place Order
        </button>
      )}

    </div>
  );
};

const card = {
  padding: 15,
  margin: 10,
  border: "1px solid #ccc",
  borderRadius: 8
};

export default Menu;