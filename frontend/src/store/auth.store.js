import { create } from 'zustand';

export const useAuth = create((set) => ({
  token: null,
  setToken: (t) => set({ token: t })
}));
