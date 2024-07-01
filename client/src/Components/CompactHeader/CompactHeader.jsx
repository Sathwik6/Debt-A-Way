import axios from "axios"
import React, { useEffect, useState } from "react"
import './CompactHeader.css';

const CompactHeader = () => {
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
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/wallet-balance`);
            setWalletBalance(response.data.walletBalance);
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
        }
    };
    
    const fetchDebtsOwed = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/activeDebtsTotal`);
            setDebtsOwed(response.data.activeDebtsTotal);
        } catch (error) {
            console.error('Error fetching debts owed:', error);
        }
    };
    
    const fetchDebtsReceivable = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/activeLendTotal`);
            setDebtsReceivable(response.data.activeLendTotal);
        } catch (error) {
            console.error('Error fetching debts receivable:', error);
        }
    };






    return (
        <div className="compact-header">
            <div>
                <h7>
                    Debts Owed
                </h7>
                <div className="compact-number">${debtsOwed}</div> 
            </div>


            <div>
                <h7>
                Debts Recievable
                </h7>
                <div className="compact-number"> ${debtsReceivable}</div> 
            </div>


            <div>
                <h7>
                Balance
                </h7>
                <div className="compact-number">${walletBalance}</div>
            </div>
            
        </div>
    )
};


export default CompactHeader;