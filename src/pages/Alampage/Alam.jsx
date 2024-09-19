import React, { useState, useEffect, useCallback, useRef } from 'react'; // useRef 추가
import './Alam.css'; // 스타일 파일
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faEnvelope, faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons'; // 필요한 아이콘 추가
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // jwtDecode import 수정 (default import 사용)
import Pagination from '@mui/material/Pagination'; // Material-UI Pagination 가져오기
import { Editor } from '@toast-ui/react-editor'; // Toast UI Editor 임포트
import '@toast-ui/editor/dist/toastui-editor.css'; // Toast UI Editor 스타일 임포트
import Modal from 'react-modal'; // react-modal 가져오기

// 모달 스타일 설정
Modal.setAppElement('#root');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',  // 모달 너비 설정
        maxWidth: '800px',
        height: 'auto', // 높이는 자동으로 설정
        padding: '20px',  // 패딩 설정
        borderRadius: '10px', // 둥근 모서리
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',  // 어두운 배경
    },
};

const ITEMS_PER_PAGE = 5; // 한 페이지당 표시할 항목 수

const Alam = () => {
    const [activeTab, setActiveTab] = useState('공지'); // 현재 탭 상태를 관리하는 상태
    const [activityTab, setActivityTab] = useState('읽지 않음'); // 활동 내 서브탭 상태 관리
    const [activities, setActivities] = useState([]); // 활동 데이터를 저장할 상태
    const [loading, setLoading] = useState(false); // 로딩 상태 관리
    const [error, setError] = useState(null); // 오류 메시지 관리
    const [currentUnreadPage, setCurrentUnreadPage] = useState(1); // 읽지 않은 활동 페이지 상태
    const [currentReadPage, setCurrentReadPage] = useState(1); // 읽은 활동 페이지 상태
    const [currentNoticePage, setCurrentNoticePage] = useState(1); // 현재 공지 페이지 상태
    const [totalUnreadPages, setTotalUnreadPages] = useState(1); // 읽지 않은 활동의 전체 페이지 수
    const [totalReadPages, setTotalReadPages] = useState(1); // 읽은 활동의 전체 페이지 수
    const [totalNoticePages, setTotalNoticePages] = useState(1); // 전체 공지 페이지 수

    const [modalIsOpen, setModalIsOpen] = useState(false); // 글쓰기 모달 열림 상태
    const [editorContent, setEditorContent] = useState(''); // 에디터 내용
    const [title, setTitle] = useState(''); // 제목 상태 추가
    const [category, setCategory] = useState('공지'); // 카테고리 상태 추가
    const [notices, setNotices] = useState([]); // 공지사항을 상태로 관리
    const editorRef = useRef(); // editorRef 추가

    const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시물의 세부 정보를 저장할 상태 추가
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // 세부 모달 상태
    const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 상태

    const serverUrl = process.env.REACT_APP_SERVER_URL; // 서버 URL 가져오기
    const jwtToken = sessionStorage.getItem('token'); // 세션에서 JWT 토큰 가져오기

    // JWT 토큰이 없으면 로그인 페이지로 리다이렉트
    useEffect(() => {
        if (!jwtToken) {
            window.location.href = '/login';
        }
    }, [jwtToken]);

    const decodedToken = jwtDecode(jwtToken); // JWT 토큰을 디코딩하여 사용자 정보 가져오기
    const userSeq = decodedToken.userSeq; // 사용자 시퀀스 추출

    // 공지사항을 DB에서 불러오는 함수 추가
    const fetchNotices = useCallback(async () => {
        setLoading(true); // 로딩 상태 시작
        try {
            const response = await axios.get(`${serverUrl}/api/posts`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            setNotices(response.data); // 받아온 공지사항 데이터를 상태로 저장
            setTotalNoticePages(Math.ceil(response.data.length / ITEMS_PER_PAGE)); // 페이지 수 계산
        } catch (err) {
            console.error("Error fetching notices:", err.response ? err.response.data : err.message);
            setError(`공지사항을 가져오는 중 오류가 발생했습니다: ${err.response ? err.response.data : err.message}`);
        } finally {
            setLoading(false); // 로딩 상태 종료
        }
    }, [serverUrl, jwtToken]);

    // 활동 데이터를 가져오는 함수
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

    // 페이지가 로드될 때 활동 데이터를 가져옴
    useEffect(() => {
        if (activeTab === '활동') {
            fetchActivities();
        }
        setTotalNoticePages(Math.ceil(notices.length / ITEMS_PER_PAGE)); // 전체 공지 페이지 수 계산
    }, [activeTab, fetchActivities, notices]);

    // 탭 클릭 시 탭 상태 변경
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    // 카테고리 변경 핸들러
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
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

    // 게시물 클릭 시 세부내용 모달 열기
    const handleNoticeClick = (notice) => {
        console.log("클릭한 게시물: ", notice); // 콘솔에서 게시물 데이터 확인
        setSelectedPost(notice);  // 클릭한 게시물 데이터를 상태에 저장
        setIsDetailModalOpen(true); // 모달 열기
    };

    // 세부내용 모달 닫기
    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedPost(null); // 선택된 게시물 초기화
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

                // 읽음 처리된 알림을 activities 상태에서 업데이트
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
        }
    };

    // 글쓰기 버튼 클릭 시 모달 열기
    const openModal = () => {
        setModalIsOpen(true);
        setIsEditMode(false); // 글쓰기 모드로 설정
    };

    // 모달 닫기
    const closeModal = () => {
        setModalIsOpen(false);
        setTitle(''); // 제목 초기화
        setEditorContent(''); // 에디터 내용 초기화
        editorRef.current?.getInstance().setMarkdown(''); // 에디터 내용 초기화
    };

    // 제목 입력 핸들러
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    // 에디터 내용 변경 함수
    const handleEditorChange = () => {
        const content = editorRef.current?.getInstance()?.getMarkdown() || '';
        console.log("에디터 내용:", content); // 에디터 내용이 제대로 들어오는지 확인
        setEditorContent(content);
    };

    // 글쓰기 또는 수정 완료 버튼 클릭 시 호출
    const handleSubmit = async () => {
        try {
            const formattedTitle = `[ ${category || '공지'} ] ${title}`;
            const postData = {
                title: formattedTitle,
                content: editorContent, // 에디터에서 가져온 내용을 저장
                category: category || '공지'  // category가 undefined일 경우 기본값을 '공지'로 설정
            };

            if (isEditMode && selectedPost) {
                // 수정인 경우
                await axios.put(`${serverUrl}/api/posts/${selectedPost.postId}`, postData, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log("수정된 제목:", formattedTitle);
            } else {
                // 새 게시물 작성인 경우
                await axios.post(`${serverUrl}/api/posts`, postData, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log("제출된 제목:", formattedTitle);
            }

            // 공지사항 리스트를 다시 불러옴
            await fetchNotices();

            // 모달 닫기 및 상태 초기화
            closeModal(); // 모달 닫기 및 내용 초기화 호출
        } catch (error) {
            console.error("게시물 처리 중 오류 발생:", error);
        }
    };

    // 수정 버튼 클릭 시
    const handleEditClick = () => {
        setModalIsOpen(true); // 수정 모달 열기 (글쓰기 모달 재사용)
        setIsEditMode(true); // 수정 모드 활성화
        setTitle(selectedPost.title.replace(/\[.*?\]/, '').trim()); // 제목에서 카테고리 부분 제거
        editorRef.current?.getInstance().setMarkdown(selectedPost.content); // 수정할 내용 설정
        setCategory(selectedPost.category); // 카테고리 설정
        setIsDetailModalOpen(false); // 상세 모달 닫기
    };

    // 삭제 버튼 클릭 시
    const handleDeleteClick = async () => {
        try {
            await axios.delete(`${serverUrl}/api/posts/${selectedPost.postId}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            await fetchNotices(); // 공지사항 리스트 다시 불러오기
            closeDetailModal(); // 세부 모달 닫기
        } catch (error) {
            console.error("게시물 삭제 중 오류 발생:", error);
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
                           <button onClick={openModal} className="write-button">
                                글쓰기
                            </button>
                            <ul>
                                {currentNotices.map((notice, index) => (
                                    <li 
                                        key={index} 
                                        className="notice-item"
                                        onClick={() => handleNoticeClick(notice)} // 클릭 시 세부내용 모달 열기
                                    >
                                        <div className="notice-title">{notice.title}</div> {/* title에 이미 카테고리가 포함됨 */}
                                        <div className="notice-date">{notice.date || notice.created_at}</div> {/* 작성일 필드 수정 */}
                                    </li>
                                ))}
                            </ul>
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
                        <>
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
                                        {activityTab === '읽지 않음' && (
                                            <div>
                                                <h3>읽지 않음</h3>
                                                {unreadActivities.length > 0 ? (
                                                    <ul className="activity-list">
                                                        {unreadActivities.map((activity, index) => (
                                                            <li key={index} className="activity-item unread"
                                                                onClick={() => handleNotificationClick(activity.activityId)}
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

                {/* 글쓰기 모달 창 */}
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel={isEditMode ? '글 수정하기' : '글쓰기 모달'}
                >
                    <h2>{isEditMode ? '글 수정하기' : '글쓰기'}</h2>
                    <select value={category} onChange={handleCategoryChange} className="category-select">
                        <option value="공지">공지</option>
                        <option value="이벤트">이벤트</option>
                    </select>
                    <input 
                        type="text" 
                        placeholder="제목을 입력하세요" 
                        value={title} 
                        onChange={handleTitleChange} // 제목 변경 핸들러
                        className="title-input" 
                    />
                    <Editor
                        ref={editorRef} // editorRef 추가
                        previewStyle="vertical"
                        height="400px"
                        initialEditType="wysiwyg"
                        useCommandShortcut={false}
                        onChange={handleEditorChange}
                    />
                    <div className="modal-buttons">
                        <button className="submit-button" onClick={handleSubmit}>{isEditMode ? '수정 완료' : '글쓰기 완료'}</button>
                        <button className="close-button" onClick={closeModal}>닫기</button>
                    </div>
                </Modal>

                {/* 게시물 세부내용 모달 창 추가 */}
                <Modal
                    isOpen={isDetailModalOpen} // 세부내용 모달 열림 상태
                    onRequestClose={closeDetailModal} // 모달 닫기
                    style={customStyles}
                    contentLabel="게시물 세부내용"
                >
                    {selectedPost && ( // 선택된 게시물이 있으면 렌더링
                        <div>
                            <h2>{selectedPost.title}</h2>
                            <p>{selectedPost.content || "내용이 없습니다."}</p> {/* 본문 내용이 없을 경우 대비 */}
                            
                            {/* 작성일 추가 */}
                            <div style={{ marginTop: '10px', color: '#999', fontSize: '14px' }}>
                                <p><strong>작성일:</strong> {formatDateTime(selectedPost.created_at) || "작성일 정보 없음"}</p> {/* 작성일 표시 */}
                                <p><strong>수정일:</strong> {formatDateTime(selectedPost.updated_at) || "수정일 정보 없음"}</p> {/* 수정일 표시 */}
                            </div>
                        </div>
                    )}
                    
                    <div className="modal-buttons">
                        <button className="edit-button" onClick={handleEditClick}>수정</button>
                        <button className="delete-button" onClick={handleDeleteClick}>삭제</button>
                    </div>
                    
                    <button onClick={closeDetailModal} className="close-button">닫기</button>
                </Modal>
            </div>
        </div>
    );
};

export default Alam;
