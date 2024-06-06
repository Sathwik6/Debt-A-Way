import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import React, { useState } from 'react'
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import './App.css'


function App() {

  const [isAuthorized, setIsAuthorized] = useState(false);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthorized ? "/home" : "/login"} />} />
        <Route path="/login" element={<Login authorized={setIsAuthorized} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
