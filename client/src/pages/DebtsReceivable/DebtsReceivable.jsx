import axios from "axios"
import React, { useEffect } from "react"
import Navbar from "../../Components/Navbar/Navbar"
import { useNavigate } from "react-router-dom"

function DebtsReceivable(){
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/protected`);
            console.log(res.data);
        } catch (error) {
            navigate("/login");
            console.error('Error fetching data:', error);
        }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Navbar />
            <h1>Welcome to DebtsReceivable</h1>
        </div>
    );
}

export default DebtsReceivable;