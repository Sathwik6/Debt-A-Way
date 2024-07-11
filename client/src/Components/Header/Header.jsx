import axios from "axios"
import { useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import './Header.css'

function Header(){
    const [debtsOwed, setDebtsOwed] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);
    const [debtsReceivable, setDebtsReceivable] = useState(0);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        await fetchDebtsOwed();
        await fetchWalletBalance();
        await fetchDebtsReceivable();
    };

    const fetchWalletBalance = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/wallet-balance`, {
                withCredentials: true,
            });
            setWalletBalance(response.data.walletBalance);
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
        }
    };
    
    const fetchDebtsOwed = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/activeDebtsTotal`, {
                withCredentials: true,
            });
            setDebtsOwed(response.data.activeDebtsTotal);
        } catch (error) {
            console.error('Error fetching debts owed:', error);
        }
    };
    
    const fetchDebtsReceivable = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/activeLendTotal`, {
                withCredentials: true,
            });
            setDebtsReceivable(response.data.activeLendTotal);
        } catch (error) {
            console.error('Error fetching debts receivable:', error);
        }
    };

    return (
        <div  className="tiles-container">
            <div  className="tile">
                <div className="tile-number">${walletBalance}</div>
                <div className="tile-title">Wallet Balance</div>
            </div>
            <div  className="tile">
                <div className="tile-number">${debtsOwed}</div> 
                <div className="tile-title">Debts Owed</div>
            </div>
            <div  className="tile" >
                <div className="tile-number"> ${debtsReceivable}</div> 
                <div className="tile-title">Debts Receivable</div>
            </div>
        </div>
    );
}

export default Header;