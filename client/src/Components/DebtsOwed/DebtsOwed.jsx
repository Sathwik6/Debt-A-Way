import axios from "axios"
import React, { useEffect, useState } from "react"
import './DebtsOwed.css'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from "@mui/material";

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
            <Typography variant="h3" sx={{fontWeight: '1000', mb: '1rem',}} className="section-heading">Debts Owed</Typography>
            {debtsOwed.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow >
                                <TableCell sx={{fontWeight: 'bolder', alignItems: 'center', fontSize: '1rem'}} >Name</TableCell>
                                <TableCell sx={{fontWeight: 'bolder', alignItems: 'center', fontSize: '1rem'}}>Amount</TableCell>
                                <TableCell sx={{fontWeight: 'bolder', alignItems: 'center', fontSize: '1rem'}}>Interest Rate</TableCell>
                                <TableCell sx={{fontWeight: 'bolder', alignItems: 'center', fontSize: '1rem'}}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {debtsOwed.map((debt) => (
                                <TableRow key={debt.id}>
                                    <TableCell>{debt.lenderUsername}</TableCell>
                                    <TableCell>{debt.amount}</TableCell>
                                    <TableCell>{debt.interestRate}%</TableCell>
                                    <TableCell>
                                    <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: 'rgb(114, 137, 218)',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: 'rgb(90, 107, 168)',
                                                }
                                            }}
                                           onClick={(event) => handleClick(event, debt.id)}
                                        >
                                            Pay
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography
                sx={{
                    mt: '0.8rem',
                }}>No Debts Available.</Typography>
            )}
        
        </div> 
    );
}

export default Debts;