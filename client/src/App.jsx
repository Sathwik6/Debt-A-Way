import React from "react"
import Home from "./pages/Home/Home"
import Wallet from "./pages/Wallet/Wallet"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {<Route path="/home" element={<Home />} />}
        <Route path="/wallet" element={<Wallet/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
