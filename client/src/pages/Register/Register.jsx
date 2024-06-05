import {Link} from "react-router-dom"
import React, { useState } from "react"
import './Register.css'

function Register(){
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

    function handleSubmit(event){
        event.preventDefault();
        console.log(formData)
    }

    return (
    <div className="register-page">
        <div className="org_title-container"> <h1>Debt-A-Way </h1></div>
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
            <p> Have an account? &nbsp; 
                <Link to="/login">  Log in</Link>
            </p>
        </div>
    </div>
    )
}

export default Register;