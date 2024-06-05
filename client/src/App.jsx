import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import React, { useState } from 'react'
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"


function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login"/>} />
        <Route path="login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
