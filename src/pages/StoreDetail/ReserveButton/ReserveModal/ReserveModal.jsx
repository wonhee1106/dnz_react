import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useState, useEffect } from 'react'
import styles from './ReserveModal.module.css'

function ReserveModal({ storeSeq, name, seatStatus, seatCapacity, onClose, onNext }) {
    // 날짜 선택
    const [reserveDate, setReserveDate] = useState(new Date())
    // 현재 보이는 달의 시작 날짜 (activeStartDate)
    const [activeStartDate, setActiveStartDate] = useState(new Date())
    // 인원 선택 (기본값을 2명으로 설정)
    const [numberOfGuests, setNumberOfGuests] = useState(null)
    // 시간 선택
    const [reserveTime, setReserveTime] = useState('')

    const [guestPage, setGuestPage] = useState(0) // 현재 인원 페이지
    const [timePage, setTimePage] = useState(0) // 현재 시간 페이지

    const guestsPerPage = 5 // 한 페이지에 표시할 인원 버튼 수
    const timesPerPage = 4 // 한 페이지에 표시할 시간 버튼 수

    // 남은 좌석 계산
    const remainingSeats = seatCapacity - seatStatus;

    const handleDateChange = date => {
        setReserveDate(date)
    }

    const handleGuestClick = guests => {
        if (guests > remainingSeats) {
            alert('선택한 인원이 남은 좌석 수를 초과합니다.')
        } else {
            setNumberOfGuests(guests)
        }
    }

    const handleTimeClick = (time) => {
        // 필수 항목들 전부 선택하지 않으면 다음 모달로 이동하지 못 하도록 제어
        if (!reserveDate || !time || numberOfGuests === null) {
            alert('모든 필수 항목(날짜, 인원, 시간)을 선택해 주세요.')
            return;
        }
    
        // 상태 업데이트
        setReserveTime(time);
    
        // 시간 선택 시 부모 컴포넌트에서 다음 모달로 이동하도록 onNext 호출
        onNext({
            storeSeq,
            time,
            guests: numberOfGuests,
            date: reserveDate,
            name,
        });
    }
    

    // 오늘 버튼 클릭 시 오늘 날짜로 이동하고 캘린더도 오늘의 달로 전환
    const handleTodayClick = () => {
        const today = new Date() // 현재 날짜 가져오기
        setReserveDate(today) // 상태에 오늘 날짜 설정
        setActiveStartDate(today) // 캘린더도 오늘의 달로 전환
    }

    useEffect(() => {
        console.log('오늘 날짜로 업데이트된 reserveDate:', reserveDate)
    }, [reserveDate])

    // 좌우 페이지 버튼을 눌렀을 때 인원 페이지 변경
    const changeGuestPage = direction => {
        if (direction === 'left' && guestPage > 0) {
            setGuestPage(guestPage - 1)
        } else if (
            direction === 'right' &&
            (guestPage + 1) * guestsPerPage < 15
        ) {
            setGuestPage(guestPage + 1)
        }
    }

    // 좌우 페이지 버튼을 눌렀을 때 시간 페이지 변경
    const changeTimePage = direction => {
        if (direction === 'left' && timePage > 0) {
            setTimePage(timePage - 1)
        } else if (
            direction === 'right' &&
            (timePage + 1) * timesPerPage < filteredTimes.length
        ) {
            setTimePage(timePage + 1)
        }
    }

    // 현재 페이지에 따라 표시될 인원 버튼 목록
    const visibleGuests = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    ].slice(guestPage * guestsPerPage, (guestPage + 1) * guestsPerPage)

    // 시간 목록
    const availableTimes = [
        '03:25',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
        '18:00',
        '18:30',
        '19:00',
        '19:30',
        '20:00',
        '20:30',
        '21:00',
        '21:30',
        '22:00',
        '23:59',
    ]

    // 오늘 날짜인지 확인
    const isToday = reserveDate.toDateString() === new Date().toDateString()

    // 오늘 날짜인 경우 현재 시간 이후의 시간만 표시
    const currentHour = new Date().getHours()
    const currentMinute = new Date().getMinutes()

    const filteredTimes = availableTimes.filter(time => {
        if (isToday) {
            const [hour, minute] = time.split(':').map(Number)
            return (
                hour > currentHour ||
                (hour === currentHour && minute > currentMinute)
            )
        }
        return true
    })

    // 현재 페이지에 따라 표시될 시간 버튼 목록
    const visibleTimes = filteredTimes.slice(
        timePage * timesPerPage,
        (timePage + 1) * timesPerPage
    )

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.reserveModalContainer}>
                {/* 남은 좌석 수 표시 */}
                <div className={styles.remainingSeats}>
                    남은 좌석: {remainingSeats}
                </div>
                {/* 캘린더와 오늘 버튼을 함께 표시 */}
                <div className={styles.calendarContainer}>
                    <button
                        className={styles.todayButton}
                        onClick={handleTodayClick}
                    >
                        오늘
                    </button>
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
                        minDate={new Date(new Date().setHours(0, 0, 0, 0))} // 오늘 날짜까지 활성화 (시간을 0으로 설정)
                        activeStartDate={activeStartDate} // 캘린더가 시작하는 날짜를 설정 (오늘로 이동 시 달력도 이동)
                        onActiveStartDateChange={({ activeStartDate }) =>
                            setActiveStartDate(activeStartDate)
                        }
                        tileDisabled={({ date }) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                        } // 오늘 이전 날짜만 비활성화
                        tileClassName={({ date }) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                ? styles.disabledTile
                                : ''
                        }
                    />
                </div>
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
                        disabled={(guestPage + 1) * guestsPerPage >= 15} // 마지막 페이지일 때 비활성화
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
                        {filteredTimes.length > 0 ? (
                            visibleTimes.map(time => (
                                <div
                                    key={time}
                                    className={`${styles.timeButton} ${
                                        reserveTime === time
                                            ? styles.active
                                            : ''
                                    }`}
                                    onClick={() => handleTimeClick(time)}
                                >
                                    {time}
                                </div>
                            ))
                        ) : (
                            <div className={styles.noTimesMessage}>
                                예약 가능한 시간이 없습니다. 다른 날짜를
                                선택해주세요.
                            </div>
                        )}
                    </div>
                    <button
                        className={styles.scrollButton.right}
                        onClick={() => changeTimePage('right')}
                        disabled={
                            (timePage + 1) * timesPerPage >=
                            filteredTimes.length
                        } // 마지막 페이지일 때 비활성화
                    >
                        {'>'}
                    </button>
                </div>
                <div className={styles.closeButton} onClick={onClose}>
                    닫기
                </div>
            </div>
        </div>
    )
}

export default ReserveModal
