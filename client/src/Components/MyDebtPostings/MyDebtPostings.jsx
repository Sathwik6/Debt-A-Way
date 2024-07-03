import axios from "axios"
import React, { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, TextField } from "@mui/material";
import { styled } from "@mui/system";
import './MyDebtPostings.css'

function myDebtPostings(){
    const [myDebtPostings, setmyDebtPostings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const [inputPage, setInputPage] = useState(1);
    const records = myDebtPostings.slice(firstIndex, lastIndex);
    const npage = Math.ceil(myDebtPostings.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1)

    const StyledTableCell = styled(TableCell)({
        padding: '4px 8px',
        fontSize: '0.875rem',
      });

    const StyledTableRow = styled(TableRow)({
        '&:nth-of-type(even)': {
          backgroundColor: '#f9f9f9',
        },
        '&:hover': {
            backgroundColor: 'yellow',
        },
    });
     
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

    const handleCancel = async (event, postId) => {
        /*
        Read this:
            Now I am directly deleteing the debtposting wne the use clicks the cancel button
            but need to ask for confirmation.
        */

        event.preventDefault()
        try {
            console.log(postId)
            //Had to change the url as axios delete doesn't take body in the same way as post requests
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/delete-debtPosting`,{
                params: { postId },
            });
            console.log(response);

            if (response.status == 200){
                location.reload()
                console.log("Post deletion Successful");
            }
        }catch (error){
            console.error('Error Deleting Debtposting:', error);
        }
    }

    const handleUpdate = async (event, postId) => {
        /*
        Read this:
            send the details as a json respoinse to the api call. 
            Example:
            {
                postid: "",
                {
                    amount: "",
                    interestRate: ""
                }
            }

        Also show a cancel button when clicked on update
        */
        event.preventDefault()
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/update-debtPosting`, 
                {postId});
            console.log(response);

            if (response.status == 200){
                console.log("Post update Successful");
            }
        }catch (error){
            console.error('Error Updating Debtposting:', error);
        }
    }


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
            <Typography variant="h6" sx={{ fontWeight: '1000', mb: '1rem' }} className="section-heading">My Debt Postings</Typography>
            {myDebtPostings.length > 0 ? (
                <>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bolder', alignItems: 'center', fontSize: '1rem' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bolder', alignItems: 'center', fontSize: '1rem' }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 'bolder', alignItems: 'center', fontSize: '1rem' }}>Interest Rate</TableCell>
                                <TableCell sx={{ fontWeight: 'bolder', alignItems: 'center', fontSize: '1rem' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {records.map((debt) => (
                                <StyledTableRow key={debt.id}>
                                    <StyledTableCell>{debt.borrowerUsername}</StyledTableCell>
                                    <StyledTableCell>{debt.amount}</StyledTableCell>
                                    <StyledTableCell>{debt.interestRate}%</StyledTableCell>
                                    <StyledTableCell>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: 'rgb(114, 137, 218)',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: 'rgb(90, 107, 168)',
                                                },
                                                height: '3.8vh',
                                                mb: '0.1rem',
                                                mr: '3rem', 
                                            }}
                                            onClick={(event) => handleCancel(event, debt.id)}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: 'rgb(114, 137, 218)',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: 'rgb(90, 107, 168)',
                                                },
                                                height: '3.8vh',
                                                mb: '0.1rem',
                                                width: '5.2rem',

                                            }}
                                            onClick={(event) => handleUpdate(event, debt.id)}
                                        >
                                            Update
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
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
                        height: '3.8vh',
                        width: '4rem',
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
                        height: '3.8vh',
                        width: '4rem',
                    }}
                >
                    Next
                </Button>
            </Box>
            </>
            ) : (
                <Typography sx={{ mt: '0.8rem' }}>You don't have debt postings.</Typography>
            )}
            
        </div>
    );
}

export default myDebtPostings;