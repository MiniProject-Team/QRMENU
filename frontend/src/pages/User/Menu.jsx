import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import GuestMobileNav from "../../components/GuestMobileNav";
import { loadGuestCart, saveGuestCart } from "../../utils/guestFlow";
import { getMenuImage } from "../../utils/menuImages";

const fmtCurrency = (value) =>
  `Rs ${Number(value ?? 0).toLocaleString("en-IN")}`;

const getCategoryName = (item) =>
  (typeof item.category === "object"
    ? item.category?.name
    : item.category) || "specials";

const Menu = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const storedCart = loadGuestCart(tableId);

  const [items, setItems] = useState([]);
  const [cart, setCart] = useState(storedCart.items || []);
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMenu();
  }, [tableId]);

  useEffect(() => {
    const stored = loadGuestCart(tableId);
    setCart(stored.items || []);
  }, [tableId]);

  useEffect(() => {
    saveGuestCart({ tableId, items: cart });
  }, [cart, tableId]);

  // ✅ FETCH MENU
  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/user/menu");

      const data = Array.isArray(res.data) ? res.data : [];

      console.log("API DATA:", data);
      console.log("TOTAL ITEMS:", data.length);

      setItems(data);

      // ✅ FIXED CATEGORY
      const uniqueCategories = [
        "all",
        ...new Set(
          data.map((item) =>
            getCategoryName(item)?.toLowerCase().trim()
          )
        ),
      ];

      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Error fetching menu:", err);
      setItems([]);
      setCategories(["all"]);
      setError("Unable to load the menu right now.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FILTER FIXED
  const filteredItems = items.filter((item) => {
    const itemCategory = getCategoryName(item) || "";

    const matchesCategory =
      activeCategory === "all" ||
      itemCategory.toLowerCase().includes(activeCategory.toLowerCase());

    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // CART LOGIC
  const addToCart = (item) => {
    const existing = cart.find((entry) => entry.id === item.id);

    if (existing) {
      setCart((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        )
      );
      return;
    }

    setCart((current) => [...current, { ...item, quantity: 1 }]);
  };

  const removeFromCart = (itemId) => {
    const existing = cart.find((entry) => entry.id === itemId);
    if (!existing) return;

    if (existing.quantity > 1) {
      setCart((current) =>
        current.map((entry) =>
          entry.id === itemId
            ? { ...entry, quantity: entry.quantity - 1 }
            : entry
        )
      );
      return;
    }

    setCart((current) =>
      current.filter((entry) => entry.id !== itemId)
    );
  };

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const featuredItem =
    filteredItems[0] || items[0] || null;

  const heroImage = featuredItem ? getMenuImage(featuredItem) : "";

  const tableLabel = tableId ? `Table ${tableId}` : "Walk-in menu";

  return (
    <div className="menu-shell">
      <h2 style={{ color: "white", textAlign: "center" }}>
        {tableLabel}
      </h2>

      {/* ✅ DEBUG INFO */}
      <p style={{ color: "white", textAlign: "center" }}>
        Showing {filteredItems.length} of {items.length} items
      </p>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search food..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ margin: "10px", padding: "10px", width: "90%" }}
      />

      {/* CATEGORY */}
      <div style={{ margin: "10px" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              margin: "5px",
              padding: "10px",
              background:
                activeCategory === cat ? "orange" : "gray",
              color: "white",
              border: "none",
            }}
          >
            {cat === "all"
              ? "All"
              : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* LOADING */}
      {loading ? (
        <p style={{ color: "white" }}>Loading...</p>
      ) : (
        <div>
          {filteredItems.map((item) => {
            const cartItem = cart.find(
              (c) => c.id === item.id
            );

            return (
              <div
                key={item.id}
                style={{
                  border: "1px solid gray",
                  margin: "10px",
                  padding: "10px",
                  borderRadius: "10px",
                  color: "white",
                }}
              >
                <img
                  src={getMenuImage(item)}
                  alt={item.name}
                  width="100%"
                  height="200px"
                  style={{ objectFit: "cover" }}
                />

                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>{fmtCurrency(item.price)}</p>

                {cartItem ? (
                  <div>
                    <button
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                    >
                      -
                    </button>
                    <span style={{ margin: "10px" }}>
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CART */}
      {cart.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            width: "100%",
            background: "black",
            color: "white",
            padding: "10px",
          }}
        >
          <p>
            {cartCount} items | {fmtCurrency(cartTotal)}
          </p>
          <button
            onClick={() =>
              navigate("/cart", {
                state: { cart, tableId },
              })
            }
          >
            Go to Cart
          </button>
        </div>
      )}

      <GuestMobileNav currentTableId={tableId} />
    </div>
  );
};

export default Menu;