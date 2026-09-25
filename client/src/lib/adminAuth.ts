export const ADMIN_SESSION_KEY = "krishna-admin-session";

export const isAdminAuthenticated = () =>
  sessionStorage.getItem(ADMIN_SESSION_KEY) === "authenticated";

export const signOutAdmin = () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
};
