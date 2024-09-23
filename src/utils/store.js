import { create } from 'zustand';
import axios from 'axios'; // axios 추가

const serverUrl = process.env.REACT_APP_SERVER_URL; // 환경 변수로부터 서버 URL 가져오기

export const useAuthStore = create((set) => ({
  token: sessionStorage.getItem('token'), // sessionStorage에서 토큰 가져오기
  isAuth: !!sessionStorage.getItem('token'), // 토큰이 있으면 인증 상태 true
  notifications: [],
  notices: [], // 공지사항 상태 추가
  userId: null, 
  // bookmark : [],

  // 로그인 함수: 토큰과 사용자 ID 저장, 공지사항 불러오기
  login: async (token, userId) => {
    sessionStorage.setItem('token', token); // sessionStorage에 토큰 저장
    set({ token, isAuth: true, userId }); // 상태에 토큰, 인증 상태, 사용자 ID 설정

    // 로그인 시 공지사항 불러오기
    try {
      const response = await axios.get(`${serverUrl}/api/posts`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set({ notices: response.data }); // 공지사항을 상태에 저장
    } catch (err) {
      console.error("Error fetching notices during login:", err);
    }
  },

  // 로그아웃 함수: 토큰 및 상태 초기화
  logout: () => {
    sessionStorage.removeItem('token'); // sessionStorage에서 토큰 제거
    set({ token: null, isAuth: false, notifications: [], notices: [], userId: null });
  },

  // 알림 추가 함수
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, notification],
  })),

  // 모든 알림을 읽음 처리하는 함수
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((notif) => ({
      ...notif,
      read: true,
    })),
  })),


  // 공지사항 상태를 설정하는 함수
  setNotices: (notices) => set(() => ({ notices })),

  // 새로운 공지사항 추가 함수
  addNotice: (notice) => set((state) => ({
    notices: [...state.notices, notice],
  })),

  // 공지사항 수정 함수
  updateNotice: (updatedNotice) => set((state) => ({
    notices: state.notices.map((notice) =>
      notice.id === updatedNotice.id ? updatedNotice : notice
    ),
  })),

  // 공지사항 삭제 함수
  deleteNotice: (id) => set((state) => ({
    notices: state.notices.filter((notice) => notice.id !== id),
  })),

}));
