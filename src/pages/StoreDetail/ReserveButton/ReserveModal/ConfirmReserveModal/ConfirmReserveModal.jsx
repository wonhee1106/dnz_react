import styles from './ConfirmReserveModal.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCalendar,
    faClock,
    faUser,
} from '@fortawesome/free-regular-svg-icons'
import { api } from '../../../../../config/config'
import { useAuthStore } from 'utils/store'
import { useState } from 'react'

function ConfirmReserveModal({
    date,
    time,
    guests,
    storeSeq,
    name,
    onClose,
    onNext,
}) {
    const { token } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false) // 로딩 상태

    const nextModal = async () => {
        setIsLoading(true) // 예약 요청을 보내는 동안 로딩 상태로 전환
        try {
            const reservationData = {
                storeSeq: storeSeq,
                reservationDate: new Date(
                    date.getTime() - date.getTimezoneOffset() * 60000
                )
                    .toISOString()
                    .split('T')[0], // 예약 날짜 포맷
                reservationTime: time,
                numGuests: guests,
                name: name,
            }

            const response = await api.post(`/reservation`, reservationData, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (response.status === 200) {
                console.log('예약 성공!')
                onNext() // 부모 컴포넌트에서 최종 모달로 전환
            } else if (response.status === 403) {
                alert(response.data) // 예약 불가 메시지를 그대로 표시
            } else {
                alert('예약 실패! 다시 시도해 주세요.')
            }
        } catch (error) {
            alert('당일 취소로 인해 24시간 동안 예약이 불가능합니다.')
        } finally {
            setIsLoading(false) // 요청이 완료되면 로딩 상태 해제
        }
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
            <div className={styles.confirmReserveModalContainer}>
                <div className={styles.modalHeader}>
                    <h2>{formatDate(date)} 방문이 맞으신가요?</h2>
                    <p>방문 일정을 다시 한번 확인해 주세요.</p>
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
                        당일 취소 및 노쇼는 식당뿐만 아니라 다른 고객님께도
                        피해가 될 수 있으므로 신중히 예약 부탁드립니다 :)
                    </p>
                </div>
                <div className={styles.buttonBox}>
                    <div className={styles.closeButton} onClick={onClose}>
                        취소
                    </div>
                    <div className={styles.nextButton} onClick={nextModal}>
                        {isLoading ? '예약 중...' : '예약 확정'}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmReserveModal
