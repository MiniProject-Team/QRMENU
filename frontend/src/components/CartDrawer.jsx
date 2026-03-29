import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "./CartItem";

const formatCurrency = (value) =>
  `Rs ${Number(value ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    itemCount,
    subtotal,
    isDrawerOpen,
    closeDrawer,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    tableId,
  } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm transition duration-300 ${isDrawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeDrawer}
      />
      <aside
        className={`fixed right-0 top-0 z-[60] flex h-full w-full max-w-xl flex-col border-l border-white/70 bg-slate-50/96 shadow-[0_40px_100px_rgba(15,23,42,0.18)] transition duration-300 ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="section-kicker">Your Order</p>
            <h2 className="display-title text-3xl">Cart Summary</h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-lg font-bold text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            X
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
          {cartItems.length ? (
            cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                compact
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                onRemove={removeFromCart}
              />
            ))
          ) : (
            <div className="glass-panel flex h-full flex-col items-center justify-center gap-3 px-6 py-10 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-teal-100 text-lg font-extrabold text-teal-700">
                Tray
              </div>
              <h3 className="display-title text-3xl">Your cart is empty</h3>
              <p className="max-w-sm text-sm leading-6 text-slate-600">
                Add dishes from the menu and they will appear here with live totals and quantity controls.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white/90 px-6 py-5">
          <div className="mb-5 flex items-center justify-between text-sm text-slate-500">
            <span>{itemCount} items selected</span>
            <span>{tableId ? `Table ${tableId}` : "Walk-in order"}</span>
          </div>
          <div className="mb-5 flex items-center justify-between">
            <span className="text-base font-semibold text-slate-600">Subtotal</span>
            <strong className="text-2xl font-extrabold text-slate-950">{formatCurrency(subtotal)}</strong>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                closeDrawer();
                navigate("/cart");
              }}
              className="secondary-action"
            >
              View Cart
            </button>
            <button
              type="button"
              onClick={() => {
                closeDrawer();
                navigate("/checkout");
              }}
              disabled={!cartItems.length}
              className="primary-action"
            >
              Place Order
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
