
import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: "student" | "admin") => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS = [
  { id: "1", name: "Admin User", email: "admin@campus.edu", password: "admin123", role: "admin" as const },
  { id: "2", name: "Student User", email: "student@campus.edu", password: "student123", role: "student" as const },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem("campusConnectUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: "student" | "admin") => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(
      u => u.email === email && u.password === password && u.role === role
    );

    if (!foundUser) {
      setLoading(false);
      throw new Error("Invalid credentials");
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem("campusConnectUser", JSON.stringify(userWithoutPassword));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("campusConnectUser");
  };

  const isAdmin = () => user?.role === "admin";

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
