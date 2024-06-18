import axios from "axios"
import React, { useEffect, useState } from "react"

function TradableDebts(){
    const [TradableDebts, setTradableDebts] = useState([]);
    
    // const [newDebtForm, setNewDebtFrom] = useState({
    //     amount: 0,
    //     interestRate: 0.0
    // });

    useEffect(() => {
        const fetchTradePostings = async () =>{
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/debt/tradable-debts`);
                setTradableDebts(response.data.tradableDebts);
              } catch (error) {
                console.error('Error fetching your debt postings:', error);
              }
        };

        fetchTradePostings();
    }, []);

    return (
        <div className="full-width-container">
            <h3 className="section-heading">Trade Postings</h3>
            {TradableDebts.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Interest Rate</th>
                        <th>Trade Price</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TradableDebts.map(debt => (
                            <tr key={debt.id}>
                                <td>{debt.borrowerUsername}</td>
                                <td>{debt.amount}</td>
                                <td>{debt.interestRate}%</td>
                                <td>{debt.tradePrice}%</td>
                                <td>
                                    <button /*onClick={(event) => handleLendClick(event,debt.id)}*/>Buy</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No trade postings available.</p>
            )}
        </div> 
    );
}

export default TradableDebts;