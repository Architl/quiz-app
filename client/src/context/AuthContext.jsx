// Import necessary React hooks and axios for API calls
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create the AuthContext instance
const AuthContext = createContext();

// AuthProvider component to wrap around the app and provide auth state
export const AuthProvider = ({ children }) => {
  // Modal state controls
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Authenticated user state
  const [user, setUser] = useState(null);

  // Get token from local storage
  const token = localStorage.getItem("token");

  // On mount or when token changes, fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) return; // Skip if no token present
        const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data); // Set user data from response
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchUser();
  }, [token]);

  // Logout function: clear token and reset user state
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Provide all state and functions to children components via context
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        showLoginModal,
        setShowLoginModal,
        showSignupModal,
        setShowSignupModal,
        showAuthPrompt,
        setShowAuthPrompt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume AuthContext in other components
export const useAuth = () => useContext(AuthContext);
