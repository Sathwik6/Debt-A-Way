import axios from "axios";
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/routes/auth/logout`);
        console.log(response);
        
        navigate("/login");
    
    } catch (error) {
        toast.error('Invalid Credentials');
        console.error("Login failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Debt-a-way</div>
      <div className="navbar-links">
        <div className="navbar-links-left">
          <Link to="/home">Home</Link>
          <Link to="/debts-owed">Debts Owed</Link>
          <Link to="/debts-receivable">Debts Receivable</Link>
          <Link to="/wallet">Wallet</Link>
        </div>
        <div className="navbar-links-right">
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;