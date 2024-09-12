import React, { useEffect, useState } from 'react'
import './Header.css'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-regular-svg-icons'
import { faBookmark } from '@fortawesome/free-regular-svg-icons'

const Header = () => {
    const navigate = useNavigate()
    const isAuth = useAuthStore(state => state.isAuth) // Zustand에서 인증 상태 가져오기
    const logout = useAuthStore(state => state.logout) // 로그아웃 함수
    const [notificationCount, setNotificationCount] = useState(0) // 알림 카운트
    const [unreadNotifications, setUnreadNotifications] = useState(false) // 읽지 않은 알림 여부
    const serverUrl = process.env.REACT_APP_SERVER_URL // 환경 변수에서 서버 URL 가져오기

    useEffect(() => {
        let ws // WebSocket 변수
        const jwtToken = sessionStorage.getItem('token') // sessionStorage에서 JWT 토큰 가져오기

        // WebSocket 연결 조건 확인
        console.log('isAuth 상태:', isAuth)
        console.log('jwtToken:', jwtToken)
        console.log('serverUrl:', serverUrl)

        if (isAuth && jwtToken && serverUrl) {
            console.log('WebSocket을 연결 중...')

            // WebSocket 연결 설정
            ws = new WebSocket(
                `ws://192.168.1.19/alarm?token=${encodeURIComponent(jwtToken)}`
            )

            ws.onopen = () => {
                console.log('WebSocket 연결 성공')
            }

            ws.onmessage = event => {
                try {
                    const message = JSON.parse(event.data) // 수신된 메시지를 JSON으로 변환
                    console.log('수신된 알림 메시지 (JSON):', message)
                    setNotificationCount(prevCount => prevCount + 1) // 알림 카운트 증가
                    setUnreadNotifications(true) // 읽지 않은 알림 표시
                } catch (error) {
                    console.log('수신된 알림 메시지 (텍스트):', event.data) // 텍스트 메시지를 출력
                    setNotificationCount(prevCount => prevCount + 1) // 알림 카운트 증가
                    setUnreadNotifications(true) // 읽지 않은 알림 표시
                }
            }

            ws.onclose = () => {
                console.log('WebSocket 연결이 닫혔습니다.')
            }

            ws.onerror = error => {
                console.error('WebSocket 오류:', error)
            }
        } else {
            console.log('WebSocket 연결 조건이 충족되지 않음.')
        }

        return () => {
            if (ws) {
                ws.close() // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
            }
        }
    }, [isAuth, serverUrl]) // 상태 의존성 배열

    const handleLogoClick = () => {
        navigate('/') // 로고 클릭 시 메인 페이지로 이동
    }

    const handleLoginClick = () => {
        navigate('/login') // 로그인 페이지로 이동
    }

    const handleAlarmClick = () => {
        setUnreadNotifications(false) // 읽지 않은 알림을 없앰
        setNotificationCount(0) // 알림 카운트 초기화
        navigate('/alarm', { state: { defaultTab: '활동' } }) // 활동 탭으로 이동
    }

    const handleLogout = () => {
        logout() // Zustand에서 로그아웃 처리
        sessionStorage.removeItem('token') // 토큰 제거
        navigate('/login') // 로그인 페이지로 리디렉션
    }

    return (
        <header className="header">
            <div
                className="header-section logo"
                onClick={handleLogoClick}
                role="button"
                tabIndex="0"
                onKeyPress={e => e.key === 'Enter' && handleLogoClick()}
            >
                9900
            </div>
            <div className="header-section search-container">
                <input className="search" type="text" placeholder="검색" />
            </div>
            <div className="header-section icon">
                <FontAwesomeIcon icon={faBookmark} className="faBookmark" />
                <div
                    className="notification-wrapper"
                    onClick={handleAlarmClick}
                >
                    {/* 알림 아이콘 */}
                    <FontAwesomeIcon
                        icon={faBell}
                        className={`faBell ${
                            unreadNotifications ? 'active' : ''
                        }`}
                    />
                    {/* 알림 카운트 표시 */}
                    {notificationCount > 0 && (
                        <span className="notification-count">
                            {notificationCount}
                        </span>
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
    )
}

export default Header
