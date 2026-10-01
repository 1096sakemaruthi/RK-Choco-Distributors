import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const isAdminLoggedIn =
    sessionStorage.getItem("adminLoggedIn");

  return isAdminLoggedIn === "true" ? (
    <Outlet />
  ) : (
    <Navigate to="/admin-login" replace />
  );
};

export default AdminProtectedRoute;