import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from '../utils/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  password: string;
  balance: number;
  depositAmount: number;
  currentEarnings: number;
  totalDeposits: number;
  activeTrades: number;
  tradingPeriodEnd: string;
  recentDeposits: Array<{
    id: string;
    amount: number;
    date: string;
    status: string;
  }>;
  profitAnimationEnabled: boolean;
  status: 'pending' | 'active';
  grokVersion?: string;
  tier?: string;
  walletAddress?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials (hardcoded, not exposed in UI)
const ADMIN_USERNAME = 'GrokGodadmin';
const ADMIN_PASSWORD = 'grokadmin123@,';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize database on mount
    const initialize = async () => {
      try {
        await api.initializeDatabase();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setIsInitialized(true); // Continue anyway
      }
    };
    
    initialize();

    // Check for existing session in sessionStorage (not localStorage)
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        sessionStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.login(username, password);
      
      if (response.success && response.user) {
        setUser(response.user);
        sessionStorage.setItem('currentUser', JSON.stringify(response.user));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('currentUser');
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Also update in database if not admin
      if (user.role !== 'admin') {
        try {
          await api.updateUser(user.username, updates);
        } catch (error) {
          console.error('Failed to update user in database:', error);
        }
      }
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, updateUser }}>
      {isInitialized ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// User management functions for admin
export async function getAllUsers(): Promise<User[]> {
  try {
    const response = await api.getAllUsers();
    return response.success ? response.users : [];
  } catch (error) {
    console.error('Failed to get users:', error);
    return [];
  }
}

export async function createUser(userData: Partial<User>): Promise<User> {
  try {
    const response = await api.createUser(userData);
    if (response.success) {
      return response.user;
    }
    throw new Error('Failed to create user');
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}

// Create a pending user (for signup flow)
export async function createPendingUser(userData: {
  username: string;
  password: string;
  grokVersion: string;
  tier: string;
  tierAmount: string;
  walletAddress: string;
}): Promise<User> {
  try {
    const response = await api.createPendingUser(userData);
    if (response.success) {
      return response.user;
    }
    throw new Error(response.error || 'Failed to create user');
  } catch (error) {
    console.error('Failed to create pending user:', error);
    throw error;
  }
}

// Activate a pending user
export async function activateUser(username: string): Promise<void> {
  try {
    const response = await api.activateUser(username);
    if (!response.success) {
      throw new Error('Failed to activate user');
    }
  } catch (error) {
    console.error('Failed to activate user:', error);
    throw error;
  }
}

export async function updateUserData(username: string, updates: Partial<User>): Promise<void> {
  try {
    const response = await api.updateUser(username, updates);
    if (!response.success) {
      throw new Error('Failed to update user');
    }
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
}

export async function deleteUser(username: string): Promise<void> {
  try {
    const response = await api.deleteUser(username);
    if (!response.success) {
      throw new Error('Failed to delete user');
    }
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
}

// Helper functions - REMOVED initializeUsers as it's now handled by the backend
// REMOVED loginFunction as it's now handled by the backend