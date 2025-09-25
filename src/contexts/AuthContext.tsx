import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: Omit<User, "isAdmin"> & { isAdmin?: boolean }) => void;
  logout: () => void;
  toggleAdminRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  // Load user data from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("adminPanelUser");
    const isLoggedIn = localStorage.getItem("adminPanelLoggedIn") === "true";

    if (savedUser && isLoggedIn) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("adminPanelUser");
        localStorage.removeItem("adminPanelLoggedIn");
      }
    }
  }, []);

  const login = (userData: Omit<User, "isAdmin"> & { isAdmin?: boolean }) => {
    const newUser: User = {
      ...userData,
      isAdmin: userData.isAdmin ?? false,
    };

    setUser(newUser);
    setIsAuthenticated(true);

    // Persist to localStorage
    localStorage.setItem("adminPanelUser", JSON.stringify(newUser));
    localStorage.setItem("adminPanelLoggedIn", "true");
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("adminPanelUser");
    localStorage.removeItem("adminPanelLoggedIn");
  };

  const toggleAdminRole = () => {
    if (user) {
      const updatedUser = { ...user, isAdmin: !user.isAdmin };
      setUser(updatedUser);
      console.log("updated user: ", updatedUser);
      localStorage.setItem("adminPanelUser", JSON.stringify(updatedUser));

      // Navigate to /forms
      if (!updatedUser.isAdmin) {
        navigate("/forms");
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    toggleAdminRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
