import { useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useState } from 'react'
import styles from './ReserveButton.module.css'
import ReserveModal from './ReserveModal/ReserveModal'

function ReserveButton() {
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
            {isModalOpen && <ReserveModal closeModal={closeModal} />}
        </div>
    )
}
export default ReserveButton
