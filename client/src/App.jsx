import React from "react"
import Home from "./pages/Home"
import Wallet from "./pages/Wallet"
import Login from "./pages/Login/Login"
import DebtsOwed from "./pages/DebtsOwed"
import Register from "./pages/Register/Register"
import DebtsReceivable from "./pages/DebtsReceivable"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/debts-owed" element={<DebtsOwed/>} />
        <Route path="/debts-receivable" element={<DebtsReceivable/>} />
        <Route path="/wallet" element={<Wallet/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
