import axios from "axios"
import React, { useEffect, useState } from "react"

function myDebtPostings(){
    const [myDebtPostings, setmyDebtPostings] = useState([]);
    
    // const [newDebtForm, setNewDebtFrom] = useState({
    //     amount: 0,
    //     interestRate: 0.0
    // });

    useEffect(() => {
        const fetchDebtPostings = async () =>{
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/debt/myDebtPostings`);
                setmyDebtPostings(response.data.myDebtPostings);
              } catch (error) {
                console.error('Error fetching your debt postings:', error);
              }
        };

        fetchDebtPostings();
    }, []);

    return (
        <div className="full-width-container">
            <h3 className="section-heading">My Debt Postings</h3>
            {myDebtPostings.length > 0 ? (
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
                        {myDebtPostings.map(debt => (
                            <tr key={debt.id}>
                                <td>{debt.borrowerUsername}</td>
                                <td>{debt.amount}</td>
                                <td>{debt.interestRate}%</td>
                                <td>
                                    <button /*onClick={(event) => handleLendClick(event,debt.id)}*/>Cancel</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>You don't have debt postings.</p>
            )}
        </div> 
    );
}

export default myDebtPostings;