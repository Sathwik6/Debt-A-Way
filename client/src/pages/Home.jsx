import axios from "axios"
import { Toaster, toast } from "sonner"
import Navbar from "../Components/Navbar"
import { useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import Header from "../Components/Header.jsx"
import NewDebtPosting from "../Components/NewDebtPosting.jsx";

axios.defaults.withCredentials = true;

function Home(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [unfulfilledDebts, setUnfulfilledDebts] = useState([]);

    useEffect(() => {
        const isAuthorized = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/protected`);
                console.log(response.data);
            } catch (error) {
                navigate("/login");
                console.error('Error fetching data:', error);
            }
        };

        isAuthorized();
        fetchData();
    }, []);

    const fetchData = async () => {
        await fetchDebts();
    };

    const fetchDebts = async () =>{
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/debt/unfulfilled-debts`);
            setUnfulfilledDebts(response.data.unfulfilledDebts);
          } catch (error) {
            console.error('Error fetching Unfulfilled Debts:', error);
          }
    };

    return (
        <div>
            <Navbar />
            <Header />
            <NewDebtPosting />

            <div className="full-width-container">
                <h3 className="section-heading">Unfulfilled Debt Postings</h3>
                {unfulfilledDebts.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Interest Rate</th>
                            <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unfulfilledDebts.map(debt => (
                                <tr key={debt.id}>
                                    <td>{debt.borrowerUsername}</td>
                                    <td>{debt.amount}</td>
                                    <td>{debt.interestRate}%</td>
                                    <td>
                                        <button /*onClick={() => handleLendClick(debt.id)}*/>Lend</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No unfulfilled debt postings available.</p>
                )}
            </div>
        </div>

        
    )
}

export default Home;