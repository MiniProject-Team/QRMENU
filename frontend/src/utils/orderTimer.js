const MINUTE_MS = 60 * 1000;
const CATEGORY_MINUTES = {
  starters: 5,
  starter: 5,
  "main course": 8,
  main: 8,
  beverages: 6,
  beverage: 6,
  desserts: 3,
  dessert: 3,
};

const ITEM_CATEGORY_MAP = {
  "paneer tikka": "starters",
  "veg manchurian": "starters",
  "butter chicken": "main course",
  "veg biryani": "main course",
  "masala dosa": "main course",
  "cold coffee": "beverages",
  "lemon soda": "beverages",
  "gulab jamun": "desserts",
};

const normalize = (value) => String(value || "").trim().toLowerCase();

const getTimestamp = (value) => {
  if (!value) return null;

  const raw = String(value).trim();
  const parsed = new Date(raw).getTime();
  if (!Number.isNaN(parsed)) return parsed;

  const fallbackParsed = new Date(raw.replace(" ", "T")).getTime();
  return Number.isNaN(fallbackParsed) ? null : fallbackParsed;
};

const getCategoryMinutesFromName = (name) => {
  const normalizedName = normalize(name);
  const mappedCategory = ITEM_CATEGORY_MAP[normalizedName];
  if (mappedCategory) return CATEGORY_MINUTES[mappedCategory] ?? null;

  return Object.entries(CATEGORY_MINUTES).find(([categoryName]) => normalizedName.includes(categoryName))?.[1] ?? null;
};

export const inferTotalTimeMinutes = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  const total = items.reduce((sum, item) => {
    const name = item?.itemName ?? item?.name ?? item?.menuItem?.name ?? item;
    const quantity = Number(item?.quantity ?? 1);
    const minutes = getCategoryMinutesFromName(name);
    return sum + (minutes ?? 0) * quantity;
  }, 0);

  return total > 0 ? total : null;
};

export const getRemainingPrepMs = (orderStartTime, totalTimeMinutes, now = Date.now()) => {
  if (!orderStartTime || totalTimeMinutes == null) return null;

  const startedAt = getTimestamp(orderStartTime);
  if (startedAt == null) return null;

  const durationMs = Number(totalTimeMinutes) * MINUTE_MS;
  return Math.max(0, startedAt + durationMs - now);
};

export const formatRemainingPrep = (remainingMs) => {
  if (remainingMs == null) return "Timer unavailable";
  if (remainingMs <= 0) return "Ready";

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};
