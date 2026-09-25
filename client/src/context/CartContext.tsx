import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/products";
import { useToast } from "@/hooks/use-toast";
import { useInventory } from "@/context/InventoryContext";
import { isProductAvailable } from "@/lib/inventory";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem("krishna-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });
  const { toast } = useToast();
  const { products } = useInventory();

  useEffect(() => {
    localStorage.setItem("krishna-cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    setItems((current) =>
      current.flatMap((item) => {
        const inventoryProduct = products.find((product) => product.id === item.id);
        if (!inventoryProduct || !isProductAvailable(inventoryProduct)) return [];
        return [{
          ...inventoryProduct,
          quantity: Math.min(item.quantity, inventoryProduct.stockQuantity),
        }];
      }),
    );
  }, [products]);

  const addToCart = (product: Product, quantity = 1) => {
    const inventoryProduct = products.find((item) => item.id === product.id) || product;
    if (!isProductAvailable(inventoryProduct)) {
      toast({
        title: "Out of Stock",
        description: `${inventoryProduct.name} is currently unavailable.`,
        variant: "destructive",
      });
      return;
    }
    const requestedQuantity = Math.max(1, Math.floor(quantity));
    const existing = items.find((item) => item.id === inventoryProduct.id);
    const currentQuantity = existing?.quantity || 0;
    const nextQuantity = Math.min(
      currentQuantity + requestedQuantity,
      inventoryProduct.stockQuantity,
    );
    if (nextQuantity === currentQuantity) {
      toast({
        title: "Stock limit reached",
        description: `Only ${inventoryProduct.stockQuantity} units are available.`,
        variant: "destructive",
      });
      return;
    }
    setItems((prev) => {
      if (existing) {
        return prev.map((item) =>
          item.id === inventoryProduct.id
            ? { ...inventoryProduct, quantity: nextQuantity }
            : item
        );
      }
      return [...prev, { ...inventoryProduct, quantity: nextQuantity }];
    });
    toast({
      title: "Added to Cart",
      description: `${inventoryProduct.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
    toast({
      title: "Removed from Cart",
      description: "Item removed successfully.",
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    const inventoryProduct = products.find((product) => product.id === productId);
    if (!inventoryProduct || !isProductAvailable(inventoryProduct)) {
      removeFromCart(productId);
      return;
    }
    const nextQuantity = Math.min(quantity, inventoryProduct.stockQuantity);
    if (quantity > inventoryProduct.stockQuantity) {
      toast({
        title: "Stock limit reached",
        description: `Only ${inventoryProduct.stockQuantity} units are available.`,
        variant: "destructive",
      });
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...inventoryProduct, quantity: nextQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
