import axios from "axios"
import { Toaster, toast } from "sonner"
import Navbar from "../../Components/Navbar/Navbar.jsx"
import { useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import UnfullfilledDebts from "../../Components/UnfulfilledDebts/UnfulfilledDebts.jsx";
import TradableDebts from "../../Components/TradableDebts/TradableDebts.jsx";
import CompactHeader from "../../Components/CompactHeader/CompactHeader.jsx";
import './Shopping.css'


axios.defaults.withCredentials = true;

function Shopping(){
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
        <div className="shopping-page">
        <div className="compactheader">
                <CompactHeader />
            </div>
            <div className="shopping-tables">
                <UnfullfilledDebts/>
                <TradableDebts/>
            </div>
             </div>
        </>

        
    )
};

export default Shopping;