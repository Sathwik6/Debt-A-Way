import axios from "axios"
import React, {useState}from "react";
import { Link, useNavigate } from 'react-router-dom';

function Login (props) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
      });

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(formData);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/routes/auth/login`, 
                formData
            );
            console.log(response);
            if (response.status === 200){
                props.authorized(true);
                navigate("/home");
            }
        } catch (error) {
            alert("Invalid Credentials")
            console.error("Login failed:", error);
        }
    }

    return (
        <div className="Login">
            <div className="Login-form">
                <form className="form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button type="submit"> Login </button>
                </form>
            </div>
            <p> Don't have an account? &nbsp; 
                <Link to="/register">Sign up</Link> 
            </p>
        </div>
    );
}

export default Login;
