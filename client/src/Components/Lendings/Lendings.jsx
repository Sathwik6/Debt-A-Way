import axios from "axios"
import React, { useEffect, useState } from "react"

function Lendings(){
    const [debtsReceivable, setDebtsReceivable] = useState([]);
    
    // const handleClick = async (event,postid)=>{
    //     
    // }

    useEffect(() => {
        const fetchDebts = async () =>{
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/lendings`);
                setDebtsReceivable(response.data.debtsReceivable);
              } catch (error) {
                console.error('Error fetching Debts Receivable by User:', error);
              }
        };

        fetchDebts();
    }, []);

    return (
        <div className="full-width-container">
            <h3 className="section-heading">Lendings</h3>
            {debtsReceivable.length > 0 ? (
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
                        {debtsReceivable.map(debt => (
                            <tr key={debt.id}>
                                <td>{debt.borrowerUsername}</td>
                                <td>{debt.amount}</td>
                                <td>{debt.interestRate}%</td>
                                <td>
                                    <button onClick={(event) => handleClick(event, debt.id)}>Trade</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No Lendings Available.</p>
            )}
        </div> 
    );
}

export default Lendings;