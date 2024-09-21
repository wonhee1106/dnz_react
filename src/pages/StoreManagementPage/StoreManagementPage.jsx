import React, { useState, useEffect } from 'react';
import { api } from '../../config/config'; // JWT 토큰을 포함한 Axios 인스턴스
import styles from './StoreManagementPage.module.css';

const StoreManagementPage = () => {
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [userName, setUserName] = useState("");
    const [currentStatus, setCurrentStatus] = useState('pending');
    const [reviews, setReviews] = useState([]);
    const [replyContent, setReplyContent] = useState({});  // 각 리뷰별로 개별 답글을 관리
    const [storeInfo, setStoreInfo] = useState({
        profileImage: '',    
        storeSeq: '',
        name: '',
        address1: '',        //address1, address2로 변경
        address2: '',
        postalCode: '',      // postcode로 변경
        category: '',
        description: '',
        maxTables: 0,        // seat_capacity로 변경
    });
    
    const [currentSettingTab, setCurrentSettingTab] = useState('basic');  // 설정 탭 관리

    // 메뉴 설정 관련 상태
    const [menuItems, setMenuItems] = useState([]);
    const [newMenuItem, setNewMenuItem] = useState({ name: '', description: '', price: 0 });
    const [isEditingMenu, setIsEditingMenu] = useState(false);

    // 메뉴 수정 및 추가 관련 상태
    const [currentMenuItem, setCurrentMenuItem] = useState({ name: '', description: '', price: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 공지사항 관리 관련 상태
    const [notice, setNotice] = useState('');
    const [noticeExists, setNoticeExists] = useState(false); // 공지사항이 존재하는지 여부 확인

// 하드코딩된 리뷰 데이터
// const hardcodedReviews = [
//     {
//         review_id: 1,
//         store_seq: 1,
//         user_id: 1,
//         reservation_id: 1,
//         rating: 5,
//         review_text: '음식이 정말 맛있었고 서비스도 훌륭했습니다!',
//         created_at: '2024-09-19 12:00:00',
//         reservationDate: '2024-09-19',
//         reservationTime: '12:00',
//         numGuests: 2,
//         userName: '사용자1',
//     },
//     {
//         review_id: 2,
//         store_seq: 1,
//         user_id: 2,
//         reservation_id: 2,
//         rating: 4,
//         review_text: '전체적으로 좋았지만 조금 시끄러웠습니다.',
//         created_at: '2024-09-20 13:00:00',
//         reservationDate: '2024-09-20',
//         reservationTime: '13:00',
//         numGuests: 4,
//         userName: '사용자2',
//     },
//     {
//         review_id: 3,
//         store_seq: 1,
//         user_id: 3,
//         reservation_id: 3,
//         rating: 3,
//         review_text: '음식이 조금 늦게 나왔어요.',
//         created_at: '2024-09-21 18:30:00',
//         reservationDate: '2024-09-21',
//         reservationTime: '18:30',
//         numGuests: 3,
//         userName: '사용자3',
//     }
// ];

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            console.log('Kakao Postcode API loaded.');
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleAddressClick = () => {
        if (window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: function (data) {
                    setStoreInfo((prevState) => ({
                        ...prevState,
                        address1: data.jibunAddress,
                        postalCode: data.zonecode,
                    }));
                },
            }).open();
        } else {
            console.error("Kakao Postcode API is not loaded.");
        }
    };

    // 서버에서 예약 데이터를 가져오는 함수
    const fetchReservations = async (status) => {
        try {
            const response = await api.get(`/reservation`, {
                params: { status }
            });

            const { reservations: reservationData, userName } = response.data;
            const reservationsWithUserName = reservationData.map(reservation => ({
                ...reservation,
                userName
            }));

            setReservations(reservationsWithUserName);
            setUserName(userName);

            if (reservationsWithUserName.length > 0) {
                const recentReservation = reservationsWithUserName.reduce((latest, current) => {
                    return new Date(current.reservationDate) > new Date(latest.reservationDate) ? current : latest;
                });
                setSelectedReservation(recentReservation); // 가장 최근의 예약을 선택
            } else {
                setSelectedReservation(null); // 예약이 없을 경우 선택 해제
            }
        } catch (error) {
            console.error('예약 데이터를 가져오는데 실패했습니다:', error);
        }
    };

    // 서버에서 리뷰 데이터를 가져오는 함수
    const fetchReviews = async () => {
        try {
            const response = await api.get(`/reviews/store/${storeInfo.storeSeq}`);  // 서버에서 내 가게에 대한 리뷰 데이터를 가져옴
            console.log("Fetched Reviews Data:", response.data); // 전체 데이터 구조 확인
        console.log("Fetched Reviews:", response.data.reviews); // 리뷰 데이터 확인
       
            setReviews(response.data); // 최신순으로 리뷰 데이터 설정
        } catch (error) {
            console.error('리뷰 데이터를 가져오는데 실패했습니다:', error);
        }
    };

    useEffect(() => {
        if (currentStatus === 'review') {
            // setReviews(hardcodedReviews);  // 하드코딩된 리뷰 데이터를 설정
            fetchReviews(); // 서버에서 리뷰 데이터를 가져옴
        } else {
            fetchReservations(currentStatus); // 예약 상태에 따라 필터링
        }
    }, [currentStatus]);

    const handleMenuClick = (status) => {
        setCurrentStatus(status); // 메뉴 클릭 시 상태 변경
    };

    const handleReservationClick = (reservation) => {
        setSelectedReservation(reservation);
    };

    // 예약 상태 업데이트 함수 (취소/완료 처리)
    const handleUpdateReservationStatus = async (newStatus) => {
        const confirmMessage = newStatus === 'cancelled' ? '취소' : '완료';
        if (window.confirm(`이 예약을 ${confirmMessage} 처리하시겠습니까?`)) {
            try {
                // 서버로 상태 변경 요청 전송
                await api.put(`/reservation/${selectedReservation.reservationId}?status=${newStatus}`);
                alert(`예약이 ${confirmMessage} 처리되었습니다.`);
                
                // 예약 목록을 새로고침
                fetchReservations(currentStatus);
            } catch (error) {
                console.error(`예약 ${confirmMessage} 처리에 실패했습니다.`, error);
                alert(`예약 ${confirmMessage} 처리에 실패했습니다.`);
            }
        }
    };

    const handleReplyChange = (reviewId, value) => {
        setReplyContent((prevState) => ({
            ...prevState,
            [reviewId]: value,  // 각 리뷰 ID별로 개별 답글 상태를 저장
        }));
    };

    const handleReplySubmit = async (reviewId) => {
        const replyText = replyContent[reviewId]?.trim();
        if (!replyText) return;
    
        try {
            const response = await api.post(`/replies/${reviewId}`, {
                replyText: replyText,
            });
    
            if (response.status === 200) {
                const newReply = response.data;
    
                setReviews((prevReviews) =>
                    prevReviews.map((review) =>
                        review.review_id === reviewId
                            ? { ...review, replies: [...(review.replies || []), newReply] }
                            : review
                    )
                );
                setReplyContent((prevState) => ({
                    ...prevState,
                    [reviewId]: '',  // 답글 제출 후 상태 초기화
                }));
    
                alert("답글을 다는데 성공했습니다.");
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert("이미 이 리뷰에 답글이 달려 있습니다.");
            } else {
                console.error("답글을 달지 못했습니다.", error);
                alert("답글을 달지 못했습니다.");
            }
        }
    };
    
    // 답글이 존재하면 출력
    const renderReplies = (replies) => {
        return replies.map((reply) => (
            <div key={reply.replySeq} className={styles.replyItem}>
                <div className={styles.replyHeader}>
                    <span className={styles.replyAuthor}>{reply.userId}</span>
                    <span className={styles.replyTime}>{new Date(reply.createdAt).toLocaleString()}</span>
                </div>
                <p className={styles.replyText}>{reply.replyText}</p>
            </div>
        ));
    };


    // 가게 설정

    // 서버에서 가게 정보를 불러오는 함수
    const fetchStoreInfo = async () => {
        try {
            const response = await api.get('/store/info'); // 서버로부터 가게 정보 조회
            if (response.data) {
                setStoreInfo({
                    storeSeq: response.data.storeSeq || '',
                    name: response.data.name || '',
                    address1: response.data.address1 || '',
                    address2: response.data.address2 || '',
                    postalCode: response.data.postcode || '',
                    category: response.data.category || '',
                    description: response.data.description || '',
                    maxTables: response.data.seatCapacity || 0,  // seat_capacity를 maxTables에 매핑
                });
            }
        } catch (error) {
            console.error('가게 정보를 가져오는데 실패했습니다.', error);
        }
    };

    const handleStoreInfoChange = (field, value) => {
        setStoreInfo((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleStoreInfoSubmit = async () => {
        try {
            const updatedStoreInfo = {
                ...storeInfo,
                seatCapacity: storeInfo.maxTables, // seat_capacity 필드로 데이터를 전달
                postcode: storeInfo.postalCode,    // postcode 필드로 데이터를 전달
                address1: storeInfo.address1,
                address2: storeInfo.address2
            };
    
            await api.put(`/store/update`, updatedStoreInfo);
            alert('가게 정보가 성공적으로 업데이트되었습니다.');
        } catch (error) {
            console.error('가게 정보 업데이트에 실패했습니다.', error);
            alert('가게 정보 업데이트에 실패했습니다.');
        }
    };

    // 설정 탭 변경 함수
    const handleSettingTabClick = (tab) => {
        setCurrentSettingTab(tab);
    };

    // 메뉴 설정 관련 함수
    const fetchMenuItems = async () => {
        try {
            const response = await api.get(`/menu`);
            setMenuItems(response.data || []);  // 데이터가 없으면 빈 배열로 설정
        } catch (error) {
            console.error('메뉴 데이터를 가져오는데 실패했습니다.', error);
            setMenuItems([]);  // 오류가 발생해도 안전하게 빈 배열로 초기화
        }
    };

    const handleNewMenuItemChange = (field, value) => {
        setNewMenuItem((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleCurrentMenuItemChange = (field, value) => {
        setCurrentMenuItem((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const openModalForEdit = (menuItem) => {
        setCurrentMenuItem(menuItem);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openModalForNew = () => {
        setNewMenuItem({ name: '', description: '', price: 0 });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentMenuItem(null);
        setIsEditing(false);
    };

    const handleMenuItemSubmit = async () => {
        try {
            const response = await api.post(`/menu`, newMenuItem);
            // setMenuItems([...menuItems, response.data]);
            await fetchMenuItems();
            closeModal();
            alert('메뉴가 성공적으로 추가되었습니다.');
        } catch (error) {
            console.error('메뉴 추가에 실패했습니다.', error);
            alert('메뉴 추가에 실패했습니다.');
        }
    };

    const handleMenuItemUpdate = async () => {
        try {
            await api.put(`/menu/${currentMenuItem.menuSeq}`, currentMenuItem);
            setMenuItems(menuItems.map(item => item.menuSeq === currentMenuItem.menuSeq ? currentMenuItem : item));
            closeModal();
            alert('메뉴가 성공적으로 수정되었습니다.');
        } catch (error) {
            console.error('메뉴 수정에 실패했습니다.', error);
            alert('메뉴 수정에 실패했습니다.');
        }
    };

    const handleMenuItemDelete = async (menuSeq) => {
        if (window.confirm('정말 이 메뉴를 삭제하시겠습니까?')) {
            try {
                await api.delete(`/menu/${menuSeq}`);
                setMenuItems(menuItems.filter(item => item.menuSeq !== menuSeq));
                alert('메뉴가 성공적으로 삭제되었습니다.');
            } catch (error) {
                console.error('메뉴 삭제에 실패했습니다.', error);
                alert('메뉴 삭제에 실패했습니다.');
            }
        }
    };

    // 공지사항 조회 함수
    const fetchNotice = async () => {
        try {
            const response = await api.get('/notice');
            if (response.data && response.data.content) {
                setNotice(response.data.content);
                setNoticeExists(true);
            } else {
                setNotice(''); // 공지사항이 없을 때
                setNoticeExists(false);
            }
        } catch (error) {
            console.error('공지사항을 가져오는데 실패했습니다.', error);
        }
    };

    // 공지사항 저장 함수
    const handleNoticeSave = async () => {
        try {
            if (noticeExists) {
                await api.put('/notice', { content: notice }); // 공지사항 수정
                alert('공지사항이 성공적으로 수정되었습니다.');
            } else {
                await api.post('/notice', { content: notice }); // 공지사항 추가
                alert('공지사항이 성공적으로 추가되었습니다.');
                setNoticeExists(true);
            }
        } catch (error) {
            console.error('공지사항 저장에 실패했습니다.', error);
            alert('공지사항 저장에 실패했습니다.');
        }
    };

    // 탭 선택 시 데이터 로드
    useEffect(() => {
        if (currentSettingTab === 'notice') {
            fetchNotice();
        } else if (currentSettingTab === 'basic') {
            fetchStoreInfo();
        } else if (currentSettingTab === 'menu') {
            fetchMenuItems();
        }
    }, [currentSettingTab]);

    const formatReservationDate = (date) => {
        const parsedDate = Date.parse(date);
        if (!isNaN(parsedDate)) {
            return new Date(parsedDate).toLocaleDateString();
        }
        return 'Invalid Date';
    };

    const getReservationTitle = () => {
        switch (currentStatus) {
            case 'pending':
                return '예약 대기';
            case 'confirmed':
                return '완료된 예약';
            case 'cancelled':
                return '취소된 예약';
            case 'review':
                return '리뷰 관리';
            default:
                return '예약 관리';
        }
    };

    const renderStars = (rating) => {
        return (
            <span>
                {[...Array(5)].map((_, index) => (
                    <i key={index} className={index < rating ? 'fas fa-star' : 'far fa-star'}></i>
                ))}
            </span>
        );
    };
    
    return (
        <div className={styles.container}>
            {/* 좌측 메뉴 */}
            <div className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>예약 관리</h2>
                <div 
                    className={`${styles.menuItem} ${currentStatus === 'pending' ? styles.selectedMenu : ''}`} 
                    onClick={() => handleMenuClick('pending')}
                >
                    <i className="fas fa-tasks"></i>
                    <span>처리 중</span>
                </div>
                <div 
                    className={`${styles.menuItem} ${currentStatus === 'confirmed' ? styles.selectedMenu : ''}`} 
                    onClick={() => handleMenuClick('confirmed')}
                >
                    <i className="fas fa-check-circle"></i>
                    <span>완료</span>
                </div>
                <div 
                    className={`${styles.menuItem} ${currentStatus === 'cancelled' ? styles.selectedMenu : ''}`} 
                    onClick={() => handleMenuClick('cancelled')}
                >
                    <i className="fas fa-ban"></i>
                    <span>취소</span>
                </div>
                <div 
                    className={`${styles.menuItem} ${currentStatus === 'review' ? styles.selectedMenu : ''}`} 
                    onClick={() => handleMenuClick('review')}
                >
                    <i className="fas fa-star"></i>
                    <span>리뷰 관리</span>
                </div>
                <div 
                    className={`${styles.menuItem} ${styles.settings} ${currentStatus === 'settings' ? styles.selectedMenu : ''}`} 
                    onClick={() => handleMenuClick('settings')}
                >
                    <i className="fas fa-cogs"></i>
                    <span>설정</span>
                </div>
            </div>

            {/* 예약 관리 화면 */}
            {currentStatus !== 'review' && currentStatus !== 'settings' && (
                <div className={styles.reservationList}>
                    <h3 className={styles.reservationTitle}>{getReservationTitle()}</h3>

                    {reservations.length > 0 ? (
                        reservations.map((reservation) => (
                            <div
                                key={reservation.reservationId}
                                className={`${styles.reservationItem} ${selectedReservation?.reservationId === reservation.reservationId ? styles.selected : ''}`}
                                onClick={() => handleReservationClick(reservation)}
                            >
                                <span className={styles.tableInfo}>예약 {reservation.reservationId}번 - {reservation.numGuests}명</span>
                                <span className={styles.time}>예약 시간: {reservation.reservationTime}</span>
                            </div>
                        ))
                    ) : (
                        <p>예약이 없습니다.</p>
                    )}
                </div>
            )}

            {/* 예약 상세 정보 */}
            {selectedReservation && currentStatus !== 'review' && currentStatus !== 'settings' && (
                <div className={styles.reservationDetails}>
                    <h3 className={styles.detailsTitle}>예약 상세 정보</h3>
                    <div className={styles.detailInfo}>
                        <p>예약 번호: {selectedReservation.reservationId}번</p>
                        <p>예약 시간: {selectedReservation.reservationTime}</p>
                        <p>예약 날짜: {formatReservationDate(selectedReservation.reservationDate)}</p>
                        <p>예약자: {selectedReservation.userName}</p>
                    </div>
                    <div className={styles.guestInfo}>
                        <h4>예약자 정보</h4>
                        <p>예약 상태: {selectedReservation.status === 'pending' ? '처리 중' : selectedReservation.status === 'confirmed' ? '완료' : selectedReservation.status === 'cancelled' ? '취소' : '알 수 없음'}</p>
                    </div>
                    {currentStatus === 'pending' && (
                        <div className={styles.buttons}>
                            <button 
                                className={styles.cancelButton} 
                                onClick={() => handleUpdateReservationStatus('cancelled')}
                            >
                                취소
                            </button>
                            <button 
                                className={styles.completeButton} 
                                onClick={() => handleUpdateReservationStatus('confirmed')}
                            >
                                완료
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* 리뷰 관리 화면 */}
            {currentStatus === 'review' && (
    <div className={styles.reviewList}>
        <h3 className={styles.reviewTitle}>리뷰 목록</h3>

        {reviews && reviews.length > 0 ? (
    reviews.map((review) => (
        <div key={review.reviewId} className={styles.reviewItem}>
            <span className={styles.reviewTime}>{new Date(review.createdAt).toLocaleString()}</span>
            <p><strong>예약 날짜/시간:</strong> {new Date(review.createdAt).toLocaleDateString()} {new Date(review.createdAt).toLocaleTimeString()}</p>
            {/* <p><strong>예약 인원:</strong> {review.numGuests}명</p> */}
            <p><strong>평점:</strong> {renderStars(review.rating)}</p>
            <p><strong>리뷰 내용:</strong> {review.reviewText}</p>
            <p><strong>작성자:</strong> {review.userId}</p>

            {/* 사장 답글 표시 */}
            {review.replies && review.replies.length > 0 && (
                <div className={styles.replyItem}>
                    <p><strong>사장 답글:</strong> {review.replies[0].replyText}</p>
                    <span className={styles.replyTime}>{new Date(review.replies[0].createdAt).toLocaleString()}</span>
                </div>
            )}

            {/* 사장 답글 달기 */}
            <div className={styles.replySection}>
                <textarea
                    placeholder="답글을 작성하세요..."
                    className={styles.replyInput}
                    rows={1}
                    value={replyContent[review.reviewId] || ''}
                    onChange={(e) => handleReplyChange(review.reviewId, e.target.value)}
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                ></textarea>
                <button className={styles.replyButton} onClick={() => handleReplySubmit(review.reviewId)}>
                    답글 달기
                </button>
            </div>
        </div>
    ))
) : (
    <p>리뷰가 없습니다.</p>
)}

    </div>
)}

            {/* 설정 화면 */}
            {currentStatus === 'settings' && (
                <div className={styles.settingsContainer}>
                    <div className={styles.settingTabs}>
                        <div 
                            className={`${styles.settingTab} ${currentSettingTab === 'basic' ? styles.selectedSettingTab : ''}`}
                            onClick={() => handleSettingTabClick('basic')}
                        >
                            기본 정보 설정
                        </div>
                        <div 
                            className={`${styles.settingTab} ${currentSettingTab === 'menu' ? styles.selectedSettingTab : ''}`}
                            onClick={() => handleSettingTabClick('menu')}
                        >
                            메뉴 설정
                        </div>
                        <div 
                            className={`${styles.settingTab} ${currentSettingTab === 'notice' ? styles.selectedSettingTab : ''}`}
                            onClick={() => handleSettingTabClick('notice')}
                        >
                            공지사항 관리
                        </div>
                    </div>

                    {/* 설정 화면 내용 - 기본 정보 설정 */}
                    {currentSettingTab === 'basic' && (
                        <div className={styles.settingContent}>
                            <div className={styles.field}>
                                <label>가게 이름</label>
                                <input type="text" value={storeInfo.name} onChange={(e) => handleStoreInfoChange('name', e.target.value)} />
                            </div>
                            <div className={styles.field}>
                                <label>가게 주소</label>
                                <input type="text" placeholder="주소" value={storeInfo.address1} onChange={(e) => handleStoreInfoChange('address1', e.target.value)} />
                                <input type="text" placeholder="상세 주소" value={storeInfo.address2} onChange={(e) => handleStoreInfoChange('address2', e.target.value)} />
                                <input type="text" placeholder="우편번호" value={storeInfo.postalCode} onChange={(e) => handleStoreInfoChange('postalCode', e.target.value)} />
                                <button type="button" onClick={handleAddressClick}>우편번호 찾기</button>
                            </div>
                            <div className={styles.field}>
                                <label>카테고리</label>
                                <select value={storeInfo.category} onChange={(e) => handleStoreInfoChange('category', e.target.value)}>
                                    <option value="한식">한식</option>
                                    <option value="중식">중식</option>
                                    <option value="일식">일식</option>
                                    <option value="양식">양식</option>
                                </select>
                            </div>
                            <div className={styles.field}>
                                <label>가게 소개</label>
                                <textarea value={storeInfo.description} onChange={(e) => handleStoreInfoChange('description', e.target.value)} rows="4"></textarea>
                            </div>
                            <div className={styles.field}>
                                <label>최대 좌석 수</label>
                                <input type="number" value={storeInfo.maxTables} onChange={(e) => handleStoreInfoChange('maxTables', e.target.value)} />
                            </div>
                            <div className={styles.buttons}>
                                <button className={styles.saveButton} onClick={handleStoreInfoSubmit}>저장</button>
                            </div>
                        </div>
                    )}

                    {currentSettingTab === 'menu' && (
                        <div className={styles.settingContent}>
                            <h4>메뉴 설정</h4>
                            <button className={styles.addButton} onClick={openModalForNew}>메뉴 추가</button>

                            {menuItems && menuItems.length > 0 ? (
                                menuItems.map((item) => (
                                    <div key={item.menuSeq} className={styles.menuListItem}>
                                        <div className={styles.menuDetails}>
                                            <p><strong>이름:</strong> {item.name}</p>
                                            <p><strong>설명:</strong> {item.description}</p>
                                            <p><strong>가격:</strong> {item.price}</p>
                                        </div>
                                        <div className={styles.menuActions}>
                                            <button className={styles.editMenuButton} onClick={() => openModalForEdit(item)}>수정</button>
                                            <button className={styles.deleteMenuButton} onClick={() => handleMenuItemDelete(item.menuSeq)}>삭제</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>등록된 메뉴가 없습니다.</p>
                            )}
                        </div>
                    )}

                    {/* 메뉴 수정 및 추가 모달 */}
                    {isModalOpen && (
                        <div className={styles.modal}>
                            <div className={styles.modalContent}>
                                <h4>{isEditing ? '메뉴 수정' : '메뉴 추가'}</h4>
                                <div className={styles.field}>
                                    <label>메뉴 이름</label>
                                    <input
                                        type="text"
                                        value={isEditing ? currentMenuItem?.name : newMenuItem.name}
                                        onChange={(e) => isEditing ? handleCurrentMenuItemChange('name', e.target.value) : handleNewMenuItemChange('name', e.target.value)}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>메뉴 설명</label>
                                    <textarea
                                        value={isEditing ? currentMenuItem?.description : newMenuItem.description}
                                        onChange={(e) => isEditing ? handleCurrentMenuItemChange('description', e.target.value) : handleNewMenuItemChange('description', e.target.value)}
                                        rows="4"
                                    ></textarea>
                                </div>
                                <div className={styles.field}>
                                    <label>메뉴 가격</label>
                                    <input
                                        type="number"
                                        value={isEditing ? currentMenuItem?.price : newMenuItem.price}
                                        onChange={(e) => isEditing ? handleCurrentMenuItemChange('price', e.target.value) : handleNewMenuItemChange('price', e.target.value)}
                                    />
                                </div>
                                <div className={styles.modalActions}>
                                    <button className={styles.saveButton} onClick={isEditing ? handleMenuItemUpdate : handleMenuItemSubmit}>
                                        {isEditing ? '저장' : '추가'}
                                    </button>
                                    <button className={styles.cancelButton} onClick={closeModal}>취소</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 설정 화면 내용 */}
                    {currentSettingTab === 'notice' && (
                        <div className={styles.settingContent}>
                            <h4>공지사항 관리</h4>
                            <div className={styles.field}>
                                <label>공지사항 내용</label>
                                <textarea
                                    value={notice}
                                    onChange={(e) => setNotice(e.target.value)}
                                    placeholder="가게 공지사항이 없습니다"
                                    rows="4"
                                ></textarea>
                            </div>
                            <button className={styles.saveButton} onClick={handleNoticeSave}>
                                {noticeExists ? '공지사항 수정' : '공지사항 추가'}
                            </button>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default StoreManagementPage;

