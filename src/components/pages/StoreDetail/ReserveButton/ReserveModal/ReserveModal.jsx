import { useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useState } from 'react'
import styles from './ReserveModal.module.css'

function ReserveModal() {
    const navigate = useNavigate()

    const closeModal = () => {
        navigate(-1)
    }
    // 날짜 선택
    const [reserveDate, setReserveDate] = useState(new Date())
    // 인원 선택
    const [numberOfGuests, setNumberOfGuests] = useState(1)
    // 시간 선택
    const [reserveTime, setReserveTime] = useState('')

    const handleDateChange = date => {
        setReserveDate(date)
    }

    const handleGuestClick = guests => {
        setNumberOfGuests(guests)
    }

    const handleTimeClick = time => {
        setReserveTime(time)
    }

    return (
        <div className={styles.reserveModalContainer}>
            <Calendar onChange={handleDateChange} value={reserveDate} />
            <div className={styles.guestButtons}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(guests => (
                    <div
                        key={guests}
                        className={`${styles.guestButton} ${
                            numberOfGuests === guests ? styles.active : ''
                        }`}
                        onClick={() => handleGuestClick(guests)}
                    >
                        {guests}명
                    </div>
                ))}
            </div>
            <div className={styles.timeButtons}>
                {[
                    '오후 12:00',
                    '오후 12:30',
                    '오후 1:00',
                    '오후 1:30',
                    '오후 2:00',
                    '오후 2:30',
                    '오후 3:00',
                    '오후 3:30',
                ].map(time => (
                    <div
                        key={time}
                        className={`${styles.timeButton} ${
                            reserveTime === time ? styles.active : ''
                        }`}
                        onClick={() => handleTimeClick(time)}
                    >
                        {time}
                    </div>
                ))}
            </div>
            <div className={styles.closeButton} onClick={closeModal}>
                닫기
            </div>
        </div>
    )
}

export default ReserveModal
