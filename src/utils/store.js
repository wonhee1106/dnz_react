import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: sessionStorage.getItem('token'),
  isAuth: !!sessionStorage.getItem('token'),
  notifications: [],
  userId: null, 
  // bookmark : [],

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

  //   // 북마크 추가
  //   addBookmark: (restaurant) => set((state) => ({
  //     bookmarks: [...state.bookmarks, restaurant],
  //   })),

  //    // 북마크 제거
  // removeBookmark: (restaurantId) => set((state) => ({
  //   bookmarks: state.bookmarks.filter((res) => res.id !== restaurantId),
  // })),
}));
