import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Alam.css'; // 스타일 파일 
import axios from 'axios';
import '@toast-ui/editor/dist/toastui-editor.css';
import Modal from 'react-modal';
import Notices from './Notices/Notices';
import Activities from './Activities/Activities';
import WriteModal from './WriteModal/WriteModal';
import NoticeDetail from './Notices/NoticeDetail';

Modal.setAppElement('#root');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        maxWidth: '800px',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxHeight: '80vh',
        overflowY: 'auto',
        zIndex: 2000,
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 1500,
    },
};

const ITEMS_PER_PAGE = 5;

const Alarm = () => {
    const [activeTab, setActiveTab] = useState('공지');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [notices, setNotices] = useState([]);
    const [activities, setActivities] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [currentNoticePage, setCurrentNoticePage] = useState(1);
    const [totalNoticePages, setTotalNoticePages] = useState(1);

    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const jwtToken = sessionStorage.getItem('token');

    const editorRef = useRef();

    // WebSocket 연결 상태
    const [socket, setSocket] = useState(null);

    // JWT 토큰이 없으면 로그인 페이지로 리다이렉트
    useEffect(() => {
        if (!jwtToken) {
            window.location.href = '/login';
        }

        fetchNotices();

        // WebSocket 연결 설정
        const ws = new WebSocket(`ws://localhost:8080/alarm?token=${jwtToken}`);
        
        ws.onmessage = (event) => {
            const data = event.data;
            console.log("실시간 알림 수신: ", data);
            setActivities(prevActivities => [...prevActivities, { activityDescription: data, isRead: 0, activityDate: new Date().toISOString() }]);
        };

        ws.onclose = () => {
            console.log('WebSocket 연결 종료');
        };

        setSocket(ws);

        return () => {
            if (ws) ws.close();
        };
    }, [jwtToken]);

    // 공지사항을 DB에서 불러오는 함수
    const fetchNotices = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${serverUrl}/api/posts`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            setNotices(response.data);
            setTotalNoticePages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
        } catch (err) {
            console.error("Error fetching notices:", err.response ? err.response.data : err.message);
            setError(`공지사항을 가져오는 중 오류가 발생했습니다: ${err.response ? err.response.data : err.message}`);
        } finally {
            setLoading(false);
        }
    }, [serverUrl, jwtToken]);

    // 게시물 클릭 시 세부내용 모달 열기
    const handleNoticeClick = (notice) => {
        console.log("클릭한 게시물: ", notice);
        setSelectedPost(notice);
        setIsDetailModalOpen(true);
    };
    
    // 세부내용 모달 닫기
    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedPost(null);
    };

    // 탭 클릭 시 탭 상태 변경
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    // 글쓰기 버튼 클릭 시 모달 열기
    const openModal = () => {
        setModalIsOpen(true);
        setIsEditMode(false);
    };

    // 모달 닫기
    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedPost(null);
    };

    return (
        <div className="alarmContainer">
            {/* 상위 탭 메뉴 */}
            <div className="alarmTabs">
                <button
                    className={`alarmTab ${activeTab === '공지' ? 'active' : ''}`}
                    onClick={() => handleTabClick('공지')}
                >
                    공지
                </button>
                <button
                    className={`alarmTab ${activeTab === '활동' ? 'active' : ''}`}
                    onClick={() => handleTabClick('활동')}
                >
                    활동
                </button>
            </div>

            {/* 상위 탭 내용 */}
            <div className="alarmContent">
                {activeTab === '공지' && (
                    <Notices
                        notices={notices}
                        loading={loading}
                        error={error}
                        currentPage={currentNoticePage}
                        totalPages={totalNoticePages}
                        onPageChange={setCurrentNoticePage}
                        onNoticeClick={handleNoticeClick}
                        onOpenModal={openModal}
                    />
                )}

                {activeTab === '활동' && (
                    <Activities
                        activities={activities}
                        setActivities={setActivities}
                    />
                )}
            </div>

            {/* 글쓰기 모달 창 */}
            <WriteModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                fetchNotices={fetchNotices}
                serverUrl={serverUrl}
                jwtToken={jwtToken}
                isEditMode={isEditMode}
                selectedPost={selectedPost}
                setIsEditMode={setIsEditMode}
                setSelectedPost={setSelectedPost}
                editorRef={editorRef}
            />

            {/* 게시물 세부내용 모달 창 */}
            {selectedPost && (
                <NoticeDetail
                    isOpen={isDetailModalOpen}
                    onRequestClose={closeDetailModal}
                    notice={selectedPost}
                    fetchNotices={fetchNotices}
                    serverUrl={serverUrl}
                    jwtToken={jwtToken}
                    setIsEditMode={setIsEditMode}
                    setSelectedPost={setSelectedPost}
                    editorRef={editorRef}
                />
            )}
        </div>
    );
};

export default Alarm;
