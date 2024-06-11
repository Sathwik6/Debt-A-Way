import axios from "axios"
import { Toaster, toast } from "sonner"
import Navbar from "../Components/Navbar"
import { useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import Header from "../Components/Header.jsx"
// import TradableDebts from "../Components/TradableDebts.jsx";
import NewDebtPosting from "../Components/NewDebtPosting.jsx";
import UnfulfilledDebts from "../Components/UnfulfilledDebts.jsx";


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
        <div>
            <Navbar />
            <Header />
            <NewDebtPosting />
            <UnfulfilledDebts />
            {/* <TradeableDebts /> */}
        </div>

        
    )
}

export default Home;