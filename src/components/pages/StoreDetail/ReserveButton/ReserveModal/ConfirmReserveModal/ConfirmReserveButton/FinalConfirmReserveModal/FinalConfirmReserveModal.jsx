import { useLocation, useNavigate } from 'react-router-dom'
import styles from './FinalConfirmReserveModal.module.css'

function FinalConfirmReserveModal() {
    const navigate = useNavigate()
    const location = useLocation()

    const { date, time, guests } = location.state

    const goToMain = () => {
        navigate('/main')
    }

    const checkReservation = () => {
        navigate('/reserveDetail')
    }

    const formatDate = date => {
        const dateString = date.toLocaleDateString('ko-KR', {
            month: 'numeric',
            day: 'numeric',
            weekday: 'short',
        })
        const parts = dateString.split(' ')
        return `${parts[0]} ${parts[1].replace('.', '')} ${parts[2]}` // day의 . 제거
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.finalConfirmModalContainer}>
                <div className={styles.modalHeader}>
                    <h2>예약이 완료되었습니다.</h2>
                </div>
                <div className={styles.reserveContent}>
                    <div className={styles.reserveInfoRow}>
                        <span>음식점</span>
                        <span>음식점 이름</span>{' '}
                        {/* 여기에 실제 음식점 이름을 넣기 */}
                    </div>
                    <div className={styles.reserveInfoRow}>
                        <span>예약일시</span>
                        <span>
                            {formatDate(date)}, {time} {guests}명
                        </span>
                    </div>
                </div>
                <div className={styles.buttonBox}>
                    <button
                        className={styles.goToMainButton}
                        onClick={goToMain}
                    >
                        메인으로 가기
                    </button>
                    <button
                        className={styles.checkReservationButton}
                        onClick={checkReservation}
                    >
                        예약내역 확인
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FinalConfirmReserveModal
