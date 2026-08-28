/**
 * authStore.js — Zustand store for authentication state.
 * Persists token + user to localStorage so login survives page refreshes.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      /** Called after successful login or register */
      setAuth: ({ user, token }) => {
        set({ user, token, isAuthenticated: true });
      },

      /** Update user profile data (e.g. after /me refetch) */
      setUser: (user) => set({ user }),

      /** Clear all auth state */
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      /** Convenience getters */
      isAdmin: () => get().user?.role === 'admin',
      isStaff: () => get().user?.role === 'staff',
      isStudent: () => get().user?.role === 'student',
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
