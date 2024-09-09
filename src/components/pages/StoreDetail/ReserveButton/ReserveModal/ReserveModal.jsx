import { useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useState } from 'react'
import styles from './ReserveModal.module.css'

function ReserveModal() {
    const navigate = useNavigate()

    const closeModal = () => {
        navigate(-1) // 모달을 닫는 함수
    }

    // 날짜 선택
    const [reserveDate, setReserveDate] = useState(new Date())
    // 인원 선택 (기본값을 2명으로 설정)
    const [numberOfGuests, setNumberOfGuests] = useState(2)
    // 시간 선택
    const [reserveTime, setReserveTime] = useState('')

    const [guestPage, setGuestPage] = useState(0) // 현재 인원 페이지
    const [timePage, setTimePage] = useState(0) // 현재 시간 페이지

    const guestsPerPage = 5 // 한 페이지에 표시할 인원 버튼 수
    const timesPerPage = 4 // 한 페이지에 표시할 시간 버튼 수

    const handleDateChange = date => {
        setReserveDate(date)
    }

    const handleGuestClick = guests => {
        setNumberOfGuests(guests)
    }

    const handleTimeClick = time => {
        setReserveTime(time)
        // 시간 선택 시 다음 예약 모달로 이동
        navigate('/confirmReserve', {
            state: {
                time: time,
                guests: numberOfGuests,
                date: reserveDate,
            },
        })
    }

    // 오늘 버튼 클릭 시 오늘 날짜로 이동
    const handleTodayClick = () => {
        setReserveDate(new Date())
    }

    // 좌우 페이지 버튼을 눌렀을 때 인원 페이지 변경
    const changeGuestPage = direction => {
        if (direction === 'left' && guestPage > 0) {
            setGuestPage(guestPage - 1)
        } else if (
            direction === 'right' &&
            (guestPage + 1) * guestsPerPage < 10
        ) {
            setGuestPage(guestPage + 1)
        }
    }

    // 좌우 페이지 버튼을 눌렀을 때 시간 페이지 변경
    const changeTimePage = direction => {
        if (direction === 'left' && timePage > 0) {
            setTimePage(timePage - 1)
        } else if (direction === 'right' && (timePage + 1) * timesPerPage < 8) {
            setTimePage(timePage + 1)
        }
    }

    // 현재 페이지에 따라 표시될 인원 버튼 목록
    const visibleGuests = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].slice(
        guestPage * guestsPerPage,
        (guestPage + 1) * guestsPerPage
    )

    // 현재 페이지에 따라 표시될 시간 버튼 목록
    const visibleTimes = [
        '오후 12:00',
        '오후 12:30',
        '오후 1:00',
        '오후 1:30',
        '오후 2:00',
        '오후 2:30',
        '오후 3:00',
        '오후 3:30',
    ].slice(timePage * timesPerPage, (timePage + 1) * timesPerPage)

    return (
        <div className={styles.modalOverlay}>
            {' '}
            <div className={styles.reserveModalContainer}>
                {' '}
                <Calendar
                    onChange={handleDateChange}
                    value={reserveDate}
                    calendarType="gregory"
                    locale="ko"
                    formatDay={(locale, date) => date.getDate()}
                    showNeighboringMonth={false}
                    minDetail="year"
                    prev2Label={null}
                    next2Label={null}
                />
                {/* 인원 선택 버튼 */}
                <div className={styles.guestListWrapper}>
                    <button
                        className={styles.scrollButton.left}
                        onClick={() => changeGuestPage('left')}
                        disabled={guestPage === 0} // 첫 페이지일 때는 왼쪽 버튼 비활성화
                    >
                        {'<'}
                    </button>
                    <div className={styles.guestButtons}>
                        {visibleGuests.map(guests => (
                            <div
                                key={guests}
                                className={`${styles.guestButton} ${
                                    numberOfGuests === guests
                                        ? styles.active
                                        : ''
                                }`}
                                onClick={() => handleGuestClick(guests)}
                            >
                                {guests}명
                            </div>
                        ))}
                    </div>
                    <button
                        className={styles.scrollButton.right}
                        onClick={() => changeGuestPage('right')}
                        disabled={(guestPage + 1) * guestsPerPage >= 10} // 마지막 페이지일 때 비활성화
                    >
                        {'>'}
                    </button>
                </div>
                {/* 시간 선택 버튼 */}
                <div className={styles.timeListWrapper}>
                    <button
                        className={styles.scrollButton.left}
                        onClick={() => changeTimePage('left')}
                        disabled={timePage === 0} // 첫 페이지일 때는 왼쪽 버튼 비활성화
                    >
                        {'<'}
                    </button>
                    <div className={styles.timeButtons}>
                        {visibleTimes.map(time => (
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
                    <button
                        className={styles.scrollButton.right}
                        onClick={() => changeTimePage('right')}
                        disabled={(timePage + 1) * timesPerPage >= 8} // 마지막 페이지일 때 비활성화
                    >
                        {'>'}
                    </button>
                </div>
                <div className={styles.closeButton} onClick={closeModal}>
                    닫기
                </div>
            </div>
        </div>
    )
}

export default ReserveModal
