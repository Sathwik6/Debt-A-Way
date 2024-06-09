import axios from "axios"
import { Toaster, toast } from "sonner"
import Navbar from "../Components/Navbar"
import { useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"

axios.defaults.withCredentials = true;

function Home(){
    const navigate = useNavigate();
    const [debtsOwed, setDebtsOwed] = useState(0);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);
    const [debtsReceivable, setDebtsReceivable] = useState(0);
    const [newDebtForm, setNewDebtFrom] = useState({
        amount: 0,
        interestRate: 0.0
    });


    useEffect(() => {
        const fetchData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/protected`);
            setUsername(res.data.user.username);
            console.log(res.data);
        } catch (error) {
            navigate("/login");
            console.error('Error fetching data:', error);
        }
        };

        fetchData();
    }, []);

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
        // validate user input
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
        setLoading(true);
        console.log(username);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/debt-posting`, 
                {
                    username: username,
                    amount: newDebtForm.amount,
                    interestRate: newDebtForm.interestRate
                }
            );
            console.log(response);
            if (response.status === 200){
                toast("Debt Posted Successfully")
            }
        } catch (error) {
            toast("Debt Posting Failed")
            console.error("Debt Posting Failed:", error);
        }
        setLoading(false);
    }
    

    return (
        <div>
            <Navbar />
            <div  className="tiles-container">
                <div  className="tile" onClick={() => {/* Navigate to Wallet Balance page */}}>
                    <div className="tile-title">Wallet Balance</div>
                    <div className="tile-number">${walletBalance}</div>
                </div>
                <div  className="tile" onClick={() => {/* Navigate to Debts Owed page */}}>
                    <div className="tile-title">Debts Owed</div>
                    <div className="tile-number">${debtsOwed}</div> 
                </div>
                <div  className="tile" onClick={() => {/* Navigate to Debts Receivable page */}}>
                    <div className="tile-title">Debts Receivable</div>
                    <div className="tile-number"> ${debtsReceivable}</div> 
                </div>
            </div>
            <div className="full-width-container">
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
        </div>
    )
}

export default Home;