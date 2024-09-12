import 'react-calendar/dist/Calendar.css'
import { useState } from 'react'
import ReserveModal from './ReserveModal/ReserveModal'

function ReserveButton({ storeSeq, name }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    return (
        <div>
            <button onClick={openModal} className="reserve-button">
                예약하기
            </button>
            {isModalOpen && (
                <ReserveModal
                    storeSeq={storeSeq}
                    name={name}
                    closeModal={closeModal}
                />
            )}
        </div>
    )
}
export default ReserveButton
