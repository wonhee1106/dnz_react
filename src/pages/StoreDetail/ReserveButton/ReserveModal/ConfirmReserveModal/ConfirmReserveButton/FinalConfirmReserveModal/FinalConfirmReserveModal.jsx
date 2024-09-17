import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../../../../../../../config/config'
import styles from './FinalConfirmReserveModal.module.css'

function FinalConfirmReserveModal() {
    const navigate = useNavigate()
    const location = useLocation()

    const { date, time, guests, storeSeq, name } = location.state

    const [storeName, setStoreName] = useState('') // 음식점 이름 저장

    useEffect(() => {
        // storeSeq로 음식점 이름을 서버에서 가져오는 함수
        const fetchStoreName = async () => {
            try {
                const response = await api.get(`/store/${storeSeq}/name`)
                setStoreName(response.data.name) // 서버로부터 음식점 이름을 받아옴
            } catch (error) {
                console.error('음식점 이름을 불러오는 중 오류 발생:', error)
            }
        }

        if (storeSeq) {
            fetchStoreName() // storeSeq가 존재할 경우에만 서버 호출
        }
    }, [storeSeq])

    const goToMain = () => {
        navigate('/')
    }

    const checkReservation = () => {
        navigate('/reserveDetail', {
            state: { date, time, guests, storeSeq, name },
        })
    }

    const formatDate = date => {
        const dateString = date.toLocaleDateString('ko-KR', {
            month: 'numeric',
            day: 'numeric',
            weekday: 'short',
        })
        const parts = dateString.split(' ')
        return `${parts[0]} ${parts[1].replace('.', '')} ${parts[2]}`
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
                        <span>{name}</span>{' '}
                    </div>
                    <div className={styles.reserveInfoRow}>
                        <span>예약일시</span>
                        <span>
                            {formatDate(date)} {time} {guests}명
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
