import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Body from './components/Body/Body.jsx'
import Footer from './components/Footer/Footer.jsx'
import Login from './components/pages/Login/Index.jsx'
import Alam from './components/pages/Alampage/Alam.jsx'
import StoreDetail from './components/pages/StoreDetail/StoreDetail.jsx'
import ConfirmReserveModal from './components/pages/StoreDetail/ReserveButton/ReserveModal/ConfirmReserveModal/ConfirmReserveModal.jsx'

import FinalConfirmReserveModal from './components/pages/StoreDetail/ReserveButton/ReserveModal/ConfirmReserveModal/ConfirmReserveButton/FinalConfirmReserveModal/FinalConfirmReserveModal.jsx'
import ReserveDetail from './components/pages/StoreDetail/ReserveButton/ReserveModal/ConfirmReserveModal/ConfirmReserveButton/FinalConfirmReserveModal/FinalConfirmReserveButton/ReserveDetail/ReserveDetail.jsx'

// import Signup from './components/pages/Signup/signup.jsx'

const App = () => {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<Body />} />
                    <Route path="/login" element={<Login />} />
                    {/* <Route path="/signup" element={<Signup />} /> */}
                    <Route path="/storeDetail" element={<StoreDetail />} />
                    <Route path="/alarm" element={<Alam />} />
                    <Route
                        path="/confirmReserve"
                        element={<ConfirmReserveModal />}
                    />
                    <Route
                        path="/finalconfirmReserve"
                        element={<FinalConfirmReserveModal />}
                    />
                    <Route path="/reserveDetail" element={<ReserveDetail />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    )
}

export default App
