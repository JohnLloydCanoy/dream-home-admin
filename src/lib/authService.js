import { jwtDecode } from "jwt-decode";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export const loginAdmin = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        username: email, 
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error("Invalid email or password.");
    }

    const tokens = await response.json();
    
    // 🛡️ SECURITY CHECK: Decode the token to verify the role
    const decoded = jwtDecode(tokens.access);
    const role = decoded.role?.toUpperCase();

    
    if (role === "STAFF" || role === "ADMIN") {
      localStorage.setItem("adminAccessToken", tokens.access);
      localStorage.setItem("adminRefreshToken", tokens.refresh);
      return { tokens, role };
    } else {
      // If a Renter tries to log in, we reject them from the Admin Portal
      throw new Error("Access Denied: You do not have administrative privileges.");
    }

  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Admin Login Error:", error);
    }
    throw new Error(error.message || "Failed to connect to the server.");
  }
};

/**
 * logoutAdmin: Clears the specific admin tokens.
 */
export const logoutAdmin = () => {
  localStorage.removeItem("adminAccessToken");
  localStorage.removeItem("adminRefreshToken");
};

/**
 * getAdminToken: Helper to get the token for API calls
 */
export const getAdminToken = () => {
  return localStorage.getItem("adminAccessToken");
};