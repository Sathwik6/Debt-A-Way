import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from "./pages/Home"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
