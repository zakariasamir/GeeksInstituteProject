export const handleLogout = () => {
  localStorage.removeItem("token");
  // Use window.location.href for a full page refresh
  window.location.href = "/login";
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Add a small buffer (e.g., 5 seconds) to prevent edge cases
    return payload.exp * 1000 < Date.now() - 5000;
  } catch (error) {
    return true;
  }
};
