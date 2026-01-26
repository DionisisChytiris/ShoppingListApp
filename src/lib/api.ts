import AsyncStorage from '@react-native-async-storage/async-storage';

// Update this to your backend URL
// For local development: 'http://localhost:3000'
// For Android emulator: 'http://10.0.2.2:3000'
// For iOS simulator: 'http://localhost:3000'
// For physical device: 'http://YOUR_COMPUTER_IP:3000'
const API_BASE_URL = __DEV__ 
  ? 'https://shopping-list-backend-nu.vercel.app' // Change to your IP for physical device testing
  : 'https://shopping-list-backend-nu.vercel.app';
// const API_BASE_URL = __DEV__ 
//   ? 'http://localhost:5000' // Change to your IP for physical device testing
//   : 'https://shopping-list-backend-nu.vercel.app/';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = await this.getToken();
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      return response;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async get(endpoint: string): Promise<any> {
    const response = await this.request(endpoint, { method: 'GET' });
    return this.handleResponse(response);
  }

  async post(endpoint: string, data: any): Promise<any> {
    const response = await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async put(endpoint: string, data: any): Promise<any> {
    const response = await this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async delete(endpoint: string): Promise<any> {
    const response = await this.request(endpoint, { method: 'DELETE' });
    return this.handleResponse(response);
  }

  private async handleResponse(response: Response): Promise<any> {
    const data = await response.json();

    if (!response.ok) {
      // Handle validation errors (array format)
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        const errorMessages = data.errors.map((err: any) => err.msg || err.message).join(', ');
        throw new Error(errorMessages);
      }
      // Handle single message format
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  }
}

export const api = new ApiClient(API_BASE_URL);

// Auth API methods
export const authApi = {
  signup: async (email: string, password: string, name?: string) => {
    const data = await api.post('/api/auth/signup', { email, password, name });
    if (data.token) {
      await AsyncStorage.setItem('authToken', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  },

  login: async (email: string, password: string) => {
    const data = await api.post('/api/auth/login', { email, password });
    if (data.token) {
      await AsyncStorage.setItem('authToken', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    return await api.get('/api/auth/me');
  },

  isAuthenticated: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  },
};
