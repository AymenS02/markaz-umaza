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
    
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json'
    };
    
    // Only add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return fetch(url, {
      ...options,
      headers
    });
  }
};