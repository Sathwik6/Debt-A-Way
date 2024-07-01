import axios from "axios"
import { Toaster, toast } from "sonner"
import Navbar from "../../Components/Navbar/Navbar.jsx"
import { useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import Header from "../../Components/Header/Header.jsx"
import './Home.css'
import NewDebtPosting from "../../Components/NewDebtPosting/NewDebtPosting.jsx";
import DebtsOwed from "../../Components/DebtsOwed/DebtsOwed.jsx"
import DebtsReceivable from "../../Components/DebtsReceivable/DebtsReceivable.jsx"
import Wallet from "../../Components/Wallet/Wallet.jsx"


axios.defaults.withCredentials = true;

function Home(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const isAuthorized = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/protected`);
                console.log(response.data);
            } catch (error) {
                navigate("/login");
                console.error('Error fetching data:', error);
            }
        };

        isAuthorized();
    }, []);


    return (
        <>
        <Navbar />
        <div className="home-page">
            <Header className="header"/>
            <div className="home-tables">
                <DebtsOwed/>
                <DebtsReceivable/>
            </div>
            
            <Wallet />
            
        </div>
        
        
        </>

        
    )
};

export default Home;