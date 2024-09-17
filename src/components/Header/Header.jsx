import React, { useEffect, useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from 'utils/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBookmark, faUser } from '@fortawesome/free-regular-svg-icons';

const Header = () => {
    const navigate = useNavigate();
    const isAuth = useAuthStore((state) => state.isAuth);
    const logout = useAuthStore((state) => state.logout);
    const [notificationCount, setNotificationCount] = useState(0);
    const [unreadNotifications, setUnreadNotifications] = useState(false);
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        let ws;
        const jwtToken = sessionStorage.getItem('token');

        if (isAuth && jwtToken && serverUrl) {
            ws = new WebSocket(
                `ws://192.168.1.19/alarm?token=${encodeURIComponent(jwtToken)}`
            );

            ws.onopen = () => {
                console.log('WebSocket 연결 성공');
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    setNotificationCount((prevCount) => prevCount + 1);
                    setUnreadNotifications(true);
                } catch (error) {
                    setNotificationCount((prevCount) => prevCount + 1);
                    setUnreadNotifications(true);
                }
            };

            ws.onclose = () => {
                console.log('WebSocket 연결이 닫혔습니다.');
            };

            ws.onerror = (error) => {
                console.error('WebSocket 오류:', error);
            };
        }

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [isAuth, serverUrl]);

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleAlarmClick = () => {
        setUnreadNotifications(false);
        setNotificationCount(0);
        navigate('/alarm', { state: { defaultTab: '활동' } });
    };

    const handleLogout = () => {
        logout();
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    const handleUserClick = () => {
        navigate('/mypage');
    };

    return (
        <header className="header">
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
                {isAuth && (
                    <FontAwesomeIcon
                        icon={faUser}
                        className="faUser"
                        onClick={handleUserClick} // 유저 아이콘 클릭 이벤트
                    />
                )}

                
                <FontAwesomeIcon icon={faBookmark} className="faBookmark" />
                <div className="notification-wrapper" onClick={handleAlarmClick}>
                    <FontAwesomeIcon
                        icon={faBell}
                        className={`faBell ${unreadNotifications ? 'active' : ''}`}
                    />
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
};

export default Header;
