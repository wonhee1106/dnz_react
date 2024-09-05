import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Body from './components/Body/Body.jsx'
import Footer from './components/Footer/Footer.jsx'
import Login from './components/pages/Login/Login.jsx'
import StoreDetail from './components/pages/StoreDetail/StoreDetail.jsx'

const App = () => {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<Body />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/storeDetail" element={<StoreDetail />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    )
}

export default App
