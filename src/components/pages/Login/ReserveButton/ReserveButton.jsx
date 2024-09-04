import { useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useState } from 'react'

function ReserveModal() {
    const navigate = useNavigate()

    const closeModal = () => {
        navigate(-1)
    }

    // 날짜 선택
    const [reserveDate, setReserveDate] = useState(new Date())
    // 인원 선택
    const [numberOfGuests, setNuberOfGuests] = useState(1)

    return (
        <div className={Styles.reserveModalContainer}>
            <h1>오늘</h1>
        </div>
    )
}
