import React, { useEffect, useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';

const Header = () => {
  const navigate = useNavigate();
  const isAuth = useAuthStore((state) => state.isAuth); // Zustand에서 인증 상태 가져오기
  const logout = useAuthStore((state) => state.logout); // 로그아웃 함수
  const [notificationCount, setNotificationCount] = useState(0); // 알림 카운트
  const [unreadNotifications, setUnreadNotifications] = useState(false); // 읽지 않은 알림 여부
  const [popupMessages, setPopupMessages] = useState([]); // 팝업 알림 메시지 저장용 상태 추가
  const serverUrl = process.env.REACT_APP_SERVER_URL; // 환경 변수에서 서버 URL 가져오기

  const [ws, setWs] = useState(null); // WebSocket 상태 관리

  useEffect(() => {
    let socket; // WebSocket 변수
    const jwtToken = sessionStorage.getItem('token'); // sessionStorage에서 JWT 토큰 가져오기

    if (isAuth && jwtToken && serverUrl) {
        console.log("WebSocket을 연결 중...");

        // WebSocket 연결
        socket = new WebSocket(`ws://192.168.1.36/alarm?token=${encodeURIComponent(jwtToken)}`);

        socket.onopen = () => {
            console.log("WebSocket 연결 성공");
        };

        socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data); // 수신된 메시지를 JSON으로 변환
                console.log("수신된 알림 메시지 (JSON):", message);
                setNotificationCount((prevCount) => prevCount + 1); // 알림 카운트 증가
                setUnreadNotifications(true); // 읽지 않은 알림 표시

                // 팝업 알림 추가
                setPopupMessages((prevMessages) => [...prevMessages, message.content]);

                // 2초 후 알림 자동 삭제
                setTimeout(() => {
                  setPopupMessages((prevMessages) => prevMessages.slice(1)); // 첫 번째 메시지 삭제
                }, 3000);
            } catch (error) {
                console.log("수신된 알림 메시지 (텍스트):", event.data); // 텍스트 메시지를 출력
                setNotificationCount((prevCount) => prevCount + 1); // 알림 카운트 증가
                setUnreadNotifications(true); // 읽지 않은 알림 표시

                // 텍스트 메시지 팝업 알림 추가
                setPopupMessages((prevMessages) => [...prevMessages, event.data]);

                // 2초 후 알림 자동 삭제
                setTimeout(() => {
                  setPopupMessages((prevMessages) => prevMessages.slice(1)); // 첫 번째 메시지 삭제
                }, 3000);
            }
        };

        socket.onclose = () => {
            console.log("WebSocket 연결이 닫혔습니다.");
        };

        // WebSocket 오류 처리 추가
        socket.onerror = (error) => {
            console.error("WebSocket 오류:", error);
            alert("서버와의 연결에 실패했습니다."); // 사용자에게 오류 알림 표시
        };

        setWs(socket); // WebSocket 상태 저장
    }

    // 알림 카운트 초기화 - API 호출로 읽지 않은 알림 수 가져오기
    const fetchUnreadNotifications = async () => {
      const jwtToken = sessionStorage.getItem('token'); // sessionStorage에서 JWT 토큰 가져오기
      if (!jwtToken) {
        return;
      }

      try {
        const response = await fetch(`${serverUrl}/api/activities/unread`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const unreadData = await response.json();
          setNotificationCount(unreadData.length); // 읽지 않은 알림 수 설정
          setUnreadNotifications(unreadData.length > 0);
        } else {
          console.error("읽지 않은 알림을 가져오는 중 오류 발생:", response.statusText);
        }
      } catch (error) {
        console.error("알림 데이터를 가져오는 중 네트워크 오류 발생:", error); // fetch 예외 처리 추가
      }
    };

    fetchUnreadNotifications();

    return () => {
        if (socket) {
            socket.close(); // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
        }
    };
  }, [isAuth, serverUrl]);

  // 로고 클릭 시 메인 페이지로 이동하는 함수 정의
  const handleLogoClick = () => {
    navigate('/'); // 로고 클릭 시 메인 페이지로 이동
  };

  // 로그인 버튼 클릭 시 로그인 페이지로 이동하는 함수 정의
  const handleLoginClick = () => {
    navigate('/login'); // 로그인 페이지로 이동
  };

  // 수정된 handleAlarmClick 함수 - 읽지 않은 알림 카운트 즉시 업데이트
  const handleAlarmClick = () => {
    setNotificationCount(0); // 알림 카운트 초기화
    setUnreadNotifications(false); // 읽지 않은 알림이 없으므로 상태 변경

    navigate('/alarm', { state: { defaultTab: '활동' } }); // 활동 탭으로 이동
  };

  const handleLogout = () => {
    if (ws) {
      ws.close(); // 로그아웃 시 WebSocket 연결 해제
      console.log("WebSocket 연결 해제");
    }

    // 알림 상태 초기화
    setNotificationCount(0); 
    setUnreadNotifications(false);
    
    logout(); // Zustand에서 로그아웃 처리
    sessionStorage.removeItem('token'); // 토큰 제거

    navigate('/login'); // 로그인 페이지로 리디렉션
  };

  // 팝업 알림 UI 함수 추가
  const renderPopupNotifications = () => {
    return (
      <div className="popup-container">
        {popupMessages.map((msg, index) => (
          <div key={index} className="popup-notification">
            {msg}
          </div>
        ))}
      </div>
    );
  };

  return (
    <header className="header">
      {renderPopupNotifications()} {/* 팝업 알림 렌더링 */}
      <div
        className="header-section logo"
        onClick={handleLogoClick}
        role="button"
        tabIndex="0"
        onKeyPress={(e) => e.key === 'Enter' && handleLogoClick()}
      >
        9900
      </div>
      <div className="header-section search-container">
        <input className="search" type="text" placeholder="검색" />
      </div>
      <div className="header-section icon">
        <FontAwesomeIcon icon={faBookmark} className="faBookmark" />
        <div className="notification-wrapper" onClick={handleAlarmClick}>
          {/* 알림 아이콘 */}
          <FontAwesomeIcon icon={faBell} className={`faBell ${unreadNotifications ? 'active' : ''}`} />
          {/* 알림 카운트 표시 */}
          {notificationCount > 0 && (
            <span className="notification-count">{notificationCount}</span>
          )}
        </div>
      </div>
      <div className="header-section login-buttons">
        {isAuth ? (
          <button onClick={handleLogout}>로그아웃</button>
        ) : (
          <button onClick={handleLoginClick}>로그인</button>  
        )}
      </div>
    </header>
  );
}

export default Header;
