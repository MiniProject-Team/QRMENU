import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/Login" />;
  }

  // ❌ Role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  // ✅ Access allowed
  return children;
};

export default ProtectedRoute;