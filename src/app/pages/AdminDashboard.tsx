import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Cpu,
  LogOut,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Wallet,
  Copy,
  Check,
  Clock,
  CheckCircle,
  Edit2,
  X,
  User,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAllUsers, createUser, updateUserData, deleteUser, activateUser } from '../contexts/AuthContext';
import * as api from '../utils/api';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  username: string;
  password: string;
  balance: number;
  depositAmount: number;
  currentEarnings: number;
  activeTrades: number;
  tradingPeriodEnd: string;
  profitAnimationEnabled: boolean;
  recentDeposits: Array<{
    id: string;
    amount: number;
    date: string;
    status: string;
  }>;
  status: 'active' | 'pending' | 'inactive';
  role: 'user' | 'admin';
  grokVersion: string;
  tier: string;
  email: string;
  walletAddress: string;
  createdAt: string;
}

interface WalletAddress {
  id: string;
  address: string;
  addedAt: string;
}

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [wallets, setWallets] = useState<WalletAddress[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending'>('all');
  
  // New user form
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [newDeposit, setNewDeposit] = useState('');
  const [newEarnings, setNewEarnings] = useState('');
  const [newActiveTrades, setNewActiveTrades] = useState('');
  const [newTradingPeriodDays, setNewTradingPeriodDays] = useState('30');
  
  // New wallet form
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [showWalletForm, setShowWalletForm] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  const loadUsers = async () => {
    const allUsers = await getAllUsers();
    setUsers(allUsers as AdminUser[]);
  };

  const loadWallets = async () => {
    try {
      const response = await api.getAllWallets();
      if (response.success) {
        setWallets(response.wallets);
      }
    } catch (error) {
      console.error('Failed to load wallets:', error);
    }
  };

  // Load users and wallets from database
  useEffect(() => {
    loadUsers();
    loadWallets();
  }, []);
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  const handleAddWallet = async () => {
    if (!newWalletAddress.trim()) {
      toast.error('Please enter a wallet address');
      return;
    }
    
    try {
      await api.addWallet(newWalletAddress.trim());
      await loadWallets();
      setNewWalletAddress('');
      setShowWalletForm(false);
      toast.success('Wallet address added successfully');
    } catch (error) {
      toast.error('Failed to add wallet address');
    }
  };
  
  const handleDeleteWallet = async (id: string) => {
    if (confirm('Are you sure you want to delete this wallet address?')) {
      try {
        await api.deleteWallet(id);
        await loadWallets();
        toast.success('Wallet address deleted');
      } catch (error) {
        toast.error('Failed to delete wallet address');
      }
    }
  };
  
  const handleCopyWallet = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedWallet(address);
    toast.success('Wallet address copied to clipboard');
    setTimeout(() => setCopiedWallet(null), 2000);
  };
  
  const handleActivateUser = async (username: string) => {
    if (confirm(`Are you sure you want to activate user "${username}"?`)) {
      try {
        await activateUser(username);
        await loadUsers();
        toast.success('User activated successfully! They can now login.');
      } catch (error) {
        toast.error('Failed to activate user');
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteUser = async (username: string) => {
    if (confirm(`Are you sure you want to delete user "${username}"?`)) {
      try {
        await deleteUser(username);
        await loadUsers();
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleToggleProfitAnimation = async (username: string, isEnabled: boolean) => {
    try {
      await updateUserData(username, {
        profitAnimationEnabled: !isEnabled,
      });
      await loadUsers();
      toast.success('Profit animation toggled successfully');
    } catch (error) {
      toast.error('Failed to toggle profit animation');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Cpu className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <div className="absolute -top-1 -right-1 bg-green-500 text-black text-[8px] px-1 rounded font-bold">
                  BETA
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                GROK AI
              </span>
              <div className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg">
                <span className="text-red-400 text-xs font-bold">ADMIN</span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Page title */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-white/60">Manage users, wallets, and monitor platform activity</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="p-4 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span className="text-white/60 text-xs sm:text-sm">Total Users</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white">{users.length}</div>
              <div className="text-xs text-white/40 mt-1">
                {users.filter(u => u.status === 'active').length} active, {users.filter(u => u.status === 'pending').length} pending
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span className="text-white/60 text-xs sm:text-sm">Total Balance</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                ${users.reduce((sum, u) => sum + u.balance, 0).toLocaleString()}
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span className="text-white/60 text-xs sm:text-sm">Total Earnings</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                ${users.reduce((sum, u) => sum + u.currentEarnings, 0).toLocaleString()}
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span className="text-white/60 text-xs sm:text-sm">Wallet Addresses</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white">{wallets.length}</div>
            </div>
          </div>

          {/* Wallet Management Section */}
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Wallet Management</h2>
                <p className="text-xs sm:text-sm text-white/60">Manage wallet addresses shown to users when they select a plan</p>
              </div>
              <button
                onClick={() => setShowWalletForm(!showWalletForm)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black hover:bg-green-400 rounded-lg font-medium transition-all text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Wallet
              </button>
            </div>

            {/* Add Wallet Form */}
            {showWalletForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10"
              >
                <h3 className="text-white font-bold mb-4 text-sm sm:text-base">Add New Wallet Address</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter wallet address (e.g., 0x1234...)"
                    value={newWalletAddress}
                    onChange={(e) => setNewWalletAddress(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddWallet}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black hover:bg-green-400 rounded-lg font-medium transition-all text-sm"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowWalletForm(false);
                        setNewWalletAddress('');
                      }}
                      className="px-4 py-2 bg-white/5 text-white hover:bg-white/10 rounded-lg font-medium transition-all text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Wallets List */}
            {wallets.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">No wallet addresses added yet</p>
                <p className="text-white/30 text-xs mt-1">Add wallet addresses to show them to users</p>
              </div>
            ) : (
              <div className="space-y-3">
                {wallets.map((wallet) => (
                  <motion.div
                    key={wallet.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-all gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Wallet className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <code className="text-white font-mono text-xs sm:text-sm break-all">
                          {wallet.address}
                        </code>
                      </div>
                      <p className="text-white/40 text-xs">
                        Added {new Date(wallet.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleCopyWallet(wallet.address)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-xs sm:text-sm"
                      >
                        {copiedWallet === wallet.address ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-green-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-white">Copy</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteWallet(wallet.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all text-xs sm:text-sm text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* User Management Section */}
          <div className="p-4 sm:p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">User Management</h2>
                <p className="text-xs sm:text-sm text-white/60">Create and manage user accounts</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Status Filter */}
                <div className="flex items-center gap-2 p-1 bg-white/5 rounded-lg">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      statusFilter === 'all'
                        ? 'bg-green-500 text-black'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setStatusFilter('active')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      statusFilter === 'active'
                        ? 'bg-green-500 text-black'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setStatusFilter('pending')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      statusFilter === 'pending'
                        ? 'bg-yellow-500 text-black'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Pending
                  </button>
                </div>
                
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black hover:bg-green-400 rounded-lg font-medium transition-all text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create User
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider hidden sm:table-cell">
                        Grok Version
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider hidden lg:table-cell">
                        Tier
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider hidden md:table-cell">
                        Earnings
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider hidden lg:table-cell">
                        Profit Anim
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users
                      .filter(user => {
                        if (statusFilter === 'all') return true;
                        return user.status === statusFilter;
                      })
                      .filter(user => user.role !== 'admin')
                      .map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-4">
                            <div>
                              <div className="text-white font-medium text-sm">{user.username}</div>
                              <div className="text-white/40 text-xs">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {user.status === 'pending' ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 text-xs font-medium">
                                <Clock className="w-3 h-3" />
                                Pending
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-500 text-xs font-medium">
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 hidden sm:table-cell">
                            <div className="text-white/60 text-sm">{user.grokVersion || 'N/A'}</div>
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            <div className="text-white/60 text-sm">{user.tier || 'N/A'}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-white font-medium text-sm">
                              ${user.balance.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <div className="text-green-500 font-medium text-sm">
                              +${user.currentEarnings.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            {user.status === 'active' && (
                              <button
                                onClick={() => handleToggleProfitAnimation(user.username, user.profitAnimationEnabled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  user.profitAnimationEnabled ? 'bg-green-500' : 'bg-white/20'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    user.profitAnimationEnabled ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {user.status === 'pending' ? (
                                <button
                                  onClick={() => handleActivateUser(user.username)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-all text-xs text-green-500 font-medium"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Activate
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsEditModalOpen(true);
                                  }}
                                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                >
                                  <Eye className="w-4 h-4 text-green-500" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteUser(user.username)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                {users.filter(user => {
                  if (statusFilter === 'all') return user.role !== 'admin';
                  return user.status === statusFilter && user.role !== 'admin';
                }).length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">
                      {statusFilter === 'pending' 
                        ? 'No pending users' 
                        : statusFilter === 'active'
                        ? 'No active users'
                        : 'No users found'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <CreateUserModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            loadUsers();
            setIsCreateModalOpen(false);
          }}
        />
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            loadUsers();
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}

// Create User Modal Component
function CreateUserModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    balance: 0,
    depositAmount: 0,
    currentEarnings: 0,
    totalDeposits: 0,
    activeTrades: 0,
    tradingPeriodEnd: '',
    profitAnimationEnabled: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      createUser({
        ...formData,
        recentDeposits: formData.depositAmount > 0 ? [{
          id: 'dep1',
          amount: formData.depositAmount,
          date: new Date().toISOString().split('T')[0],
          status: 'Completed',
        }] : [],
      });
      
      toast.success('User created successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Create New User</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/80 mb-2">Username*</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-2">Email*</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm text-white/80 mb-2">Password*</label>
              <input
                type="text"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter user password"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40"
              />
              <p className="text-xs text-white/40 mt-1">User will use this password to login</p>
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-2">Balance</label>
              <input
                type="number"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-2">Deposit Amount</label>
              <input
                type="number"
                value={formData.depositAmount}
                onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-2">Current Earnings</label>
              <input
                type="number"
                value={formData.currentEarnings}
                onChange={(e) => setFormData({ ...formData, currentEarnings: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-2">Active Trades</label>
              <input
                type="number"
                value={formData.activeTrades}
                onChange={(e) => setFormData({ ...formData, activeTrades: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm text-white/80 mb-2">Trading Period End Date</label>
              <input
                type="date"
                value={formData.tradingPeriodEnd}
                onChange={(e) => setFormData({ ...formData, tradingPeriodEnd: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-green-500 text-black font-medium rounded-lg hover:bg-green-400 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Create User
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Edit User Modal Component
function EditUserModal({ user, onClose, onSuccess }: { user: AdminUser; onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    balance: user.balance,
    depositAmount: user.depositAmount,
    currentEarnings: user.currentEarnings,
    activeTrades: user.activeTrades,
    tradingPeriodEnd: user.tradingPeriodEnd,
    profitAnimationEnabled: user.profitAnimationEnabled,
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Check if depositAmount changed
      const depositChanged = formData.depositAmount !== user.depositAmount;
      const depositIncreased = formData.depositAmount > user.depositAmount;
      
      // Prepare recent deposits update
      let updatedRecentDeposits = [...(user.recentDeposits || [])];
      
      // If deposit amount increased, add a new deposit entry
      if (depositChanged && depositIncreased) {
        const newDepositAmount = formData.depositAmount - user.depositAmount;
        updatedRecentDeposits.unshift({
          id: `dep_${Date.now()}`,
          amount: newDepositAmount,
          date: new Date().toISOString(),
          status: 'completed',
        });
      }
      
      updateUserData(user.username, {
        ...formData,
        totalDeposits: formData.depositAmount,
        recentDeposits: updatedRecentDeposits,
      });
      
      toast.success('User updated successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sm:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">User Profile: {user.username}</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Information Section */}
        <div className="mb-6 p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
          <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-green-500" />
            Account Information
          </h4>
          
          {/* Username */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <span className="text-white/60 text-sm block mb-1">Username</span>
              <span className="text-white font-medium">{user.username}</span>
            </div>
            <button
              onClick={() => handleCopy(user.username, 'Username')}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              {copiedField === 'Username' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-white/60" />
              )}
            </button>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <span className="text-white/60 text-sm block mb-1">Password</span>
              <span className="text-white font-medium font-mono">{user.password}</span>
            </div>
            <button
              onClick={() => handleCopy(user.password, 'Password')}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              {copiedField === 'Password' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-white/60" />
              )}
            </button>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <span className="text-white/60 text-sm block mb-1">Email</span>
              <span className="text-white font-medium">{user.email}</span>
            </div>
            <button
              onClick={() => handleCopy(user.email, 'Email')}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              {copiedField === 'Email' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-white/60" />
              )}
            </button>
          </div>

          {/* Grok Version */}
          {user.grokVersion && (
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <span className="text-white/60 text-sm block mb-1">Grok Version</span>
                <span className="text-green-500 font-medium">{user.grokVersion}</span>
              </div>
            </div>
          )}

          {/* Tier */}
          {user.tier && (
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <span className="text-white/60 text-sm block mb-1">Investment Tier</span>
                <span className="text-white font-medium">{user.tier}</span>
              </div>
            </div>
          )}

          {/* Wallet Address */}
          {user.walletAddress && (
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex-1 min-w-0 mr-2">
                <span className="text-white/60 text-sm block mb-1">Wallet Address</span>
                <code className="text-white font-mono text-sm break-all">{user.walletAddress}</code>
              </div>
              <button
                onClick={() => handleCopy(user.walletAddress || '', 'Wallet Address')}
                className="p-2 hover:bg-white/10 rounded-lg transition-all flex-shrink-0"
              >
                {copiedField === 'Wallet Address' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-white/60" />
                )}
              </button>
            </div>
          )}

          {/* Created At */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <span className="text-white/60 text-sm block mb-1">Account Created</span>
              <span className="text-white font-medium">
                {new Date(user.createdAt || Date.now()).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Deposits Section */}
        {user.recentDeposits && user.recentDeposits.length > 0 && (
          <div className="mb-6 p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10">
            <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Recent Deposits
            </h4>
            <div className="space-y-2">
              {user.recentDeposits.map((deposit) => (
                <div key={deposit.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <span className="text-white font-medium">${deposit.amount.toLocaleString()}</span>
                    <span className="text-white/40 text-xs ml-2">
                      {new Date(deposit.date).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-green-500 text-xs font-medium">{deposit.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Trading Settings Form */}
        <div className="mb-6 p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-green-500" />
            Edit Trading Settings
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/80 mb-2">Balance</label>
                <input
                  type="number"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">Deposit Amount</label>
                <input
                  type="number"
                  value={formData.depositAmount}
                  onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">Current Earnings</label>
                <input
                  type="number"
                  value={formData.currentEarnings}
                  onChange={(e) => setFormData({ ...formData, currentEarnings: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">Active Trades</label>
                <input
                  type="number"
                  value={formData.activeTrades}
                  onChange={(e) => setFormData({ ...formData, activeTrades: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm text-white/80 mb-2">Trading Period End Date</label>
                <input
                  type="date"
                  value={formData.tradingPeriodEnd}
                  onChange={(e) => setFormData({ ...formData, tradingPeriodEnd: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 py-3 bg-green-500 text-black font-medium rounded-lg hover:bg-green-400 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}