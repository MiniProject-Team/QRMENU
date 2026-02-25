import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";

import AdminDashboard from "../pages/Admin/Dashboard";
import KitchenPanel from "../pages/kitchen/KitchenPanel";
import Menu from "../pages/User/Menu";
import ManageMenu from "../pages/Admin/ManageMenu";
import Categories from "../pages/Admin/Categories";
import Tables from "../pages/Admin/Tables";

import OrderStatus from "../pages/User/OrderStatus";
import Payment from "../pages/User/Payment";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/menu" element={<ManageMenu />} />
<Route path="/admin/categories" element={<Categories />} />
<Route path="/admin/tables" element={<Tables />} />
<Route path="/status" element={<OrderStatus />} />
<Route path="/payment" element={<Payment />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* USER */}
        <Route path="/menu/:tableId" element={<Menu />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* KITCHEN */}
        <Route
          path="/kitchen"
          element={
            <ProtectedRoute role="ROLE_KITCHEN">
              <KitchenPanel />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

