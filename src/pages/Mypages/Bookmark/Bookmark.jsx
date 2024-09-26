import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // 올바르게 import
import { api } from '../../../config/config';
import styles from './Bookmark.module.css';  // CSS 모듈 import

const Bookmark = () => {
    const [userId, setUserId] = useState(null);  // userId 상태 저장
    const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState([]);
    const navigate = useNavigate();

    // JWT 토큰에서 userId 추출하는 함수
    const getUserIdFromToken = () => {
        const token = sessionStorage.getItem('token');  // 세션 스토리지에서 토큰을 가져옴
        if (token) {
            try {
                const decodedToken = jwtDecode(token);  // 토큰을 디코드
                return decodedToken.userSeq;  // 토큰에서 userSeq 값 추출
            } catch (error) {
                console.error("Invalid token", error);
                return null;
            }
        }
        return null;
    };

    // 북마크된 레스토랑을 서버에서 가져오는 함수
    const fetchBookmarkedRestaurants = async () => {
        try {
            const token = sessionStorage.getItem('token');  // 세션 스토리지에서 토큰 가져오기
            if (!token) {
                console.error("No token found in session storage.");
                return;
            }

            if (userId) {
                const response = await api.get(`/bookmark/list`, { 
                    headers: {
                        'Authorization': `Bearer ${token}`  // Authorization 헤더에 토큰 포함
                    }
                });
                setBookmarkedRestaurants(response.data);  // 서버로부터 가져온 북마크 데이터 설정
            } else {
                console.error("userId is null. Cannot fetch bookmarks.");
            }
        } catch (error) {
            console.error('Error fetching bookmarked restaurants:', error);
        }
    };

    // 컴포넌트가 처음 렌더링될 때 userId를 설정하고 북마크 목록을 가져옴
    useEffect(() => {
        const userIdFromToken = getUserIdFromToken();  // 토큰에서 userId 추출
        if (!userIdFromToken) {
            console.log("No userId found, redirecting to login.");
            navigate("/login");  // userId가 없으면 로그인 페이지로 이동
        } else {
            setUserId(userIdFromToken);  // userId 상태 설정
        }
    }, [navigate]);

    // userId가 설정되었을 때 북마크 목록을 가져옴
    useEffect(() => {
        if (userId) {
            fetchBookmarkedRestaurants();  // userId가 있을 때 북마크 목록을 가져옴
        }
    }, [userId]);

    // 북마크 토글 함수 (북마크 추가/제거)
    const toggleBookmark = async (e, restaurantId) => {
        e.stopPropagation();

        const isBookmarked = bookmarkedRestaurants.some(restaurant => restaurant.storeSeq === restaurantId);

        const bookmark = {
            userId,
            storeSeq: restaurantId,
        };

        try {
            const token = sessionStorage.getItem('token');  // 세션 스토리지에서 토큰 가져오기
            if (!token) {
                console.error("No token found in session storage.");
                return;
            }

            if (isBookmarked) {
                const response = await api.post(`/bookmark/remove`, bookmark, {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Authorization 헤더에 토큰 포함
                    }
                });
                if (response.status === 200) {
                    setBookmarkedRestaurants(bookmarkedRestaurants.filter(restaurant => restaurant.storeSeq !== restaurantId));
                } else {
                    console.error('Failed to remove bookmark:', response.status);
                }
            } else {
                const response = await api.post(`/bookmark/add`, bookmark, {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Authorization 헤더에 토큰 포함
                    }
                });
                if (response.status === 200) {
                    setBookmarkedRestaurants([...bookmarkedRestaurants, { storeSeq: restaurantId, isBookmarked: true }]);
                } else {
                    console.error('Failed to add bookmark:', response.status);
                }
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    // 북마크된 레스토랑 클릭 시 해당 레스토랑 상세페이지로 이동
    const handleRestaurantClick = (restaurantId) => {
        navigate(`/store/${restaurantId}`); // 레스토랑 ID로 상세 페이지로 이동
    };

    return (
        <div className={styles.bookmarkContainer}>
            <h2>북마크 목록</h2>
            <ul className={styles.bookmarkList}>
                {bookmarkedRestaurants.length > 0 ? (
                    bookmarkedRestaurants.map((restaurant) => (
                        <li 
                            key={restaurant.storeSeq} 
                            className={styles.bookmarkItem} 
                        >
                            <span 
                                className={styles.storeName} 
                                onClick={() => handleRestaurantClick(restaurant.storeSeq)}
                            >
                                {restaurant.storeName}
                            </span> {/* storeName 출력 */}
                            <button 
                                onClick={(e) => toggleBookmark(e, restaurant.storeSeq)} 
                                className={`${styles.bookmarkButton} ${styles.remove}`}
                            >
                                삭제 {/* 삭제 버튼 */}
                            </button>
                        </li>
                    ))
                ) : (
                    <p className={styles.noBookmarks}>북마크된 레스토랑이 없습니다.</p>
                )}
            </ul>
        </div>
    );
};

export default Bookmark;
