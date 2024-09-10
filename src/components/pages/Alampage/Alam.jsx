
import React, { useState, useEffect, useCallback } from 'react';
import './Alam.css'; // 스타일 파일
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Pagination from '@mui/material/Pagination'; // Material-UI Pagination 가져오기

const ITEMS_PER_PAGE = 5; // 한 페이지당 표시할 항목 수

const Alam = () => {
    const [activeTab, setActiveTab] = useState('공지');
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentActivityPage, setCurrentActivityPage] = useState(1); // 현재 활동 페이지 상태
    const [currentNoticePage, setCurrentNoticePage] = useState(1); // 현재 공지 페이지 상태
    const [totalActivityPages, setTotalActivityPages] = useState(1); // 전체 활동 페이지 수
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
            setTotalActivityPages(Math.ceil(response.data.length / ITEMS_PER_PAGE)); // 전체 활동 페이지 수 계산
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

    // 페이지 전환 핸들러 (공지사항)
    const handleNoticePageChange = (event, newPage) => {
        setCurrentNoticePage(newPage);
    };

    // 페이지 전환 핸들러 (활동)
    const handleActivityPageChange = (event, newPage) => {
        setCurrentActivityPage(newPage);
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

    // 현재 활동 페이지에 표시할 데이터
    const currentActivities = activities.slice(
        (currentActivityPage - 1) * ITEMS_PER_PAGE,
        currentActivityPage * ITEMS_PER_PAGE
    );


    return (
        <div>        
            <div className="alam-container">
                {/* 탭 메뉴 */}
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

                {/* 탭 내용 */}
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

                    {activeTab === '활동' && (
                        <div className="tab-content activity-content">
                            {loading ? (
                                <p>활동 데이터를 불러오는 중...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : currentActivities.length === 0 ? (
                                <>
                                    <FontAwesomeIcon icon={faComments} className="activity-icon" />
                                    <p>내 활동에 대한 사람들의 알림을 여기에서 볼 수 있어요.</p>
                                </>
                            ) : (
                                <>
                                    <ul>
                                        {currentActivities.map((activity, index) => (
                                            <li key={index}>
                                                {activity.activityDescription} - {formatDateTime(activity.activityDate)}
                                            </li>
                                        ))}
                                    </ul>
                                    {/* 활동 페이지 네비게이션 */}
                                    <Pagination
                                        count={totalActivityPages}
                                        page={currentActivityPage}
                                        onChange={handleActivityPageChange}
                                        color="primary"
                                        className="pagination"
                                    />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Alam;
