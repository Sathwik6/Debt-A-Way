import axios from "axios"
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography,  Box, TextField  } from "@mui/material";
import Modal from 'react-modal';

Modal.setAppElement('#root');

function Lendings(){
    const [debtsReceivable, setDebtsReceivable] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const [inputPage, setInputPage] = useState(1);
    const records = debtsReceivable.slice(firstIndex, lastIndex);
    const npage = Math.ceil(debtsReceivable.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [tradePrice,setTradePrice]=useState(0);
    const [selectedDebtForTrade,setSelectedDebtForTrade]=useState(null);
    
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


    const handleTradeDebt = async () => {
        if (!tradePrice) {
          alert('Please enter a trade price');
          return;
        }
    
        console.log(tradePrice);
        try {
          const postid=selectedDebtForTrade
          const response=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/trade`,
                {postid,tradePrice} 
                //{ tradePrice } // Replace 'your_token' with actual token
            );
            console.log(response);
          handleCloseTradeModal();
          // Refresh your debts list here
        } catch (error) {
          console.error('Error trading debt:', error);
        }
    };

    const handleOpenTradeModal = (debtId) => {
        setSelectedDebtForTrade(debtId);
        setIsTradeModalOpen(true);
    };
    
    const handleCloseTradeModal = () => {
        setIsTradeModalOpen(false);
        setSelectedDebtForTrade(null);
        setTradePrice('');
    };

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
            <Typography variant="h3" sx={{fontWeight: '1000', mb: '1rem',}} className="section-heading">Lendings</Typography>
            {debtsReceivable.length > 0 ? (
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
                                            onClick={(event) => handleOpenTradeModal(debt.id)}
                                        >
                                            Trade
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
                }}>No Lendings Available.</Typography>
            )}

            <Modal
                    isOpen={isTradeModalOpen}
                    onRequestClose={handleCloseTradeModal}
                    className="trade-modal-content"
                    // You can add more styling or positioning properties here
                    >
                    <h4 className="trade-modal-header">Set Trade Price</h4>
                    <input
                        type="number"
                        value={tradePrice}
                        onChange={(e) => setTradePrice(e.target.value)}
                        placeholder="Trade Price"
                    />
                    <button  className="trade-modal-button trade-modal-button-primary" onClick={handleTradeDebt}>Confirm Trade</button>
                    <button   className="trade-modal-button trade-modal-button-secondary" onClick={handleCloseTradeModal}>Cancel</button>
            </Modal>
        </div> 
    );
}

export default Lendings;