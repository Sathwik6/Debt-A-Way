import React, {useState}from "react";
import { Link } from 'react-router-dom';
import './Login.css'

function Login(){
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

    function handleSubmit(event) {
        event.preventDefault();
        console.log(formData);
    }

    return (
        <div className="Login">
            <div className="Login-form">
            <h1 className="org_title"> Debt-A-Way </h1>
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