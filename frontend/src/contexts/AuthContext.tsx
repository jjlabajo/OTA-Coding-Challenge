"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  user: any | null;
  setUser: (user: any | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  rerender: number;
  setRerender: (rerender: number | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [rerender, setRerender] = useState<number>(0)

  // Function to handle logout
    const logout = async () => {
        try {
            // Clear authentication data
            setIsAuthenticated(false);
            setUser(null);
            setToken(null);
            // Remove from localStorage if you are using it
            if (typeof window !== 'undefined') {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user'); // Also remove user from local storage
            }

            // Redirect to login page
            router.push('/login');
        } catch (error) {
            console.error('Error during logout:', error);
            // Handle network errors
        }
    };

  // Effect to check authentication status on initial load or route change
    useEffect(() => {
        const checkAuthStatus = async () => {
            if (typeof window !== 'undefined') {
                const storedToken = localStorage.getItem('authToken');
                const storedUser = localStorage.getItem('user'); // Get user from local storage

                if (storedToken) {
                    setToken(storedToken);
                    try {
                        // You might want to validate the token with your backend here.
                        // For this example, we'll just assume it's valid.
                        const userData = storedUser ? JSON.parse(storedUser) : null;
                        setIsAuthenticated(true);
                        setUser(userData); // Set the user
                    } catch (error) {
                        console.error("Error parsing user data", error);
                        setIsAuthenticated(false);
                        setUser(null);
                        setToken(null);
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('user');
                    }

                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                    setToken(null);
                    const publicRoutes = ['/login', '/signup'];
                    if (!publicRoutes.includes(pathname)) {
                      // router.push('/login'); // Removed:  Conditional redirecting can cause issues
                    }
                }
            }
        };

        checkAuthStatus();
    }, [pathname]);

    // Store token and user in localStorage whenever they change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('authToken', token);
            } else {
                localStorage.removeItem('authToken');
            }
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user');
            }
        }
    }, [token, user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, token, setToken, logout, rerender, setRerender }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
