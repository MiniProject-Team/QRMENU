import API from "./axios";

// Generate QR code for a specific table
export const generateTableQR = (tableId) => {
  return API.get(`/admin/qr/table/${tableId}`);
};

// Generate QR codes for all tables
export const generateAllTableQRs = () => {
  return API.get("/admin/qr/all-tables");
};

// Get QR configuration
export const getQRConfig = () => {
  return API.get("/admin/qr/config");
};
