import axios from "axios"
import React, { useEffect, useState } from "react"

function unfulfilledDebts(){
    const [unfulfilledDebts, setUnfulfilledDebts] = useState([]);

    useEffect(() => {
        const fetchDebts = async () =>{
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/debt/unfulfilled-debts`);
                setUnfulfilledDebts(response.data.unfulfilledDebts);
              } catch (error) {
                console.error('Error fetching Unfulfilled Debts:', error);
              }
        };

        fetchDebts();
    }, []);

    return (
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
    );
}

export default unfulfilledDebts;