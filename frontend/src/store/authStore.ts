// src/store/authStore.ts
import create from 'zustand';
import api from '../services/api';
interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  signIn: async (username, password) => {
    set({ loading: true });
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

    const response = await api.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
      const { access_token } = response.data;

      localStorage.setItem('token', access_token);
      const userDate = await api.get('/');
      const user = userDate.data.User;
      localStorage.setItem('user_id', user.id);
      localStorage.setItem('username', user.username);
      localStorage.setItem('email', user.email);
      set({ user: user.username, loading: false, error: null });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Sign in failed', loading: false });
      throw error;
    }
  },
  signUp: async (email, username, password) => {
    set({ loading: true });
    try {
      await api.post('/auth', { username, email, password });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Sign up failed', loading: false });
      throw error;
    }
  },
  signOut: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    set({ user: null });
  },
}));

export default useAuthStore;
