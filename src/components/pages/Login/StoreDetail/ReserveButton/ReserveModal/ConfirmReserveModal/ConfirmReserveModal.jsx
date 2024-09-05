import { useLocation, useNavigate } from 'react-router-dom'
import styles from './ConfirmReserveModal.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'

function ConfirmReserveModal() {
    const navigate = useNavigate()
    const location = useLocation()

    // 전달된 시간 데이터 받기
    const { date, time, guests } = location.state

    const cancelModal = () => {
        navigate(-1)
    }

    const nextModal = () => {
        navigate('/tablesReserve')
    }

    const formatDate = date => {
        const dateString = date.toLocaleDateString('ko-KR', {
            month: 'numeric',
            day: 'numeric',
            weekday: 'short',
        })
        const parts = dateString.split(' ') // 공백으로 분리
        return `${parts[0]} ${parts[1].replace('.', '')} ${parts[2]}` // day의 . 제거
    }

    return (
        <div className={styles.confirmReserveModalContainer}>
            <div className={styles.modalHeader}>
                <h2>{formatDate(date)} 방문이 맞으신가요?</h2>
                <p>방문 일정을 다시 한번 확인해 주세요..</p>
            </div>
            <div className={styles.reserveContent}>
                <div className={styles.reserveInfo}>
                    <div className={styles.reserveInfoItem}>
                        <FontAwesomeIcon
                            icon={faCalendar}
                            className={styles.icon}
                        />
                        <span>{formatDate(date)}</span>
                    </div>
                    <div className={styles.reserveInfoItem}>
                        <FontAwesomeIcon
                            icon={faClock}
                            className={styles.icon}
                        />
                        <span>{time}</span>
                    </div>
                    <div className={styles.reserveInfoItem}>
                        <FontAwesomeIcon
                            icon={faUser}
                            className={styles.icon}
                        />
                        <span>{guests}명</span>
                    </div>
                </div>
                <p className={styles.reservNotice}>
                    당일 취소 및 노쇼는 식당뿐만 아니라 다른 고객님께도 피해가
                    될 수 있으므로 신중히 예약 부탁드립니다 :)
                </p>
            </div>
            <div className={styles.buttonBox}>
                <div className={styles.closeButton} onClick={cancelModal}>
                    취소
                </div>
                <div className={styles.nextButton} onClick={nextModal}>
                    확인
                </div>
            </div>
        </div>
    )
}
export default ConfirmReserveModal
