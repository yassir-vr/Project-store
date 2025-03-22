import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./component/MainSections/MainPage";
import Categories from "./component/admin/Categories";
import Orders from "./component/admin/Orders";
import AdminDashboard from "./component/admin/AdminDashboard";
import ProductManagement from "./component/admin/ProductManagement";
import LoginMain from "./component/Router/Login/LoginMain/LoginMain";
import CategoryProducts from "./component/Categories/CategoryProducts";
import OrderConfirmation from "./component/checkout/OrderConfirmation";
import UserProfile from "./component/profile/UserProfile";
import UserOrders from "./component/profile/UserOrders";
import Payment from "./component/checkout/Payment";
import Checkout from "./component/checkout/Checkout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AdminRoute from "./component/AdminRoute"; // Importez le composant AdminRoute

// Clé publique Stripe
const stripePromise = loadStripe(
  "pk_test_51Qzzz0Rs8SxkDf3PFP6Nm7xwBoOMaEdka71rUv643ydzAfyhpLlYPB9eopFncR63weAl1IZFCbGLIssA7qHWG2hy00ZaJFHgeu"
);

function App() {
  return (
    <div className="App">
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/new-user" element={<LoginMain />} />
          <Route path="/login" element={<LoginMain />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/category/:id" element={<CategoryProducts />} />
          <Route
            path="/order-confirmation/:orderId"
            element={<OrderConfirmation />}
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/user/orders" element={<UserOrders />} />

          {/* Routes protégées pour les administrateurs */}
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <Categories />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <ProductManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <Orders />
              </AdminRoute>
            }
          />
        </Routes>
      </Elements>
    </div>
  );
}

export default App;
