import axios from "axios"
import Navbar from "../Components/Navbar";
import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

function Home(){
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
            <h1>
                Welcome to Home Page!
            </h1>
        </div>
    )
}

export default Home;