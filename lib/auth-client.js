// Helper functions for managing JWT tokens on client side

export const authClient = {
  // Get token from storage
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },
  
  // Save token to storage
  setToken: (token) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
  },
  
  // Remove token from storage
  removeToken: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
  },
  
  // Make authenticated request
  fetchWithAuth: async (url, options = {}) => {
    const token = authClient.getToken();
    
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
  }
};