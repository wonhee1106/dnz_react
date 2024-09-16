import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: sessionStorage.getItem('token'), // 새로고침 시 토큰이 있는지 확인
  isAuth: !!sessionStorage.getItem('token'), // 토큰이 있으면 인증 상태 유지
  notifications: [], // 알림 초기값

  login: (token) => {
    sessionStorage.setItem('token', token); // 토큰 저장
    set({ token, isAuth: true });
  },
  logout: () => {
    sessionStorage.removeItem('token'); // 로그아웃 시 토큰 삭제
    set({ token: null, isAuth: false, notifications: [] });
  },

  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, notification], // 새로운 알림 추가
  })),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((notif) => ({
      ...notif,
      read: true, // 모든 알림을 읽음 처리
    })),
  })),
}));
