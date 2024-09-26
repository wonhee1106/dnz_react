import React, { useState, useEffect, useCallback } from 'react';
import styles from './Activities.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';

const ITEMS_PER_PAGE = 5;

const Activities = ({ activities, setActivities }) => {
    const [activityTab, setActivityTab] = useState('읽지 않음');
    const [currentUnreadPage, setCurrentUnreadPage] = useState(1);
    const [currentReadPage, setCurrentReadPage] = useState(1);
    const [totalUnreadPages, setTotalUnreadPages] = useState(1);
    const [totalReadPages, setTotalReadPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const jwtToken = sessionStorage.getItem('token');

    // 활동 데이터를 가져오는 함수
    const fetchActivities = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${serverUrl}/api/activities/user`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });

            const sortedActivities = response.data.sort((a, b) => new Date(b.activityDate) - new Date(a.activityDate));
            setActivities(sortedActivities);

            const unreadActivities = sortedActivities.filter(activity => !activity.isRead);
            const readActivities = sortedActivities.filter(activity => activity.isRead);
            setTotalUnreadPages(Math.ceil(unreadActivities.length / ITEMS_PER_PAGE) || 1);
            setTotalReadPages(Math.ceil(readActivities.length / ITEMS_PER_PAGE) || 1);
        } catch (err) {
            console.error("Error fetching activities:", err.response ? err.response.data : err.message);
            setError(`활동 데이터를 가져오는 중 오류가 발생했습니다: ${err.response ? err.response.data : err.message}`);
        } finally {
            setLoading(false);
        }
    }, [serverUrl, jwtToken, setActivities]);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    // 날짜와 시간을 포맷하는 함수
    const formatDateTime = (dateString) => {
        if (!dateString) return '날짜 정보 없음';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        return date.toLocaleString(undefined, options);
    };

    // 알림 읽음 처리 함수
    const handleNotificationClick = async (activityId) => {
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
                setActivities(prevActivities =>
                    prevActivities.map(activity =>
                        activity.activityId === activityId
                            ? { ...activity, isRead: 1 }
                            : activity
                    )
                );
            } else {
                console.log('응답 상태 코드:', response.status);
            }
        } catch (error) {
            console.error("알림 읽음 처리 중 오류 발생:", error);
        }
    };

    const handleActivityTabClick = (tabName) => {
        setActivityTab(tabName);
    };

    const handleUnreadPageChange = (event, newPage) => {
        setCurrentUnreadPage(newPage);
    };

    const handleReadPageChange = (event, newPage) => {
        setCurrentReadPage(newPage);
    };

    const unreadActivities = activities
        .filter(activity => !activity.isRead)
        .slice(
            (currentUnreadPage - 1) * ITEMS_PER_PAGE,
            currentUnreadPage * ITEMS_PER_PAGE
        );

    const readActivities = activities
        .filter(activity => activity.isRead)
        .slice(
            (currentReadPage - 1) * ITEMS_PER_PAGE,
            currentReadPage * ITEMS_PER_PAGE
        );

    return (
        <div className={styles.activitiesContainer}>
            <div className={styles.activityTabs}>
                <button
                    className={`${styles.activityTab} ${activityTab === '읽지 않음' ? styles.active : ''}`}
                    onClick={() => handleActivityTabClick('읽지 않음')}
                >
                    읽지 않음
                </button>
                <button
                    className={`${styles.activityTab} ${activityTab === '읽음' ? styles.active : ''}`}
                    onClick={() => handleActivityTabClick('읽음')}
                >
                    읽음
                </button>
            </div>

            <div className={styles.activityContent}>
                {loading ? (
                    <p>활동 데이터를 불러오는 중...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : activities.length === 0 ? (
                    <div className={styles.emptyActivities}>
                        <FontAwesomeIcon icon={faEnvelope} className={styles.activityIcon} />
                        <p>내 활동에 대한 사람들의 알림을 여기에서 볼 수 있어요.</p>
                    </div>
                ) : (
                    <>
                        {activityTab === '읽지 않음' && (
                            <div>
                                <h3>읽지 않음</h3>
                                {unreadActivities.length > 0 ? (
                                    <ul className={styles.activityList}>
                                        {unreadActivities.map((activity) => (
                                            <li
                                                key={activity.activityId}
                                                className={`${styles.activityItem} ${styles.unread}`}
                                                onClick={() => handleNotificationClick(activity.activityId)}
                                            >
                                                <FontAwesomeIcon icon={faEnvelope} className={styles.activityIcon} />
                                                <div className={styles.activityDescription}>
                                                    {activity.activityDescription} - {formatDateTime(activity.activityDate)}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>모든 활동을 읽었습니다.</p>
                                )}
                                {totalUnreadPages > 1 && (
                                    <Pagination
                                        count={totalUnreadPages}
                                        page={currentUnreadPage}
                                        onChange={handleUnreadPageChange}
                                        color="primary"
                                        className={styles.pagination}
                                    />
                                )}
                            </div>
                        )}

                        {activityTab === '읽음' && (
                            <div>
                                <h3>읽음</h3>
                                {readActivities.length > 0 ? (
                                    <ul className={styles.activityList}>
                                        {readActivities.map((activity) => (
                                            <li
                                                key={activity.activityId}
                                                className={`${styles.activityItem} ${styles.read}`}
                                            >
                                                <FontAwesomeIcon icon={faEnvelopeOpen} className={styles.activityIcon} />
                                                <div className={styles.activityDescription}>
                                                    {activity.activityDescription} - {formatDateTime(activity.activityDate)}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>읽은 활동이 없습니다.</p>
                                )}
                                {totalReadPages > 1 && (
                                    <Pagination
                                        count={totalReadPages}
                                        page={currentReadPage}
                                        onChange={handleReadPageChange}
                                        color="primary"
                                        className={styles.pagination}
                                    />
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Activities;
