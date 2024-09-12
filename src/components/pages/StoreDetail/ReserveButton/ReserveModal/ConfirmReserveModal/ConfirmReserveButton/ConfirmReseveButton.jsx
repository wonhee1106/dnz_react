import { useNavigate } from 'react-router-dom'
import 'react-calendar/dist/Calendar.css'
import { useState } from 'react'
import FinalConfirmReserveModal from './FinalConfirmReserveModal/FinalConfirmReserveModal'

function ConfirmReserveButton({ storeSeq, name }) {
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
                <FinalConfirmReserveModal
                    storeSeq={storeSeq}
                    name={name}
                    closeModal={closeModal}
                />
            )}
        </div>
    )
}
export default ConfirmReserveButton
