const TOKEN_KEY = 'task_remainder_token';
const USER_KEY = 'task_remainder_user';
const VIEW_KEY = 'task_remainder_view';

export interface User {
  id: number;
  email: string;
  name: string;
}

export const authUtils = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setUser: (user: User) => {
    if (typeof window !== 'undefined') localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setView: (view: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(VIEW_KEY, view);
  },

  getView: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(VIEW_KEY);
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(VIEW_KEY);
    }
  },

  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(TOKEN_KEY);
  }
};
