import axios from "axios"
import { Toaster, toast } from "sonner"
import { useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import './NewDebtPosting.css'

function NewDebtPosting(){
    const [newDebtForm, setNewDebtFrom] = useState({
        amount: 0,
        interestRate: 0.0
    });

    function handleChange(event) {
        const { name, value } = event.target;
        console.log(name)
        setNewDebtFrom((prevData) => ({
          ...prevData,
          [name]: value
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!newDebtForm.amount && !newDebtForm.interestRate){
            toast.warning('Amount/Interest Required!');
            return;
        }else if (!newDebtForm.amount){
            toast.warning('Amount Required!');
            return;
        } else if (!newDebtForm.interestRate){
            toast.error('Interest Rate Required!');
            return;
        }

        //Update this to look good
        if (newDebtForm.amount <= 0){
            toast.warning('Amount Should be atleast 1.');
            return;
        }
        //actually interest rate can be negative but most probably we won't use it in our app.
        if (newDebtForm.interestRate < 0){
            toast.warning('Interest cannot be negative');
            return;
        }

        // send request to back end
        console.log(newDebtForm);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/routes/debt/debt-posting`, 
                newDebtForm
            );
            console.log(response);
            setNewDebtFrom({
                amount: 0,
                interestRate: 0.0
            });
            if (response.status === 200){
                toast.success("Debt Posted Successfully")
            }
            location.reload()
        } catch (error) {
            toast.error("Debt Posting Failed")
            console.error("Debt Posting Failed:", error);
        }
    }

    return (
        <div className="post-debt-container">
            <h3>Post a New Debt</h3>
            <form className="post-debt-form" onSubmit={handleSubmit}>
                <input
                    type="number"
                    name="amount"
                    placeholder="Debt Amount"
                    value={newDebtForm.amount}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="interestRate"
                    placeholder="Interest Rate"
                    value={newDebtForm.interestRate}
                    onChange={handleChange}
                />
                <button type="submit">Post Debt</button>
            </form>
        </div>
    );
}

export default NewDebtPosting;