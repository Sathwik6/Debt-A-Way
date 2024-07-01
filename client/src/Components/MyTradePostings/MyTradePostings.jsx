import axios from "axios"
import React, { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from "@mui/material";
import './MyTradePostings.css'

function myTradePostings(){
    const [myTradePostings, setmyTradePostings] = useState([]);
    
    // const [newDebtForm, setNewDebtFrom] = useState({
    //     amount: 0,
    //     interestRate: 0.0
    // });

    useEffect(() => {
        const fetchTradePostings = async () =>{
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/debt/myTradePostings`);
                setmyTradePostings(response.data.myTradePostings);
              } catch (error) {
                console.error('Error fetching your debt postings:', error);
              }
        };

        fetchTradePostings();
    }, []);

    return (
        <div className="full-width-container">
            <h3 className="section-heading">My Trade Postings</h3>
            {myTradePostings.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Interest Rate</th>
                        <th>Trade Price</th>
                        <th></th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myTradePostings.map(debt => (
                            <tr key={debt.id}>
                                <td>{debt.borrowerUsername}</td>
                                <td>{debt.amount}</td>
                                <td>{debt.interestRate}%</td>
                                <td>{debt.tradePrice}%</td>
                                <td>
                                    <button /*onClick={(event) => handleUpdateClick(event,debt.id)}*/>Update</button>
                                </td>
                                <td>
                                    <button /*onClick={(event) => handleLendClick(event,debt.id)}*/>Cancel</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>You don't have trade postings.</p>
            )}
        </div> 
    );
}

export default myTradePostings;