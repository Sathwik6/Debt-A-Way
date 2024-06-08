import axios from "axios"
import React, {useState}from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css";
import { ClipLoader } from "react-spinners";
import { Toaster, toast } from 'sonner'

function Login (props) {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

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
        // validate user input
        if (!formData.email && !formData.password){
            toast.warning('Please enter valid email');
            return;
        }else if (!formData.email){
            toast.warning('Please enter valid email');
            return;
        } else if (!formData.password){
            toast.error('Password required!');
            return;
        }

         // send request to back end
        console.log(formData);
        setLoading(true);
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
            toast.error('Invalid Credentials');
            console.error("Login failed:", error);
        }
        setLoading(false);
    }

    return (
        <div className="Login-container">
            <Toaster position="top-center" richColors />
            { 
            loading ? 

            <ClipLoader className="loader"
            size={60}
            color={"#7289da"}
            loading={loading}
            />  
            
            :

            <div className="Login-page">
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
            }
        </div>
        
    );
}

export default Login;