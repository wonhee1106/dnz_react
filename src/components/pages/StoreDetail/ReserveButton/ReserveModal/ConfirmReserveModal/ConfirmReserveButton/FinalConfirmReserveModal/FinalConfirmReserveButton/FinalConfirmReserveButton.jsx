import { useNavigate } from 'react-router-dom'
import 'react-calendar/dist/Calendar.css'
import { useState } from 'react'
import ReserveDetail from './ReserveDetail/ReserveDetail'

function FinalConfirmReserveButton() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    // 예약할 정보를 상태로 저장
    const [reservationInfo, setReservationInfo] = useState({
        date: new Date(),
        time: '오후 7:00',
        guests: 3,
    })

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    return (
        <div>
            <button onClick={openModal}>예약하기</button>
            {isModalOpen && (
                <ReserveDetail
                    closeModal={closeModal}
                    reservationInfo={reservationInfo} // 예약 정보를 모달로 전달
                />
            )}
        </div>
    )
}

export default FinalConfirmReserveButton
