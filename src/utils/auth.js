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
