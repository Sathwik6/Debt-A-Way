import axios from "axios"
import React, { useEffect, useState } from "react"
import './DebtsOwed.css'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, TextField  } from "@mui/material";

function Debts(){
    const [debtsOwed, setDebtsOwed] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const [inputPage, setInputPage] = useState(1);
    const records = debtsOwed.slice(firstIndex, lastIndex);
    const npage = Math.ceil(debtsOwed.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1)
    
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


    function nextPage() {
        if (currentPage < npage) {
            setCurrentPage(currentPage + 1);
            setInputPage(currentPage + 1);
        }
    }

    function prevPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setInputPage(currentPage - 1);
        }
    }

    function handlePageInputChange(event) {
        setInputPage(event.target.value);
    }

    function handlePageInputBlur() {
        const page = parseInt(inputPage, 10);
        if (page >= 1 && page <= npage) {
            setCurrentPage(page);
        } else {
            setInputPage(currentPage);
        }
    }

    return (
        <div className="full-width-container">
            <Typography variant="h3" sx={{fontWeight: '1000', mb: '1rem',}} className="section-heading">Debts Owed</Typography>
            {debtsOwed.length > 0 ? (
                <>
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

                <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <Button
                    variant="contained"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    sx={{
                        backgroundColor: 'rgb(114, 137, 218)',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: 'rgb(90, 107, 168)',
                        },
                        mx: 1,
                    }}
                >
                    Prev
                </Button>
                <TextField
                    type="number"
                    value={inputPage}
                    onChange={handlePageInputChange}
                    onBlur={handlePageInputBlur}
                    sx={{ width: '60px', border:'none', mx: 1, }}
                    inputProps={{ min: 1, max: npage }}
                />
                <Button
                    variant="contained"
                    onClick={nextPage}
                    disabled={currentPage === npage}
                    sx={{
                        backgroundColor: 'rgb(114, 137, 218)',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: 'rgb(90, 107, 168)',
                        },
                        mx: 1,
                    }}
                >
                    Next
                </Button>
                </Box>
                </>
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