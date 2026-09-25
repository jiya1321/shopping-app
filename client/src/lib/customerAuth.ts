export const CUSTOMER_SESSION_KEY = "krishna-auth-user";
export const CUSTOMER_ACCOUNTS_KEY = "krishna-users";

const LEGACY_SESSION_KEY = "krishna-user";

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
}

interface CustomerAccount extends CustomerUser {
  passwordHash: string;
  passwordSalt: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toCustomerUser = (value: unknown): CustomerUser | null => {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.email !== "string" ||
    typeof value.mobile !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    email: value.email,
    mobile: value.mobile,
  };
};

const readSession = (storage: Storage, key: string) => {
  try {
    const value = storage.getItem(key);
    if (!value) return null;
    const user = toCustomerUser(JSON.parse(value));
    if (!user) storage.removeItem(key);
    return user;
  } catch {
    storage.removeItem(key);
    return null;
  }
};

export const restoreCustomerSession = () => {
  const sessionUser = readSession(sessionStorage, CUSTOMER_SESSION_KEY);
  if (sessionUser) return sessionUser;

  const persistentUser = readSession(localStorage, CUSTOMER_SESSION_KEY);
  if (persistentUser) return persistentUser;

  const legacyUser = readSession(localStorage, LEGACY_SESSION_KEY);
  if (!legacyUser) return null;

  localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(legacyUser));
  localStorage.removeItem(LEGACY_SESSION_KEY);
  return legacyUser;
};

export const persistCustomerSession = (
  user: CustomerUser,
  rememberMe: boolean,
) => {
  localStorage.removeItem(CUSTOMER_SESSION_KEY);
  sessionStorage.removeItem(CUSTOMER_SESSION_KEY);
  localStorage.removeItem(LEGACY_SESSION_KEY);

  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(user));
};

export const clearCustomerSession = () => {
  localStorage.removeItem(CUSTOMER_SESSION_KEY);
  sessionStorage.removeItem(CUSTOMER_SESSION_KEY);
  localStorage.removeItem(LEGACY_SESSION_KEY);
};

const bytesToHex = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

const createPasswordSalt = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
};

const hashPassword = async (password: string, salt: string) => {
  const value = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", value);
  return bytesToHex(new Uint8Array(digest));
};

const parseAccount = async (value: unknown): Promise<CustomerAccount | null> => {
  const user = toCustomerUser(value);
  if (!user || !isRecord(value)) return null;

  if (
    typeof value.passwordHash === "string" &&
    typeof value.passwordSalt === "string"
  ) {
    return {
      ...user,
      passwordHash: value.passwordHash,
      passwordSalt: value.passwordSalt,
    };
  }

  if (typeof value.password === "string") {
    const passwordSalt = createPasswordSalt();
    return {
      ...user,
      passwordSalt,
      passwordHash: await hashPassword(value.password, passwordSalt),
    };
  }

  return null;
};

const readAndMigrateCustomerAccounts = async () => {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(CUSTOMER_ACCOUNTS_KEY) || "[]",
    );
    if (!Array.isArray(parsed)) return [];

    const accounts = (
      await Promise.all(parsed.map((value) => parseAccount(value)))
    ).filter((account): account is CustomerAccount => account !== null);

    localStorage.setItem(CUSTOMER_ACCOUNTS_KEY, JSON.stringify(accounts));
    return accounts;
  } catch {
    return [];
  }
};

let accountLoad: Promise<CustomerAccount[]> | null = null;

const loadCustomerAccounts = () => {
  if (!accountLoad) {
    accountLoad = readAndMigrateCustomerAccounts();
  }
  const currentLoad = accountLoad;
  return currentLoad.finally(() => {
    if (accountLoad === currentLoad) accountLoad = null;
  });
};

export const migrateCustomerAccounts = async () => {
  await loadCustomerAccounts();
};

export const authenticateCustomer = async (
  emailOrMobile: string,
  password: string,
) => {
  const identifier = emailOrMobile.trim().toLowerCase();
  const accounts = await loadCustomerAccounts();
  const account = accounts.find(
    (candidate) =>
      candidate.email.toLowerCase() === identifier ||
      candidate.mobile === emailOrMobile.trim(),
  );
  if (!account) return null;

  const passwordHash = await hashPassword(password, account.passwordSalt);
  if (passwordHash !== account.passwordHash) return null;

  return toCustomerUser(account);
};

export const createCustomerAccount = async (
  name: string,
  email: string,
  mobile: string,
  password: string,
) => {
  const accounts = await loadCustomerAccounts();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedMobile = mobile.trim();

  if (
    accounts.some(
      (account) =>
        account.email.toLowerCase() === normalizedEmail ||
        account.mobile === normalizedMobile,
    )
  ) {
    return null;
  }

  const user: CustomerUser = {
    id: `${Date.now()}-${crypto.randomUUID()}`,
    name: name.trim(),
    email: normalizedEmail,
    mobile: normalizedMobile,
  };
  const passwordSalt = createPasswordSalt();
  const account: CustomerAccount = {
    ...user,
    passwordSalt,
    passwordHash: await hashPassword(password, passwordSalt),
  };

  localStorage.setItem(
    CUSTOMER_ACCOUNTS_KEY,
    JSON.stringify([...accounts, account]),
  );
  return user;
};
