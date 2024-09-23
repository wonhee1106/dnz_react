import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // 'jwt-decode' 기본 수입
import styles from './Bookmark.module.css';
import { api } from '../../../config/config';
import { useAuthStore } from 'utils/store';

const Bookmark = () => {
    const { userId } = useAuthStore.getState();
    const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState([]);

    useEffect(() => {
        const fetchBookmarkedRestaurants = async () => {
            try {
                const response = await api.get(`/bookmark/user/${userId}`); // 사용자 ID를 통한 북마크 조회
                setBookmarkedRestaurants(response.data);
            } catch (error) {
                console.error('Error fetching bookmarked restaurants:', error);
            }
        };

        fetchBookmarkedRestaurants();
    }, [userId]);

    const toggleBookmark = async (e, restaurantId) => {
        e.stopPropagation();
        
        const bookmark = {
            userId,
            storeSeq: restaurantId,
        };
        
        try {
            const response = await api.post(`/bookmark/remove`, bookmark); // 북마크 삭제 API 호출
            
            if (response.status === 200) {
                const updatedRestaurants = bookmarkedRestaurants.filter(restaurant => restaurant.storeSeq !== restaurantId);
                setBookmarkedRestaurants(updatedRestaurants);
            } else {
                console.error('Failed to toggle bookmark:', response.status);
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };
    
    return (
        <div>
            <h2>북마크 목록</h2>
            <ul>
                {bookmarkedRestaurants.map((restaurant) => (
                    <li key={restaurant.storeSeq}>
                        <span>{restaurant.name}</span>
                        <button onClick={(e) => toggleBookmark(e, restaurant.storeSeq)}>
                            {restaurant.isBookmarked ? '북마크 해제' : '북마크'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Bookmark;

