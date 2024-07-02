import axios from "axios"
import React, { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography,  Box, TextField  } from "@mui/material";
import './UnfulfilledDebts.css';
import { styled } from "@mui/system";

function unfulfilledDebts(){
    const [unfulfilledDebts, setUnfulfilledDebts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const [inputPage, setInputPage] = useState(1);
    const records = unfulfilledDebts.slice(firstIndex, lastIndex);
    const npage = Math.ceil(unfulfilledDebts.length / recordsPerPage);
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

    // const [newDebtForm, setNewDebtFrom] = useState({
    //     amount: 0,
    //     interestRate: 0.0
    // });


    const handleLendClick = async (event,postid)=>{
        event.preventDefault();
        console.log(postid);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/lend`,
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
            <Typography variant="h6" sx={{fontWeight: '1000', mb: '1rem',}} className="section-heading">Unfulfilled Debt Postings</Typography>
            {unfulfilledDebts.length > 0 ? (
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
                            {unfulfilledDebts.map((debt) => (
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
                                                width: '5.2rem',
                                            }}
                                            onClick={(event) => handleLendClick(event, debt.id)}
                                        >
                                            Lend
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
                <Typography
                sx={{
                    mt: '0.8rem',
                }}>No unfulfilled debt postings available.</Typography>
            )}
        </div>
    );
}

export default unfulfilledDebts;