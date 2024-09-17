import { useNavigate } from 'react-router-dom'
import 'react-calendar/dist/Calendar.css'
import { useState } from 'react'
import ReserveDetail from './ReserveDetail/ReserveDetail'

function FinalConfirmReserveButton({ date, time, guests, storeSeq, name }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

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
                    storeSeq={storeSeq}
                    name={name}
                    reservationInfo={{ date, time, guests }} // 예약 정보를 모달로 전달
                />
            )}
        </div>
    )
}

export default FinalConfirmReserveButton
