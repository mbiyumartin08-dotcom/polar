// src/App.jsx
// Routes. BrowserRouter lives in main.jsx.
//   Public layout (top navbar):  /  and 404
//   Admin layout (sidebar):      /dashboard  /menu  /menu/new  /menu/:id  /orders
import { Routes, Route } from "react-router-dom";
import { ProductsProvider } from "./context/ProductsContext";
import PublicLayout from "./components/PublicLayout";
import AdminLayout from "./components/AdminLayout";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import MenuPage from "./components/MenuPage";
import FormPage from "./components/FormPage";
import MenuDetail from "./components/MenuDetail";
import OrderList from "./components/OrderList";
import NotFound from "./components/NotFound";

export default function App() {
  return (
    <ProductsProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/menu" element={<MenuPage />} />
          {/* "new" must be listed before ":id" so it is not read as a product id */}
          <Route path="/menu/new" element={<FormPage />} />
          <Route path="/menu/:id" element={<MenuDetail />} />
          <Route path="/orders" element={<OrderList />} />
        </Route>
      </Routes>
    </ProductsProvider>
  );
}
