import React, { useEffect, useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from 'utils/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBookmark, faUser } from '@fortawesome/free-regular-svg-icons';
import { api } from '../../config/config'; // API 요청을 위한 Axios 설정 불러오기

const Header = () => {
  const navigate = useNavigate();
  const isAuth = useAuthStore((state) => state.isAuth); // Zustand에서 인증 상태 가져오기
  const logout = useAuthStore((state) => state.logout); // 로그아웃 함수
  const [notificationCount, setNotificationCount] = useState(0); // 알림 카운트
  const [unreadNotifications, setUnreadNotifications] = useState(false); // 읽지 않은 알림 여부
  const [popupMessages, setPopupMessages] = useState([]); // 팝업 알림 메시지 저장용 상태 추가
  const [searchQuery, setSearchQuery] = useState(''); // 검색 입력값 상태
  const serverUrl = process.env.REACT_APP_SERVER_URL; // 환경 변수에서 서버 URL 가져오기
  const [ws, setWs] = useState(null); // WebSocket 상태 관리

  // 페이지 로드 시 읽지 않은 알림을 서버에서 가져오는 useEffect
  useEffect(() => {
    const jwtToken = sessionStorage.getItem('token');
    if (isAuth && jwtToken) {
      api.get(`${serverUrl}/api/activities/unread`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      })
        .then((response) => {
          const unreadActivities = response.data;
          setNotificationCount(unreadActivities.length); // 실제 읽지 않은 알림 갯수 설정
          setUnreadNotifications(unreadActivities.length > 0); // 읽지 않은 알림 여부 설정
        })
        .catch((error) => {
          console.error('알림을 불러오는 중 오류 발생:', error);
        });
    }
  }, [isAuth, serverUrl]);

  // WebSocket 연결 및 알림 수신 로직
  useEffect(() => {
    const jwtToken = sessionStorage.getItem('token');

    if (isAuth && jwtToken && serverUrl && !ws) {
      // WebSocket이 이미 연결되지 않은 경우에만 연결
      const socket = new WebSocket(`${serverUrl}/alarm?token=${encodeURIComponent(jwtToken)}`);

      socket.onopen = () => {
        console.log('WebSocket 연결 성공');
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('수신된 알림 메시지 (JSON):', message);

          // 수신 후 서버에서 실제 읽지 않은 알림 갯수 다시 가져오기
          api.get(`${serverUrl}/api/activities/unread`, {
            headers: { Authorization: `Bearer ${jwtToken}` },
          })
            .then((response) => {
              const unreadActivities = response.data;
              setNotificationCount(unreadActivities.length); // 읽지 않은 알림 갯수 업데이트
              setUnreadNotifications(unreadActivities.length > 0); // 읽지 않은 알림 상태 업데이트
            })
            .catch((error) => {
              console.error('알림을 불러오는 중 오류 발생:', error);
            });

          // 팝업 알림 추가
          setPopupMessages((prevMessages) => [...prevMessages, message.content]);

          // 3초 후 팝업 알림 자동 삭제
          setTimeout(() => {
            setPopupMessages((prevMessages) => prevMessages.slice(1));
          }, 3000);
        } catch (error) {
          // 메시지가 JSON 형식이 아닌 경우
          setNotificationCount((prevCount) => prevCount + 1); // 알림 카운트 증가
          setUnreadNotifications(true);

          // 텍스트 메시지 팝업 알림 추가
          setPopupMessages((prevMessages) => [...prevMessages, event.data]);

          // 3초 후 팝업 알림 자동 삭제
          setTimeout(() => {
            setPopupMessages((prevMessages) => prevMessages.slice(1));
          }, 3000);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket 연결이 닫혔습니다.');
        setWs(null); // WebSocket 연결이 닫히면 상태 초기화
      };

      socket.onerror = (error) => {
        console.error('WebSocket 오류:', error);
        alert('서버와의 연결에 실패했습니다.');
      };

      setWs(socket); // WebSocket 상태 업데이트
    }

    // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
    return () => {
      if (ws) {
        ws.close();
        setWs(null);
      }
    };
  }, [isAuth, serverUrl, ws]); // WebSocket 연결 중복 방지를 위해 ws를 의존성에 추가

  // 로고 클릭 시 메인 페이지로 이동하는 함수 정의
  const handleLogoClick = () => {
    navigate('/');
  };

  // 로그인 버튼 클릭 시 로그인 페이지로 이동하는 함수 정의
  const handleLoginClick = () => {
    navigate('/login');
  };

  // 알람 아이콘 클릭 시 호출되는 함수
  const handleAlarmClick = () => {
    setUnreadNotifications(false); // 알림 상태 초기화
    setNotificationCount(0); // 알림 카운트 초기화
    navigate('/alarm', { state: { defaultTab: '활동' } }); // 활동 탭으로 이동
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    if (ws) {
      ws.close(); // 로그아웃 시 WebSocket 연결 해제
      console.log('WebSocket 연결 해제');
    }

    setNotificationCount(0); // 알림 상태 초기화
    setUnreadNotifications(false);

    logout(); // Zustand에서 로그아웃 처리
    sessionStorage.removeItem('token'); // 토큰 제거

    navigate('/login'); // 로그인 페이지로 리디렉션
  };

  // 검색 입력값 변경 시 호출되는 함수
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 검색 키 입력 핸들러
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  // 검색 로직 구현
  const performSearch = () => {
    const query = searchQuery.trim();

    // 검색어에 따른 카테고리 매핑
    const categoryMapping = {
      한식: 'korean',
      중식: 'chinese',
      양식: 'western',
      일식: 'japanese',
    };

    if (categoryMapping[query]) {
      // 해당 카테고리 섹션으로 스크롤 이동
      const element = document.getElementById(categoryMapping[query]);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // 매칭되는 카테고리가 없을 경우 경고 메시지 표시
      alert('해당 카테고리를 찾을 수 없습니다.');
    }
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
        <input
          className="search"
          type="text"
          placeholder="음식 카테고리 항목을 입력해주세요"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyPress={handleSearchKeyPress}
        />
      </div>

      <div className="header-section icon">
        {isAuth && (
          <>
            {/* 유저 아이콘 */}
            <FontAwesomeIcon
              icon={faUser}
              className="faUser"
              onClick={() => navigate('/mypage')}
            />

            {/* 알림 아이콘 */}
            <div className="notification-wrapper" onClick={handleAlarmClick}>
              <FontAwesomeIcon
                icon={faBell}
                className={`faBell ${unreadNotifications ? 'active' : ''}`}
              />
              {notificationCount > 0 && (
                <span className="notification-count">{notificationCount}</span>
              )}
            </div>
          </>
        )}
      </div>
      <div className="header-section login-buttons">
        {isAuth ? (
          <button onClick={handleLogout}>로그아웃</button>
        ) : (
          <>
            <button onClick={handleLoginClick}>로그인</button>
            <button onClick={() => navigate('/SignType')}>회원가입</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
