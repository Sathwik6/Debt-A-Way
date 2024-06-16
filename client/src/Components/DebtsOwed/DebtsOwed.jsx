import axios from "axios"
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import './DebtsOwed.css'

function DebtsOwed(){
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
        <div className="debts-owed-container">
            <h1>DebtsOwed</h1>
        </div>
    );
}

export default DebtsOwed;