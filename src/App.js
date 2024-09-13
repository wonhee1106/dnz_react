import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from 'react-router-dom'
import Body from 'pages/Body/Body.jsx'
import Footer from 'pages/Footer/Footer.jsx'
import Login from 'pages/Login/Index.jsx'
import Alam from 'pages/Alampage/Alam.jsx'
import StoreDetail from 'pages/StoreDetail/StoreDetail.jsx'
import ConfirmReserveModal from 'pages/StoreDetail/ReserveButton/ReserveModal/ConfirmReserveModal/ConfirmReserveModal.jsx'
import Mypage from 'pages/Mypages/Mypage.jsx'

import FinalConfirmReserveModal from 'pages/StoreDetail/ReserveButton/ReserveModal/ConfirmReserveModal/ConfirmReserveButton/FinalConfirmReserveModal/FinalConfirmReserveModal.jsx'
import ReserveDetail from 'pages/StoreDetail/ReserveButton/ReserveModal/ConfirmReserveModal/ConfirmReserveButton/FinalConfirmReserveModal/FinalConfirmReserveButton/ReserveDetail/ReserveDetail.jsx'
import MyDining from 'pages/MyDining/MyDining.jsx'

import StoreManagementPage from './components/pages/StoreManagementPage/StoreManagementPage.jsx'
import '@fortawesome/fontawesome-free/css/all.min.css'
import StoreAddPage from './components/pages/StoreAddPage/StoreAddPage.jsx'

const AppContent = () => {
    const location = useLocation() // 현재 경로 확인

    const isStoreManagementPage = location.pathname === '/storemanagementpage' // StoreManagementPage 경로 확인 (작은 따음표기때문에 대소문자 구분 有)

    return (
        <div className="App">
            {/* StoreManagementPage가 아닐 때만 Header와 Footer를 렌더링 */}
            {!isStoreManagementPage && <Header />}
            <Routes>
                <Route path="/" element={<Body />} />
                <Route path="/login" element={<Login />} />
                <Route path='/mypage' element={<Mypage />} />
                <Route path="/store/:storeId" element={<StoreDetail />} />
                <Route path="/alarm" element={<Alam />} />
                <Route
                    path="/confirmReserve"
                    element={<ConfirmReserveModal />}
                />
                <Route
                    path="/StoreManagementPage"
                    element={<StoreManagementPage />}
                />

                <Route
                    path="/finalconfirmReserve"
                    element={<FinalConfirmReserveModal />}
                />
                <Route path="/reserveDetail" element={<ReserveDetail />} />
                <Route path="/storeadd" element={<StoreAddPage />} />
                <Route path="/myDining" element={<MyDining />} />
            </Routes>
            {!isStoreManagementPage && <Footer />}
        </div>
    )
}

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    )
}

export default App
