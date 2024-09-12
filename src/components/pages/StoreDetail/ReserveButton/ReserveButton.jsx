import 'react-calendar/dist/Calendar.css'
import { useState } from 'react'
import ReserveModal from './ReserveModal/ReserveModal'

function ReserveButton({ storeSeq }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    return (
        <div>

             <button onClick={openModal} className="reserve-button">예약하기</button>
            {isModalOpen && <ReserveModal closeModal={closeModal} />}
        </div>
    )
}
export default ReserveButton
