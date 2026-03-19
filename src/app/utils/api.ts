import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-cdb003b7`;

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error(`API error on ${endpoint}:`, data);
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// ============= INITIALIZATION =============

export async function initializeDatabase() {
  return apiCall('/initialize', {
    method: 'POST',
  });
}

// ============= AUTH API =============

export async function login(username: string, password: string) {
  return apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// ============= USER API =============

export async function getAllUsers() {
  return apiCall('/users');
}

export async function createUser(userData: any) {
  return apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function createPendingUser(userData: {
  username: string;
  password: string;
  grokVersion: string;
  tier: string;
  tierAmount?: string;
  walletAddress: string;
}) {
  return apiCall('/users/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function updateUser(username: string, updates: any) {
  return apiCall(`/users/${username}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function activateUser(username: string) {
  return apiCall(`/users/${username}/activate`, {
    method: 'POST',
  });
}

export async function deleteUser(username: string) {
  return apiCall(`/users/${username}`, {
    method: 'DELETE',
  });
}

// ============= WALLET API =============

export async function getAllWallets() {
  return apiCall('/wallets');
}

export async function addWallet(address: string) {
  return apiCall('/wallets', {
    method: 'POST',
    body: JSON.stringify({ address }),
  });
}

export async function deleteWallet(id: string) {
  return apiCall(`/wallets/${id}`, {
    method: 'DELETE',
  });
}
