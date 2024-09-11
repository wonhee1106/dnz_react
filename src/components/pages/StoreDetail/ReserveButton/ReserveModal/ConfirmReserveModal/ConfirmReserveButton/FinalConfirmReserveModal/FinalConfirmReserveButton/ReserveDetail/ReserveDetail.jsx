import { useLocation } from 'react-router-dom'
import styles from './ReserveDetail.module.css'

function ReserveDetail() {
    const location = useLocation()

    // 예약 정보를 가져옴
    const { restaurantName, date, time, guests } = location.state || {
        restaurantName: '음식점 이름',
        date: new Date(),
        time: '오후 7:00',
        guests: 2,
    }

    const formatDate = date => {
        const dateString = new Date(date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            weekday: 'short',
        })
        return dateString
    }

    return (
        <div className={styles.reservationContainer}>
            <h2 className={styles.title}>나의 예약</h2>
            <div className={styles.reservationCard}>
                <div className={styles.reservationInfoRow}>
                    <div className={styles.imagePlaceholder}>이미지</div>
                    <div className={styles.textInfo}>
                        <p className={styles.restaurantName}>
                            {restaurantName}
                        </p>
                        <p className={styles.additionalInfo}>지역 · 음식종류</p>
                        <p className={styles.dateInfo}>
                            {formatDate(date)}, {time}, {guests}명
                        </p>
                    </div>
                </div>
                <div className={styles.reservationActions}>
                    <button className={styles.changeButton} disabled>
                        예약 변경
                    </button>
                    <button className={styles.cancelButton}>예약 취소</button>
                </div>
            </div>
        </div>
    )
} //test

export default ReserveDetail
