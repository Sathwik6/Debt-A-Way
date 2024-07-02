import axios from "axios"
import React, { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography,  Box, TextField  } from "@mui/material";
import './MyTradePostings.css'

function myTradePostings(){
    const [myTradePostings, setmyTradePostings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const [inputPage, setInputPage] = useState(1);
    const records = myTradePostings.slice(firstIndex, lastIndex);
    const npage = Math.ceil(myTradePostings.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);

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
        <Typography variant="h3" sx={{fontWeight: '1000', mb: '1rem',}} className="section-heading">My Trade Postings</Typography>
            {myTradePostings.length > 0 ? (
                <>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: 'bolder', alignItems: 'center', fontSize: '1rem'}}>Name</TableCell>
                                <TableCell sx={{fontWeight: 'bolder', alignItems: 'center', fontSize: '1rem'}}>Amount</TableCell>
                                <TableCell sx={{fontWeight: 'bolder', alignItems: 'center', fontSize: '1rem'}}>Interest Rate</TableCell>
                                <TableCell sx={{fontWeight: 'bolder', alignItems: 'center', fontSize: '1rem'}}>Trade Price</TableCell>
                                <TableCell sx={{fontWeight: 'bolder', alignItems: 'center', fontSize: '1rem'}}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {myTradePostings.map((debt) => (
                                <TableRow key={debt.id}>
                                    <TableCell>{debt.borrowerUsername}</TableCell>
                                    <TableCell>{debt.amount}</TableCell>
                                    <TableCell>{debt.interestRate}%</TableCell>
                                    <TableCell>{debt.tradePrice}%</TableCell>
                                    <TableCell>
                                    <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: 'rgb(114, 137, 218)',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: 'rgb(90, 107, 168)',
                                                },
                                                mr: '3rem',
                                            }}
                                            /*onClick={(event) => handleUpdateClick(event,debt.id)} */
                                        >
                                            Update
                                        </Button>

                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: 'rgb(114, 137, 218)',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: 'rgb(90, 107, 168)',
                                                }
                                            }}
                                           /*onClick={(event) => handleLendClick(event,debt.id)}*/
                                        >
                                            Cancel
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
                }}>You don't have trade postings.</Typography>
            )}

        </div> 
    );
}

export default myTradePostings;