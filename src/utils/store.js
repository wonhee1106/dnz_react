import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: sessionStorage.getItem('token'),
  isAuth: !!sessionStorage.getItem('token'),
  notifications: [],
  userId: null, 

  login: (token, userId) => {
    sessionStorage.setItem('token', token);
    set({ token, isAuth: true, userId }); 
  },
  logout: () => {
    sessionStorage.removeItem('token');
    set({ token: null, isAuth: false, notifications: [], userId: null });
  },

  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, notification],
  })),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((notif) => ({
      ...notif,
      read: true,
    })),
  })),
}));
