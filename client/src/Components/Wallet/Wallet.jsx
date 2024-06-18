import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Toaster, toast } from "sonner"
import './Wallet.css'

function Wallet(){
    const navigate = useNavigate();

    const [newWalletForm, setNewWalletFrom] = useState({
        amount: 0,
    });

    /*
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
*/

    function handleChange(event) {
        const { name, value } = event.target;
        console.log(name)
        setNewWalletFrom((prevData) => ({
          ...prevData,
          [name]: value
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!newWalletForm.amount){
            toast.warning('Amount Required!');
            return;
        }

        //Update this to look good
        if (newWalletForm.amount <= 0){
            toast.warning('Amount Should be atleast $1.');
            return;
        }

        // send request to back end
        console.log(newWalletForm);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/add-wallet-balance`, 
                newWalletForm.amount,
                { withCredentials: true } // cookiesss
            );
            console.log(response);
            
            if (response.status === 200){
                toast.success("Amount Added to Wallet Successfully")
            }
        } catch (error) {
            toast.error("Error Occured: Couldn't add to Wallet")
            console.error("Couldn't add to Wallet: ", error);
        }
    }





    return (
        <div className="add-wallet-container">
        <h3>Add to Wallet</h3>
        <form className="add-wallet-form" onSubmit={handleSubmit}>
            <input
                type="number"
                name="amount"
                placeholder="Dollar Amount"
                value={newWalletForm.amount}
                onChange={handleChange}
            />
            <button type="submit">Add to Wallet</button>
        </form>
    </div>
    );
}

export default Wallet;