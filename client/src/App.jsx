import React from "react"
import Home from "./pages/Home/Home"
import Shopping from "./pages/Shopping/Shopping"
import MyListings from "./pages/My Listings/MyListings"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import UserDetails from './pages/User-Details/UserDetails'
import Transactions from "./pages/Transactions/Transactions"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/shopping" element={<Shopping/>} />
        <Route path="/myListings" element={<MyListings/>} />
        <Route path="/transaction-logs" element={<Transactions />}/>
        <Route path="/user-details" element={<UserDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
