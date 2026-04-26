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
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setUser: (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: (): User | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setView: (view: string) => {
    localStorage.setItem(VIEW_KEY, view);
  },

  getView: (): string | null => {
    return localStorage.getItem(VIEW_KEY);
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(VIEW_KEY);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};
