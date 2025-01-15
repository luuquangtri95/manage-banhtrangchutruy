import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import ProtectedRouteContext from "../context/ProtectedRouteContext";
import AdminPage from "../pages/admin";
import LoginPage from "../pages/LoginPage";
import UserPage from "../pages/user";
import GuestPage from "../pages/guest";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import GuestOrderList from "../pages/guest/GuestOrderList";

const AppRoutes = () => {
  const { authenticated, role } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRouteContext roles={["admin"]}>
              <Routes>
                <Route path="" element={<AdminPage />} />
              </Routes>
            </ProtectedRouteContext>
          }
        />

        {/* Protected user routes */}
        <Route
          path="/user/*"
          element={
            <ProtectedRouteContext roles={["user"]}>
              <Routes>
                <Route path="" element={<UserPage />} />
              </Routes>
            </ProtectedRouteContext>
          }
        />

        {/* Protected guest routes */}
        <Route
          path="/guest/*"
          element={
            <ProtectedRouteContext roles={["guest"]}>
              <Routes>
                <Route path="" element={<GuestPage />} />
              </Routes>
            </ProtectedRouteContext>
          }
        />

        {/* Fallback route */}
        <Route
          path="*"
          element={
            authenticated ? (
              <Navigate
                to={
                  role === "admin"
                    ? "/admin"
                    : role === "user"
                    ? "/user"
                    : "/guest"
                }
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/orders" element={<GuestOrderList />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
