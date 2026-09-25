import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Product } from "@/lib/products";
import {
  authenticateCustomer,
  clearCustomerSession,
  createCustomerAccount,
  CUSTOMER_SESSION_KEY,
  CustomerUser,
  migrateCustomerAccounts,
  persistCustomerSession,
  restoreCustomerSession,
} from "@/lib/customerAuth";

export type User = CustomerUser;

interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  mobile: string;
  houseFlat: string;
  streetArea: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
}

type OrderItem = Product & { quantity: number };

type OrderAddress = Pick<
  SavedAddress,
  | "fullName"
  | "mobile"
  | "houseFlat"
  | "streetArea"
  | "city"
  | "state"
  | "pinCode"
>;

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  address: OrderAddress;
  status: string;
  createdAt: string;
  estimatedDelivery: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (
    emailOrMobile: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    mobile: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => void;
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "userId" | "createdAt">) => void;
  redirectAfterLogin: string | null;
  setRedirectAfterLogin: (redirect: string | null) => void;
  buyNowProduct: Product | null;
  setBuyNowProduct: (product: Product | null) => void;
  savedAddresses: SavedAddress[];
  addSavedAddress: (address: Omit<SavedAddress, "id">) => void;
  updateSavedAddress: (id: string, address: Partial<SavedAddress>) => void;
  deleteSavedAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readArray = <T,>(key: string): T[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

const getWishlistStorageKey = (user: User | null) =>
  user ? `krishna-wishlist-${user.id}` : "krishna-wishlist-guest";

const loadWishlist = (user: User | null) => {
  const key = getWishlistStorageKey(user);
  if (localStorage.getItem(key) !== null) return readArray<number>(key);

  const legacyKey = "krishna-wishlist";
  const legacyWishlist = readArray<number>(legacyKey);
  if (localStorage.getItem(legacyKey) !== null) {
    localStorage.setItem(key, JSON.stringify(legacyWishlist));
    localStorage.removeItem(legacyKey);
  }
  return legacyWishlist;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(restoreCustomerSession);
  const [orders, setOrders] = useState<Order[]>([]);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(
    null,
  );
  const [buyNowProduct, setBuyNowProduct] = useState<Product | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [loadedAccountKey, setLoadedAccountKey] = useState<string | null>(null);
  const authChannel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    void migrateCustomerAccounts();
  }, []);

  useEffect(() => {
    const syncPersistentSession = (event: StorageEvent) => {
      if (
        event.storageArea === localStorage &&
        event.key === CUSTOMER_SESSION_KEY
      ) {
        setUser(restoreCustomerSession());
      }
    };
    window.addEventListener("storage", syncPersistentSession);

    if ("BroadcastChannel" in window) {
      authChannel.current = new BroadcastChannel("krishna-customer-auth");
      authChannel.current.onmessage = (event: MessageEvent<"logout">) => {
        if (event.data !== "logout") return;
        clearCustomerSession();
        setUser(null);
        setRedirectAfterLogin(null);
        setBuyNowProduct(null);
      };
    }

    return () => {
      window.removeEventListener("storage", syncPersistentSession);
      authChannel.current?.close();
      authChannel.current = null;
    };
  }, []);

  useEffect(() => {
    const savedRedirect = localStorage.getItem("krishna-redirect");
    if (savedRedirect) {
      setRedirectAfterLogin(savedRedirect);
      localStorage.removeItem("krishna-redirect");
    }
  }, []);

  useEffect(() => {
    const accountKey = user?.id || "guest";
    setLoadedAccountKey(null);
    setOrders(user ? readArray<Order>(`krishna-orders-${user.id}`) : []);
    setSavedAddresses(
      user
        ? readArray<SavedAddress>(`krishna-addresses-${user.id}`)
        : [],
    );
    setWishlist(loadWishlist(user));
    setLoadedAccountKey(accountKey);
  }, [user]);

  useEffect(() => {
    if (user && loadedAccountKey === user.id) {
      localStorage.setItem(
        `krishna-orders-${user.id}`,
        JSON.stringify(orders),
      );
    }
  }, [loadedAccountKey, orders, user]);

  useEffect(() => {
    if (user && loadedAccountKey === user.id) {
      localStorage.setItem(
        `krishna-addresses-${user.id}`,
        JSON.stringify(savedAddresses),
      );
    }
  }, [loadedAccountKey, savedAddresses, user]);

  useEffect(() => {
    const accountKey = user?.id || "guest";
    if (loadedAccountKey === accountKey) {
      localStorage.setItem(
        getWishlistStorageKey(user),
        JSON.stringify(wishlist),
      );
    }
  }, [loadedAccountKey, user, wishlist]);

  useEffect(() => {
    if (redirectAfterLogin) {
      localStorage.setItem("krishna-redirect", redirectAfterLogin);
    } else {
      localStorage.removeItem("krishna-redirect");
    }
  }, [redirectAfterLogin]);

  const login = async (
    emailOrMobile: string,
    password: string,
    rememberMe: boolean,
  ) => {
    const authenticatedUser = await authenticateCustomer(
      emailOrMobile,
      password,
    );
    if (!authenticatedUser) return false;

    persistCustomerSession(authenticatedUser, rememberMe);
    setUser(authenticatedUser);
    return true;
  };

  const signup = async (
    name: string,
    email: string,
    mobile: string,
    password: string,
  ) => {
    const newUser = await createCustomerAccount(
      name,
      email,
      mobile,
      password,
    );
    if (!newUser) return false;

    persistCustomerSession(newUser, false);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    clearCustomerSession();
    authChannel.current?.postMessage("logout");
    setUser(null);
    setRedirectAfterLogin(null);
    setBuyNowProduct(null);
  };

  const addOrder = (order: Omit<Order, "id" | "userId" | "createdAt">) => {
    if (!user) return;

    const newOrder: Order = {
      ...order,
      id: `KE${Date.now().toString().slice(-8)}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    setOrders((current) => [newOrder, ...current]);
  };

  const addSavedAddress = (address: Omit<SavedAddress, "id">) => {
    if (!user) return;

    const newAddress: SavedAddress = {
      ...address,
      id: Date.now().toString(),
    };
    setSavedAddresses((current) => [
      newAddress,
      ...current.map((savedAddress) =>
        address.isDefault
          ? { ...savedAddress, isDefault: false }
          : savedAddress,
      ),
    ]);
  };

  const updateSavedAddress = (
    id: string,
    address: Partial<SavedAddress>,
  ) => {
    if (!user) return;
    setSavedAddresses((current) =>
      current.map((savedAddress) =>
        savedAddress.id === id
          ? { ...savedAddress, ...address }
          : savedAddress,
      ),
    );
  };

  const deleteSavedAddress = (id: string) => {
    if (!user) return;
    setSavedAddresses((current) =>
      current.filter((address) => address.id !== id),
    );
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    setSavedAddresses((current) =>
      current.map((address) => ({
        ...address,
        isDefault: address.id === id,
      })),
    );
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        login,
        signup,
        logout,
        orders,
        addOrder,
        redirectAfterLogin,
        setRedirectAfterLogin,
        buyNowProduct,
        setBuyNowProduct,
        savedAddresses,
        addSavedAddress,
        updateSavedAddress,
        deleteSavedAddress,
        setDefaultAddress,
        wishlist,
        toggleWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
