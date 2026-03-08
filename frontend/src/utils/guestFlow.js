const CART_KEY = "guest_cart";
const ORDER_KEY = "guest_current_order";

const parseStoredJson = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const loadGuestCart = (preferredTableId) => {
  const stored = parseStoredJson(CART_KEY);
  if (!stored || !Array.isArray(stored.items)) {
    return { tableId: preferredTableId ?? null, items: [] };
  }

  if (preferredTableId && stored.tableId && String(stored.tableId) !== String(preferredTableId)) {
    return { tableId: preferredTableId, items: [] };
  }

  return {
    tableId: stored.tableId ?? preferredTableId ?? null,
    items: stored.items,
  };
};

export const saveGuestCart = ({ tableId, items }) => {
  if (!items || items.length === 0) {
    localStorage.removeItem(CART_KEY);
    return;
  }

  localStorage.setItem(
    CART_KEY,
    JSON.stringify({
      tableId: tableId ?? null,
      items,
    })
  );
};

export const clearGuestCart = () => {
  localStorage.removeItem(CART_KEY);
};

export const loadCurrentOrder = () => parseStoredJson(ORDER_KEY);

export const saveCurrentOrder = ({ orderId, tableId }) => {
  if (!orderId) return;
  localStorage.setItem(
    ORDER_KEY,
    JSON.stringify({
      orderId,
      tableId: tableId ?? null,
    })
  );
};

export const clearCurrentOrder = () => {
  localStorage.removeItem(ORDER_KEY);
};
