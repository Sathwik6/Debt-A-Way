import axios from "axios"
import React, { useEffect, useState } from "react"
import './DebtsOwed.css'

function Debts(){
    const [debtsOwed, setDebtsOwed] = useState([]);
    
    const handleClick = async (event,postid)=>{
        event.preventDefault();


        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/pay-debt`,
                {postid}
            );
            console.log(response);
            // setNewDebtFrom({
            //     amount: 0,
            //     interestRate: 0.0
            // });
            if (response.status === 200){
                //toast("Money Lent Successfully")
                location.reload()
                console.log("Debt Paid Successfully");
            }
        } catch (error) {
            //toast("Lending Failed")
            console.error("Pay Failed:", error);
        }
    }

    useEffect(() => {
        const fetchDebts = async () =>{
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/debts`);
                setDebtsOwed(response.data.debtsOwed);
              } catch (error) {
                console.error('Error fetching Debts Receivable by User:', error);
              }
        };

        fetchDebts();
    }, []);

    return (
        <div className="full-width-container">
            <h3 className="section-heading">Debts Owed</h3>
            {debtsOwed.length > 0 ? (
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
                        {debtsOwed.map(debt => (
                            <tr key={debt.id}>
                                <td>{debt.lenderUsername}</td>
                                <td>{debt.amount}</td>
                                <td>{debt.interestRate}%</td>
                                <td>
                                    <button onClick={(event) => handleClick(event, debt.id)}>Pay</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="message">No Debts Available.</p>
            )}
        </div> 
    );
}

export default Debts;