import axios from "axios"
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography,  Box, TextField  } from "@mui/material";
import { styled } from "@mui/system";


function Lendings(){
    const [debtsReceivable, setDebtsReceivable] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const [inputPage, setInputPage] = useState(1);
    const records = debtsReceivable.slice(firstIndex, lastIndex);
    const npage = Math.ceil(debtsReceivable.length / recordsPerPage);
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
        <Typography variant="h6" sx={{ fontWeight: '1000', mb: '1rem' }} className="section-heading">Lendings</Typography>
        {debtsReceivable.length > 0 ? (
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
                  {debtsReceivable.map((debt) => (
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
                          onClick={(event) => handleClick(event, debt.id)}
                        >
                          Trade
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
                sx={{ width: '60px', border: 'none', mx: 1 }}
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
          <Typography sx={{ mt: '0.8rem' }}>No Lendings Available.</Typography>
        )}
      </div>
    );
  }

export default Lendings;