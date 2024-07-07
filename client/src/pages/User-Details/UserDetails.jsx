import './UserDetail.css'
import React, { useEffect, useState } from "react"
import axios from "axios"
import { Toaster, toast } from "sonner"


axios.defaults.withCredentials = true;


const UserDetails = () => {
    const [username, setUsername] = useState('User');
    const [email, setEmail] = useState('Email');
    const [walletBalance, setWalletBalance] = useState('Wallet Balance:');
    const [activeDebtsTotal, setActiveDebtsTotal] = useState('activeDebtsTotal');
    const [activeLendTotal, setActiveLendTotal] = useState('activeLendTotal');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/get-user`);
                const userData = response.data;
                setUsername(userData.username || 'User');
                setEmail(userData.email || 'Email');
                setWalletBalance(userData.walletBalance?.toString() || 'Wallet Balance:');
                setActiveDebtsTotal(userData.activeDebtsTotal?.toString() || 'Active Debts Total:');
                setActiveLendTotal(userData.activeLendTotal?.toString() || 'Active Lend Total:');
            } catch (error) {
                console.error("Error fetching user details:", error);
                toast.error("Failed to fetch user details. Please try again later.");
            }
        };
    
        fetchUser();
    }, []);
    
    


    return (
        <div className="user-details-container" >
             <Toaster position="top-center" richColors />
            <div className="user-details-page">
                    <div className="user-details-form">
                        <h1 className="user_title">User Details</h1>
                        <form className="form">
                            <h3>Name: <p></p>{username}</h3>
                            <h3>Email: <p></p>{email}</h3>
                            <h3>Wallet Balance: <p></p>{walletBalance}</h3>
                            <h3>Active Total Debts: <p></p>{activeDebtsTotal}</h3>
                            <h3>Active Total Lends: <p></p>{activeLendTotal}</h3>
                        </form>
                    </div>
                </div>
        </div>
)};

export default UserDetails;

