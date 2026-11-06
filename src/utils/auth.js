export const getToken = () =>
  localStorage.getItem("access_token") ||
  sessionStorage.getItem("access_token");

export const getLoggedInUser = () => {
  const user =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Invalid user data:", error);
    return null;
  }
};

export const getUserRole = () => {
  const user = getLoggedInUser();
  return user?.role || null;
};

export const hasRole = (allowedRoles) => {
  const role = getUserRole();
  return allowedRoles.includes(role);
};

export const clearAuth = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("user");
};

export const saveAuth = (accessToken, user, rememberMe) => {
  clearAuth();
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem("access_token", accessToken);
  storage.setItem("user", JSON.stringify(user));
};
