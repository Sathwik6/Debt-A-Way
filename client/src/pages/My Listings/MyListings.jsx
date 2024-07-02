import axios from "axios"
import { Toaster, toast } from "sonner"
import Navbar from "../../Components/Navbar/Navbar.jsx"
import MyDebtPostings from "../../Components/MyDebtPostings/MyDebtPostings.jsx";
import MyTradePostings from "../../Components/MyTradePostings/MyTradePostings.jsx"
import { useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import './MyListings.css'
import NewDebtPosting from "../../Components/NewDebtPosting/NewDebtPosting.jsx";



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
        <div className="postdebtbox">
                <NewDebtPosting /> 
            </div>
            <div className="listing-tables">
                <MyDebtPostings/>
                <div className="botton-table">
                <MyTradePostings/>
                </div>
            </div>
        </div>
        <div className="footer"> hi</div>
        </>

        
    )
};

export default MyListings;