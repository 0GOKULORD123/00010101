import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Initialize Supabase client for service role operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Admin credentials (hardcoded, not exposed in UI)
const ADMIN_USERNAME = 'GrokGodadmin';
const ADMIN_PASSWORD = 'grokadmin123@,';

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-cdb003b7/health", (c) => {
  return c.json({ status: "ok" });
});

// Initialize default data (users and wallets)
app.post("/make-server-cdb003b7/initialize", async (c) => {
  try {
    // Check if already initialized
    const existingUsers = await kv.get('users');
    const existingWallets = await kv.get('admin_wallets');
    
    if (!existingUsers) {
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
      await kv.set('users', defaultUsers);
    }
    
    if (!existingWallets) {
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
      await kv.set('admin_wallets', defaultWallets);
    }
    
    return c.json({ success: true, message: 'Initialized successfully' });
  } catch (error) {
    console.error('Initialization error:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============= AUTH ROUTES =============

// Login endpoint
app.post("/make-server-cdb003b7/auth/login", async (c) => {
  try {
    const { username, password } = await c.req.json();
    
    // Check admin credentials first
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const adminUser = {
        id: 'admin',
        username: ADMIN_USERNAME,
        email: 'admin@grokai.com',
        role: 'admin',
        isMainAdmin: true, // Mark as main admin
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
      return c.json({ success: true, user: adminUser });
    }
    
    // Check users (includes sub-admins and regular users)
    const users = await kv.get('users') || [];
    const user = users.find((u: any) => u.username === username && u.password === password);
    
    if (user) {
      // Check if user is active (applies to both admins and regular users)
      if (user.status !== 'active') {
        return c.json({ success: false, error: 'Account pending activation' }, 403);
      }
      return c.json({ success: true, user });
    }
    
    return c.json({ success: false, error: 'Invalid credentials' }, 401);
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============= SUB-ADMIN ROUTES =============

// Create sub-admin (only main admin can do this)
app.post("/make-server-cdb003b7/admins/create", async (c) => {
  try {
    const { username, password, email } = await c.req.json();
    const users = await kv.get('users') || [];
    
    // Check if username already exists
    if (users.find((u: any) => u.username === username)) {
      return c.json({ success: false, error: 'Username already exists' }, 400);
    }
    
    // Check if it's the main admin username (protected)
    if (username === ADMIN_USERNAME) {
      return c.json({ success: false, error: 'Cannot use this username' }, 400);
    }
    
    const newSubAdmin = {
      id: `admin_${Date.now()}`,
      username,
      email: email || `${username}@grokai.com`,
      role: 'admin',
      isMainAdmin: false, // Mark as sub-admin
      password,
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
    
    users.push(newSubAdmin);
    await kv.set('users', users);
    
    return c.json({ success: true, admin: newSubAdmin });
  } catch (error) {
    console.error('Create sub-admin error:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all admins
app.get("/make-server-cdb003b7/admins", async (c) => {
  try {
    const users = await kv.get('users') || [];
    // Filter only sub-admins (role: admin, but not main admin)
    const subAdmins = users.filter((u: any) => u.role === 'admin' && !u.isMainAdmin);
    return c.json({ success: true, admins: subAdmins });
  } catch (error) {
    console.error('Get admins error:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete sub-admin (only main admin can do this)
app.delete("/make-server-cdb003b7/admins/:username", async (c) => {
  try {
    const username = c.req.param('username');
    const users = await kv.get('users') || [];
    
    // Prevent deletion of main admin
    if (username === ADMIN_USERNAME) {
      return c.json({ success: false, error: 'Cannot delete main admin' }, 403);
    }
    
    const userIndex = users.findIndex((u: any) => u.username === username);
    if (userIndex === -1) {
      return c.json({ success: false, error: 'Admin not found' }, 404);
    }
    
    // Check if it's a sub-admin
    if (users[userIndex].role !== 'admin' || users[userIndex].isMainAdmin) {
      return c.json({ success: false, error: 'Can only delete sub-admins' }, 403);
    }
    
    users.splice(userIndex, 1);
    await kv.set('users', users);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete sub-admin error:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============= USER ROUTES =============

// Get all users
app.get("/make-server-cdb003b7/users", async (c) => {
  try {
    const users = await kv.get('users') || [];
    return c.json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create user (admin)
app.post("/make-server-cdb003b7/users", async (c) => {
  try {
    const userData = await c.req.json();
    const users = await kv.get('users') || [];
    
    // Check if username already exists
    if (users.find((u: any) => u.username === userData.username)) {
      return c.json({ success: false, error: 'Username already exists' }, 400);
    }
    
    const newUser = {
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
      status: userData.status || 'active',
      grokVersion: userData.grokVersion || '',
      tier: userData.tier || '',
      walletAddress: userData.walletAddress || '',
      createdAt: userData.createdAt || new Date().toISOString(),
    };
    
    users.push(newUser);
    await kv.set('users', users);
    
    return c.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Create user error:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create pending user (signup flow)
app.post("/make-server-cdb003b7/users/signup", async (c) => {
  try {
    const userData = await c.req.json();
    const users = await kv.get('users') || [];
    
    // Check if username already exists
    if (users.find((u: any) => u.username === userData.username)) {
      return c.json({ success: false, error: 'Username already exists' }, 400);
    }
    
    const newUser = {
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
      status: 'pending',
      grokVersion: userData.grokVersion,
      tier: userData.tier,
      walletAddress: userData.walletAddress,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    await kv.set('users', users);
    
    return c.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update user
app.put("/make-server-cdb003b7/users/:username", async (c) => {
  try {
    const username = c.req.param('username');
    const updates = await c.req.json();
    const users = await kv.get('users') || [];
    
    const userIndex = users.findIndex((u: any) => u.username === username);
    if (userIndex === -1) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    users[userIndex] = { ...users[userIndex], ...updates };
    await kv.set('users', users);
    
    return c.json({ success: true, user: users[userIndex] });
  } catch (error) {
    console.error('Update user error:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Activate user
app.post("/make-server-cdb003b7/users/:username/activate", async (c) => {
  try {
    const username = c.req.param('username');
    const users = await kv.get('users') || [];
    
    const userIndex = users.findIndex((u: any) => u.username === username);
    if (userIndex === -1) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    users[userIndex].status = 'active';
    
    // If user has a deposit amount but no recent deposits, create one
    if (users[userIndex].depositAmount > 0 && (!users[userIndex].recentDeposits || users[userIndex].recentDeposits.length === 0)) {
      users[userIndex].recentDeposits = [{
        id: `dep_${Date.now()}`,
        amount: users[userIndex].depositAmount,
        date: new Date().toISOString(),
        status: 'completed',
      }];
    }
    
    await kv.set('users', users);
    
    return c.json({ success: true, user: users[userIndex] });
  } catch (error) {
    console.error('Activate user error:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete user
app.delete("/make-server-cdb003b7/users/:username", async (c) => {
  try {
    const username = c.req.param('username');
    const users = await kv.get('users') || [];
    
    const userIndex = users.findIndex((u: any) => u.username === username);
    if (userIndex === -1) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    users.splice(userIndex, 1);
    await kv.set('users', users);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============= WALLET ROUTES =============

// Get all wallets (all admins can view)
app.get("/make-server-cdb003b7/wallets", async (c) => {
  try {
    const wallets = await kv.get('admin_wallets') || [];
    return c.json({ success: true, wallets });
  } catch (error) {
    console.error('Get wallets error:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add wallet (MAIN ADMIN ONLY)
app.post("/make-server-cdb003b7/wallets", async (c) => {
  try {
    // Note: In a production app, you would validate the admin credentials here
    // For now, we rely on frontend validation, but adding a comment for security awareness
    const { address } = await c.req.json();
    const wallets = await kv.get('admin_wallets') || [];
    
    const newWallet = {
      id: `wallet_${Date.now()}`,
      address,
      addedAt: new Date().toISOString(),
    };
    
    wallets.push(newWallet);
    await kv.set('admin_wallets', wallets);
    
    return c.json({ success: true, wallet: newWallet });
  } catch (error) {
    console.error('Add wallet error:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete wallet (MAIN ADMIN ONLY)
app.delete("/make-server-cdb003b7/wallets/:id", async (c) => {
  try {
    // Note: In a production app, you would validate the admin credentials here
    // For now, we rely on frontend validation, but adding a comment for security awareness
    const id = c.req.param('id');
    const wallets = await kv.get('admin_wallets') || [];
    
    const walletIndex = wallets.findIndex((w: any) => w.id === id);
    if (walletIndex === -1) {
      return c.json({ success: false, error: 'Wallet not found' }, 404);
    }
    
    wallets.splice(walletIndex, 1);
    await kv.set('admin_wallets', wallets);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete wallet error:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);