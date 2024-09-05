import { useState } from 'react'
import ReserveButton from './ReserveButton/ReserveButton'
import ReserveModal from './ReserveButton/ReserveModal/ReserveModal'

function StoreDetail() {
    return (
        <div>
            <div>여기는 디테일 영역</div>
            <div>
                <ReserveButton />
            </div>
        </div>
    )
}

export default StoreDetail
