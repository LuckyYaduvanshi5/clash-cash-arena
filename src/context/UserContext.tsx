
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface User {
  id: string;
  username: string;
  email: string;
  walletBalance: number;
  totalMatches: number;
  wins: number;
  losses: number;
  avatarUrl: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addFunds: (amount: number) => void;
  deductFunds: (amount: number) => boolean;
  updateUserStats: (win: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would call an API
      // For prototype, check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        // Remove password before setting user state
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        toast({
          title: "Welcome back!",
          description: `Logged in as ${foundUser.username}`,
          variant: "default",
        });
        return true;
      }
      
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would call an API
      // For prototype, save user to localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      const userExists = users.some((u: any) => u.email === email);
      
      if (userExists) {
        toast({
          title: "Registration failed",
          description: "Email already in use",
          variant: "destructive",
        });
        return false;
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password, // In a real app, this would be hashed
        walletBalance: 100, // Starting bonus
        totalMatches: 0,
        wins: 0,
        losses: 0,
        avatarUrl: `/avatars/avatar${Math.floor(Math.random() * 5) + 1}.png`,
      };
      
      // Save to users array
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Log user in (without password in the state)
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      
      toast({
        title: "Registration successful!",
        description: "Welcome to Clash Cash Arena!",
        variant: "default",
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
      variant: "default",
    });
  };

  const addFunds = (amount: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        walletBalance: user.walletBalance + amount
      };
      setUser(updatedUser);
      
      // Update user in users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: any) => 
        u.id === user.id ? { ...u, walletBalance: u.walletBalance + amount } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      toast({
        title: "Funds added!",
        description: `₹${amount} added to your wallet`,
        variant: "default",
      });
    }
  };

  const deductFunds = (amount: number): boolean => {
    if (user) {
      if (user.walletBalance >= amount) {
        const updatedUser = {
          ...user,
          walletBalance: user.walletBalance - amount
        };
        setUser(updatedUser);
        
        // Update user in users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map((u: any) => 
          u.id === user.id ? { ...u, walletBalance: u.walletBalance - amount } : u
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        return true;
      } else {
        toast({
          title: "Insufficient funds",
          description: "Please add money to your wallet",
          variant: "destructive",
        });
        return false;
      }
    }
    return false;
  };

  const updateUserStats = (win: boolean) => {
    if (user) {
      const updatedUser = {
        ...user,
        totalMatches: user.totalMatches + 1,
        wins: win ? user.wins + 1 : user.wins,
        losses: win ? user.losses : user.losses + 1
      };
      setUser(updatedUser);
      
      // Update user in users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: any) => 
        u.id === user.id ? { 
          ...u, 
          totalMatches: u.totalMatches + 1,
          wins: win ? u.wins + 1 : u.wins,
          losses: win ? u.losses : u.losses + 1
        } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      addFunds,
      deductFunds,
      updateUserStats
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
