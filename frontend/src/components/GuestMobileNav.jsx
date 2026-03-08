import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadCurrentOrder, loadGuestCart } from "../utils/guestFlow";

const GuestMobileNav = ({ currentTableId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const cart = useMemo(() => loadGuestCart(currentTableId), [currentTableId]);
  const order = useMemo(() => loadCurrentOrder(), []);
  const menuTarget = `/menu/${currentTableId || cart.tableId || 1}`;
  const statusTarget = order?.orderId ? `/order-status/${order.orderId}` : null;

  const items = [
    { key: "menu", label: "Menu", target: menuTarget, active: location.pathname.startsWith("/menu") || location.pathname === "/" },
    { key: "cart", label: "Cart", target: "/cart", active: location.pathname === "/cart" },
    { key: "checkout", label: "Checkout", target: "/checkout", active: location.pathname === "/checkout" },
    { key: "status", label: "Status", target: statusTarget, active: location.pathname.startsWith("/order-status"), disabled: !statusTarget },
  ];

  return (
    <>
      <style>{CSS}</style>
      <nav className="guest-mobile-nav">
        {items.map((item) => (
          <button
            key={item.key}
            className={`guest-mobile-link ${item.active ? "is-active" : ""}`}
            onClick={() => item.target && navigate(item.target)}
            disabled={item.disabled}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
};

const CSS = `
  .guest-mobile-nav {
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: 12px;
    z-index: 30;
    display: none;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
    padding: 8px;
    border-radius: 22px;
    background: rgba(15, 34, 48, 0.9);
    box-shadow: 0 18px 40px rgba(15, 34, 48, 0.24);
    backdrop-filter: blur(12px);
  }

  .guest-mobile-link {
    min-height: 46px;
    border: none;
    border-radius: 16px;
    background: transparent;
    color: rgba(255, 255, 255, 0.72);
    font: inherit;
    font-weight: 800;
    cursor: pointer;
  }

  .guest-mobile-link.is-active {
    background: linear-gradient(135deg, #0891b2, #155e75);
    color: #fff;
  }

  .guest-mobile-link:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    .guest-mobile-nav {
      display: grid;
    }
  }
`;

export default GuestMobileNav;
