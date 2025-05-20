
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import Pharmacies from "./pages/Pharmacies";
import Supermarkets from "./pages/Supermarkets";
import Jobs from "./pages/Jobs";
import Doctors from "./pages/Doctors";
import Handymen from "./pages/Handymen";
import AddStore from "./pages/AddStore";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCategories from "./pages/admin/Categories";
import AdminRestaurants from "./pages/admin/Restaurants";
import AdminProducts from "./pages/admin/Products";
import AdminPromos from "./pages/admin/Promos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="restaurants" element={<Restaurants />} />
              <Route path="restaurants/:id" element={<RestaurantDetails />} />
              <Route path="pharmacies" element={<Pharmacies />} />
              <Route path="supermarkets" element={<Supermarkets />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="doctors" element={<Doctors />} />
              <Route path="handymen" element={<Handymen />} />
              <Route path="add-store" element={<AddStore />} />
              <Route path="cart" element={<Cart />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/restaurants" element={<AdminRestaurants />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/promos" element={<AdminPromos />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
