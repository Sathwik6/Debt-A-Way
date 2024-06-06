import axios from "axios"
import React, { useEffect, useState } from "react";

axios.defaults.withCredentials = true;

function Home(){

    const [response, setResponse] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/protected`);
            setResponse(res.data);
            console.log(res.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };

        fetchData();
    }, []);
    

    return (
        <h1>
            Welcome to Home Page!
        </h1>
    )
}

export default Home;