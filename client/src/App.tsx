import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/CartContext";
import { InventoryProvider } from "@/context/InventoryContext";
import { AuthProvider } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Contact from "@/pages/Contact";
import ProductListing from "@/pages/ProductListing";
import Account from "@/pages/Account";
import Orders from "@/pages/Orders";
import AdminLogin from "@/pages/AdminLogin";
import AdminInventory from "@/pages/AdminInventory";
import { KrishnaAI } from "@/components/ai/KrishnaAI";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/products/:category" component={ProductListing} />
      <Route path="/products" component={ProductListing} />
      <Route path="/product/:id" component={ProductDetails} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/account" component={Account} />
      <Route path="/orders" component={Orders} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin/inventory" component={AdminInventory} />
      <Route path="/admin" component={AdminLogin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InventoryProvider>
          <CartProvider>
            <Router />
            {!location.startsWith("/admin") && <KrishnaAI />}
            <Toaster />
          </CartProvider>
        </InventoryProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
