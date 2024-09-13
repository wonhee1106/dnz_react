import React, { useState, useEffect, useCallback } from 'react';
import './Alam.css'; // 스타일 파일
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faEnvelope, faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons'; // 필요한 아이콘 추가
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // jwtDecode import 수정
import Pagination from '@mui/material/Pagination'; // Material-UI Pagination 가져오기

const ITEMS_PER_PAGE = 5; // 한 페이지당 표시할 항목 수

const Alam = () => {
    const [activeTab, setActiveTab] = useState('공지');
    const [activityTab, setActivityTab] = useState('읽지 않음'); // 활동 내 서브탭 상태 관리
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentUnreadPage, setCurrentUnreadPage] = useState(1); // 읽지 않은 활동 페이지 상태
    const [currentReadPage, setCurrentReadPage] = useState(1); // 읽은 활동 페이지 상태
    const [currentNoticePage, setCurrentNoticePage] = useState(1); // 현재 공지 페이지 상태
    const [totalUnreadPages, setTotalUnreadPages] = useState(1); // 읽지 않은 활동의 전체 페이지 수
    const [totalReadPages, setTotalReadPages] = useState(1); // 읽은 활동의 전체 페이지 수
    const [totalNoticePages, setTotalNoticePages] = useState(1); // 전체 공지 페이지 수

    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const jwtToken = sessionStorage.getItem('token');

    const notices = [
        { title: "[공지] 리뷰 아르바이트 제보 시 최대 100만원 리워드 인상", date: "2024년 08월 19일" },
        { title: "[공지] 리뷰 아르바이트 제보 시 5만원 리워드 제공", date: "2024년 08월 01일" },
        { title: "[이벤트] 캐치테이블 동영상 리뷰 이벤트 당첨자 안내", date: "2024년 07월 12일" },
        // 추가 공지사항들을 배열에 추가
    ];

    useEffect(() => {
        if (!jwtToken) {
            window.location.href = '/login';
        }
    }, [jwtToken]);

    const decodedToken = jwtDecode(jwtToken);
    const userSeq = decodedToken.userSeq;

    const fetchActivities = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${serverUrl}/api/activities/user`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            setActivities(response.data);

            // 읽지 않은 활동과 읽은 활동에 대한 전체 페이지 수를 계산
            const unreadActivities = response.data.filter(activity => !activity.isRead);
            const readActivities = response.data.filter(activity => activity.isRead);
            setTotalUnreadPages(Math.ceil(unreadActivities.length / ITEMS_PER_PAGE));
            setTotalReadPages(Math.ceil(readActivities.length / ITEMS_PER_PAGE));
        } catch (err) {
            console.error("Error fetching activities:", err.response ? err.response.data : err.message);
            setError(`활동 데이터를 가져오는 중 오류가 발생했습니다: ${err.response ? err.response.data : err.message}`);
        } finally {
            setLoading(false);
        }
    }, [serverUrl, jwtToken]);

    useEffect(() => {
        if (activeTab === '활동') {
            fetchActivities();
        }
        setTotalNoticePages(Math.ceil(notices.length / ITEMS_PER_PAGE)); // 전체 공지 페이지 수 계산
    }, [activeTab, fetchActivities]);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    // 활동 서브 탭 변경 핸들러
    const handleActivityTabClick = (tabName) => {
        setActivityTab(tabName);
    };

    // 페이지 전환 핸들러 (공지사항)
    const handleNoticePageChange = (event, newPage) => {
        setCurrentNoticePage(newPage);
    };

    // 읽지 않은 활동의 페이지 전환 핸들러
    const handleUnreadPageChange = (event, newPage) => {
        setCurrentUnreadPage(newPage);
    };

    // 읽은 활동의 페이지 전환 핸들러
    const handleReadPageChange = (event, newPage) => {
        setCurrentReadPage(newPage);
    };

    // 날짜와 시간을 포맷하는 함수
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        };
        return date.toLocaleDateString(undefined, options);
    };

    // 현재 공지 페이지에 표시할 데이터
    const currentNotices = notices.slice(
        (currentNoticePage - 1) * ITEMS_PER_PAGE,
        currentNoticePage * ITEMS_PER_PAGE
    );

    // 현재 읽지 않은 활동 페이지에 표시할 데이터
    const unreadActivities = activities
        .filter(activity => !activity.isRead)
        .slice(
            (currentUnreadPage - 1) * ITEMS_PER_PAGE,
            currentUnreadPage * ITEMS_PER_PAGE
        );

    // 현재 읽은 활동 페이지에 표시할 데이터
    const readActivities = activities
        .filter(activity => activity.isRead)
        .slice(
            (currentReadPage - 1) * ITEMS_PER_PAGE,
            currentReadPage * ITEMS_PER_PAGE
        );


    // 수정된 handleNotificationClick 함수 - 개별 알림 읽음 처리 및 상태 업데이트
    const handleNotificationClick = async (activityId) => {
        const jwtToken = sessionStorage.getItem('token');
        if (!jwtToken) {
            console.error("JWT 토큰이 없습니다.");
            return;
        }

        try {
            const response = await axios.post(`${serverUrl}/api/activities/markAsRead/${activityId}`, null, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                console.log(`알림 ID: ${activityId} 읽음 처리 완료`);

                // 알림이 읽음 처리된 후, 해당 알림의 isRead 값을 업데이트하여 UI에 반영
                setActivities(prevActivities =>
                    prevActivities.map(activity =>
                        activity.activityId === activityId
                            ? { ...activity, isRead: 1 }  // isRead 값을 1로 업데이트
                            : activity
                    )
                );
            } else {
                console.log('응답 상태 코드:', response.status);
            }
        } catch (error) {
            console.error("알림 읽음 처리 중 오류 발생:", error);
            if (error.response) {
                console.log('서버 응답 데이터:', error.response.data);
                console.log('서버 응답 상태 코드:', error.response.status);
            }
        }
    };

 
    return (
        <div>        
            <div className="alam-container">
                {/* 상위 탭 메뉴 */}
                <div className="alam-tabs">
                    <button 
                        className={`alam-tab ${activeTab === '공지' ? 'active' : ''}`} 
                        onClick={() => handleTabClick('공지')}
                    >
                        공지
                    </button>
                    <button 
                        className={`alam-tab ${activeTab === '활동' ? 'active' : ''}`} 
                        onClick={() => handleTabClick('활동')}
                    >
                        활동
                    </button>
                </div>

                {/* 상위 탭 내용 */}
                <div className="alam-content">
                    {activeTab === '공지' && (
                        <div className="tab-content activity-content">
                            <ul>
                                {currentNotices.map((notice, index) => (
                                    <li key={index} className="notice-item">
                                        <div className="notice-title">{notice.title}</div>
                                        <div className="notice-date">{notice.date}</div>
                                    </li>
                                ))}
                            </ul>
                            {/* 공지사항 페이지 네비게이션 */}
                            <Pagination
                                count={totalNoticePages}
                                page={currentNoticePage}
                                onChange={handleNoticePageChange}
                                color="primary"
                                className="pagination"
                            />
                        </div>
                    )}

                    {/* 활동 탭 내용 */}
                    {activeTab === '활동' && (
                        <>
                            {/* 활동 서브 탭 */}
                            <div className="activity-tabs">
                                <button 
                                    className={`activity-tab ${activityTab === '읽지 않음' ? 'active' : ''}`} 
                                    onClick={() => handleActivityTabClick('읽지 않음')}
                                >
                                    읽지 않음
                                </button>
                                <button 
                                    className={`activity-tab ${activityTab === '읽음' ? 'active' : ''}`} 
                                    onClick={() => handleActivityTabClick('읽음')}
                                >
                                    읽음
                                </button>
                            </div>

                            <div className="tab-content activity-content">
                                {loading ? (
                                    <p>활동 데이터를 불러오는 중...</p>
                                ) : error ? (
                                    <p>{error}</p>
                                ) : activities.length === 0 ? (
                                    <div className="empty-activities">
                                        <FontAwesomeIcon icon={faComments} className="activity-icon" />
                                        <p>내 활동에 대한 사람들의 알림을 여기에서 볼 수 있어요.</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* 서브 탭: 안 읽음 */}
                                        {activityTab === '읽지 않음' && (
                                            <div>
                                                <h3>읽지 않음</h3>
                                                {unreadActivities.length > 0 ? (
                                                    <ul className="activity-list">
                                                        {unreadActivities.map((activity, index) => (
                                                            <li key={index} className="activity-item unread"
                                                                onClick={() => handleNotificationClick(activity.activityId)} // 클릭 시 읽음 처리
                                                            >
                                                                <FontAwesomeIcon icon={faEnvelope} className="activity-icon" />
                                                                <div className="activity-description">
                                                                    {activity.activityDescription} - {formatDateTime(activity.activityDate)}
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p>모든 활동을 읽었습니다.</p>
                                                )}
                                                {/* 읽지 않은 활동 페이지 네비게이션 */}
                                                {totalUnreadPages > 1 && (
                                                    <Pagination
                                                        count={totalUnreadPages}
                                                        page={currentUnreadPage}
                                                        onChange={handleUnreadPageChange}
                                                        color="primary"
                                                        className="pagination"
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {/* 서브 탭: 읽음 */}
                                        {activityTab === '읽음' && (
                                            <div>
                                                <h3>읽음</h3>
                                                {readActivities.length > 0 ? (
                                                    <ul className="activity-list">
                                                        {readActivities.map((activity, index) => (
                                                            <li key={index} className="activity-item read">
                                                                <FontAwesomeIcon icon={faEnvelopeOpen} className="activity-icon" />
                                                                <div className="activity-description">
                                                                    {activity.activityDescription} - {formatDateTime(activity.activityDate)}
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p>읽은 활동이 없습니다.</p>
                                                )}
                                                {/* 읽은 활동 페이지 네비게이션 */}
                                                {totalReadPages > 1 && (
                                                    <Pagination
                                                        count={totalReadPages}
                                                        page={currentReadPage}
                                                        onChange={handleReadPageChange}
                                                        color="primary"
                                                        className="pagination"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Alam;
