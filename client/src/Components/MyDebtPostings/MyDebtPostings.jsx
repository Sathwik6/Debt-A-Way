import axios from "axios"
import React, { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { Toaster, toast } from "sonner"
import './updateListings.css'
import Modal from 'react-modal';
import { ClipLoader } from "react-spinners"

Modal.setAppElement('#root');


function myDebtPostings(){
    const [loading, setLoading] = useState(false);
    const [myDebtPostings, setmyDebtPostings] = useState([]);
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [updateDebtID, setUpdateDebtId] = useState();
    const [formData, setFormData] = useState({
        updatedAmount: "",
        updatedInterestRate: "",
      });

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
    

    function handleUpdate(postId) {
        setIsTradeModalOpen(true);
        setUpdateDebtId(() => postId);
    }


    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
    }

    const handleUpdatedDebt = async (event) =>{
        event.preventDefault();
        // validate user input
        if (!formData.updatedAmount && !formData.updatedInterestRate){
            toast.error('Please enter enter all fields');
            return;
        }else if (!formData.updatedAmount || formData.updatedAmount < 0){
            toast.warning('Please enter valid amount');
            return;
        } else if (!formData.updatedInterestRate){
            toast.warning('Intrest Rate Required!');
            return;
        }
        // send request to back end
        console.log(formData);
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/update-debtPosting`, 
            {postId: updateDebtID, 
            postingInfo:{
                        updatedAmount: parseFloat(formData.updatedAmount),
                        updatedInterestRate: parseFloat(formData.updatedInterestRate),
            }
            });
            console.log(response);

            if (response.status == 200){
                console.log("Post update Successful");
                toast.success("Post update Successful");
                setTimeout(() => {
                    setIsTradeModalOpen(false);
                    location.reload();
                }, 700); 
            }
        }catch (error){
            toast.error("Error Updating Debtposting!")
            console.error('Error Updating Debtposting:', error);
        }finally {
            setLoading(false);
        }
    }

    const handleCloseTradeModal = () => {
        setIsTradeModalOpen(false);
        setUpdateDebtId(null);
        setFormData(() => ({
            updatedAmount: "",
            updatedInterestRate: "",
          }));
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
            <Toaster position="top-center" richColors />
            { 
            loading ? 
            <div className="update-loader"> 
                <ClipLoader 
                    size={60}
                    color={"#7289da"}
                    loading={loading}
                    />  
            </div>
            
            
            :
            <>
            
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
                                            onClick={() => handleUpdate(debt.id)}
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
        
        <Modal
        isOpen={isTradeModalOpen}
        onRequestClose={handleCloseTradeModal}
        className="update-trade-modal"
        >
        <form onSubmit={handleUpdatedDebt}>
            <div className="trade-modal-content">
                <h4 className="trade-modal-header">Update My Debt Posting</h4>
                <input
                        type="number"
                        name="updatedAmount"
                        placeholder="Amount"
                        value={formData.updatedAmount}
                        onChange={handleChange}
                    />
                <input
                        type="number"
                        name="updatedInterestRate"
                        placeholder="Interest Rate"
                        value={formData.updatedInterestRate}
                        onChange={handleChange}
                    />
                <button  className="trade-modal-button trade-modal-button-primary" type="submit">Save</button>
                <button   className="trade-modal-button trade-modal-button-secondary" onClick={handleCloseTradeModal}>Cancel</button>
            </div>
        </form>
         </Modal>   
        </>
        }
        </div>
    );
}

export default myDebtPostings;