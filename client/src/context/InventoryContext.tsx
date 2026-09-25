import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Product } from "@/lib/products";
import {
  INVENTORY_STORAGE_KEY,
  loadInventory,
  normaliseInventory,
} from "@/lib/inventory";

type InventoryContextValue = {
  products: Product[];
  lastUpdated: string | null;
  replaceInventory: (products: Product[]) => void;
  updateProduct: (productId: number, changes: Partial<Product>) => void;
};

const InventoryContext = createContext<InventoryContextValue | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(loadInventory);

  useEffect(() => {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    const syncInventory = (event: StorageEvent) => {
      if (event.key !== INVENTORY_STORAGE_KEY || !event.newValue) return;
      try {
        const parsed = JSON.parse(event.newValue);
        if (Array.isArray(parsed)) setProducts(normaliseInventory(parsed));
      } catch {
        return;
      }
    };
    window.addEventListener("storage", syncInventory);
    return () => window.removeEventListener("storage", syncInventory);
  }, []);

  const replaceInventory = (nextProducts: Product[]) => {
    setProducts(normaliseInventory(nextProducts));
  };

  const updateProduct = (productId: number, changes: Partial<Product>) => {
    setProducts((current) =>
      current.map((product) => {
        if (product.id !== productId) return product;
        const stockQuantity = changes.stockQuantity ?? product.stockQuantity;
        const requestedStatus = changes.status ?? product.status;
        const status =
          requestedStatus === "Inactive"
            ? "Inactive"
            : stockQuantity > 0
              ? "In Stock"
              : "Out of Stock";
        return {
          ...product,
          ...changes,
          stockQuantity,
          status,
          lastUpdated: new Date().toISOString(),
        };
      }),
    );
  };

  const lastUpdated = useMemo(() => {
    const timestamps = products
      .map((product) => Date.parse(product.lastUpdated))
      .filter(Number.isFinite);
    return timestamps.length > 0
      ? new Date(Math.max(...timestamps)).toISOString()
      : null;
  }, [products]);

  return (
    <InventoryContext.Provider
      value={{ products, lastUpdated, replaceInventory, updateProduct }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error("useInventory must be used within InventoryProvider");
  return context;
}
