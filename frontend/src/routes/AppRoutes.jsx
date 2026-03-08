import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/Admin/Dashboard";
import Cart from "../pages/User/Cart";
import Checkout from "../pages/User/Checkout";
import KitchenPanel from "../pages/Kitchen/KitchenPanel";
import Menu from "../pages/User/Menu";
import ManageMenu from "../pages/Admin/ManageMenu";
import Categories from "../pages/Admin/Categories";
import Orders from "../pages/Admin/Orders";
import Tables from "../pages/Admin/Tables";
import GenerateQR from "../pages/Admin/GenerateQR";
import OrderStatus from "../pages/User/OrderStatus";
import Payment from "../pages/User/Payment";
import ProtectedRoute from "./ProtectedRoute";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* User Routes */}
        <Route path="/" element={<Menu />} />
        <Route path="/menu/:tableId" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-status/:orderId" element={<OrderStatus />} />
        
        <Route path="/payment" element={<Payment />} />
       
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <ManageMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tables"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <Tables />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/generate-qr"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <GenerateQR />
            </ProtectedRoute>
          }
        />
        
        {/* Kitchen Routes */}
        <Route
          path="/kitchen"
          element={
            <ProtectedRoute>
              <KitchenPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
