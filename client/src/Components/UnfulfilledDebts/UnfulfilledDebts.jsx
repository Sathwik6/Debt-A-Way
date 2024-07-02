import axios from "axios"
import React, { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from "@mui/material";
import './UnfulfilledDebts.css'

function unfulfilledDebts(){
    const [unfulfilledDebts, setUnfulfilledDebts] = useState([]);
    
    // const [newDebtForm, setNewDebtFrom] = useState({
    //     amount: 0,
    //     interestRate: 0.0
    // });


    const handleLendClick = async (event,postid)=>{
        event.preventDefault();


        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/routes/debt/lend`,
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
                console.log("Money Lent Successfully");
            }
        } catch (error) {
            //toast("Lending Failed")
            console.error("Lending Failed:", error);
        }
    }

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
            <Typography variant="h3" sx={{fontWeight: '1000', mb: '1rem',}} className="section-heading">Unfulfilled Debt Postings</Typography>
            {unfulfilledDebts.length > 0 ? (
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
                            {unfulfilledDebts.map((debt) => (
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
                                            onClick={(event) => handleLendClick(event, debt.id)}
                                        >
                                            Lend
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
                }}>No unfulfilled debt postings available.</Typography>
            )}
        </div>
    );
}

export default unfulfilledDebts;