import axios from "axios"
import {Link, useNavigate} from "react-router-dom"
import React, { useState } from "react"

function Register(){
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username : "",
        email : "",
        password : "",
        confirmPassword : ""
    })

    function handleChange(event){
        const { name, value } = event.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(formData)

        try {
            if (formData.password != formData.confirmPassword){
                alert("passowrd Doesn't match");
            }else{
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/routes/auth/register`, 
                    {
                        username: formData.username,
                        email: formData.email,
                        password: formData.password
                    }
                );
                console.log(response);
                navigate("/login");
            }
        } catch (error) {
            alert(error.message)
            console.error("Login failed:", error);
        }
    }

    return (
    <div className="Register">
        <div className="Register-form">
            <form className="form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    placeholder="Email"
                    name="email"
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
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
                <button type="submit"> Sign up </button>
            </form>
        </div>
        <p> Have an account &nbsp;
            <Link to="/login">Log in</Link>
        </p>
    </div>
    )
}

export default Register;