import axios from "axios"
import { Toaster, toast } from "sonner"
import Navbar from "../../Components/Navbar/Navbar.jsx"
import MyDebtPostings from "../../Components/MyDebtPostings/MyDebtPostings.jsx";
import MyTradePostings from "../../Components/MyTradePostings/MyTradePostings.jsx"
import { useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import './MyListings.css'



axios.defaults.withCredentials = true;

function MyListings(){
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
        <div className="myListings-page">
            <MyDebtPostings/>
            <MyTradePostings/>
        </div>
        
        
        </>

        
    )
};

export default MyListings;