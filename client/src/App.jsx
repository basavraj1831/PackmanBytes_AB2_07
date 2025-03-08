import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/nav'
import LandingPage from './components/land'
import Donor from './components/Donor'
import Home from './components/home'
import RequestBlood from './components/RequestBlood'
import BloodTypes from './components/BloodTypes'
import Login from './components/Login'
import Signup from './components/Signup'
import EmailVerify from './components/EmailVerify'
import ResetPassword from './components/ResetPassword'
import Chatbot from './components/Chatbot'
import DonorsNearby from './components/DonorsNearby'
import Profile from './components/Profile'
import DonorList from './components/Donorlist'
import Update from './components/Update'
import Leaderboard from './components/Leaderboard'
import MyDonations from './components/MyDonation'
import NearbyHospitals from './components/NearbyHospitals'
import UserAuthentication from './components/UserAuthentication'
import SOSButton from './components/SOSButton'


function App() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceWorker.js')
            .then((reg) => console.log('Service Worker Registered!', reg))
            .catch((err) => console.error('Service Worker Registration Failed:', err));
    });
}
  const location = useLocation();
  const background = location.state && location.state.background;
  
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('nav')
      if (window.scrollY > 0) {
        nav.classList.add('nav-scrolled')
      } else {
        nav.classList.remove('nav-scrolled')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes location={background || location}>
        <Route element={<UserAuthentication/>}>
          <Route path="/donor" element={<Donor />} />
          <Route path="/request" element={<RequestBlood />} />
          <Route path="/near" element={<DonorsNearby/>} />
          <Route path='/profile' element={<Profile/>}/>
          <Route path="/receiver" element={<DonorList/>} />
          <Route path="/update" element={<Update/>} />
          <Route path="/my-donations" element={<MyDonations />} />
          <Route path="/nearby-hospitals" element={<NearbyHospitals />} />
        </Route>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path='/sos' element={<SOSButton/>} />
     
        <Route path="/learn" element={<BloodTypes />} />
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/forgot-password' element={<ResetPassword/>}/>

      </Routes>

      {/* Show auth modals when we have a background location */}
      {background && (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
        </Routes>
      )}

      {/* Add Chatbot */}
      <Chatbot />
    </div>
  )
}

// Wrap the app with router
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper
