import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/Admin/Dashboard";
import Cart from "../pages/User/Cart";
import KitchenPanel from "../pages/Kitchen/KitchenPanel";
import Menu from "../pages/User/Menu";
import ManageMenu from "../pages/Admin/ManageMenu";
import Categories from "../pages/Admin/Categories";
import Orders from "../pages/Admin/Orders";
import Tables from "../pages/Admin/Tables";
import GenerateQR from "../pages/Admin/GenerateQR";
import OrderStatus from "../pages/User/OrderStatus";
import Payment from "../pages/User/Payment";


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
        <Route path="/order-status/:orderId" element={<OrderStatus />} />
        <Route path="/status" element={<OrderStatus />} />
        <Route path="/payment" element={<Payment />} />
       
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/menu" element={<ManageMenu />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/tables" element={<Tables />} />
        <Route path="/admin/generate-qr" element={<GenerateQR />} />
        
        {/* Kitchen Routes */}
        <Route path="/kitchen" element={<KitchenPanel />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
