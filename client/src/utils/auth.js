import Cookies from "js-cookie";

export const handleLogout = () => {
  Cookies.remove("token");
  // Use window.location.href for a full page refresh
  window.location.href = "/login";
};

// export const setToken = (token) => {
//   // Set token with expiry time (e.g., 30 minutes)
//   Cookies.set("token", token, { expires: 1 / 48 });
// };

export const getToken = () => {
  console.log("Token from Cookies:", Cookies.get("token"));
  return Cookies.get("token");
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
