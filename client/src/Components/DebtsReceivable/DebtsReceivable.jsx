import axios from "axios"
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from "@mui/material";

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
            <Typography variant="h3" sx={{fontWeight: '1000', mb: '1rem',}} className="section-heading">Lendings</Typography>
            {debtsReceivable.length > 0 ? (
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
                            {debtsReceivable.map((debt) => (
                                <TableRow key={debt.id}>
                                    <TableCell>{debt.borrowerUsername}</TableCell>
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
                                            Trade
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
                }}>No Lendings Available.</Typography>
            )}
        </div> 
    );
}

export default Lendings;