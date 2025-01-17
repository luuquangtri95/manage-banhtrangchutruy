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
import BaseLayout from "../layouts/BaseLayout";
import OrdersPage from "../pages/order";
import ProductsPage from "../pages/product";
import OrderCreate from "../pages/order/create/OrderCreate";
import OrderList from "../pages/order/list";
import AnalyticPage from "../pages/analytic";
import UsersPage from "../pages/users";
import WholesalePrice from "../pages/wholesale-price";
import UserOrderPage from "../pages/user/Order/UserOrderPage";
import UserOrderList from "../pages/user/OrderList/UserOrderList";
import UserOrderCreate from "../pages/user/OrderCreate/UserOrderCreate";
import CategoryPage from "../pages/category/CategoryPage";

const FallbackRoute = () => {
  const { authenticated, role } = useContext(AuthContext);

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return <Navigate to={`/dashboard/${role}`} />;
};

const AppRoutes = () => {
  const { authenticated, role } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Base layout with protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRouteContext roles={["admin", "user", "guest"]}>
              <BaseLayout />
            </ProtectedRouteContext>
          }
        >
          <Route
            index
            element={
              <Navigate
                to={role === "admin" ? "/dashboard/admin" : "/dashboard/user"}
              />
            }
          />

          <Route path="admin" element={<AdminPage />}>
            <Route path="orders" element={<OrdersPage />}>
              <Route index element={<OrderList />} />
              <Route path="create" element={<OrderCreate />} />
            </Route>

            <Route path="categories" element={<CategoryPage />} />

            <Route path="analytic" element={<AnalyticPage />} />

            <Route path="wholesale-price" element={<WholesalePrice />} />

            <Route path="users" element={<UsersPage />} />

            <Route path="products" element={<ProductsPage />} />
          </Route>

          <Route path="user" element={<UserPage />}>
            {/* <Route path="orders" element={<OrdersPage />} />
            <Route path="products" element={<ProductsPage />} /> */}
            <Route path="orders" element={<UserOrderPage />}>
              <Route index element={<UserOrderList />} />
              <Route path="create" element={<UserOrderCreate />} />
            </Route>
          </Route>

          <Route path="guest" element={<GuestPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<FallbackRoute />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
