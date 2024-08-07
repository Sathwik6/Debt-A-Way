import axios from "axios"
import React, { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography,  Box, TextField  } from "@mui/material";
import '../MyDebtPostings/updateListings.css'
import { styled } from "@mui/system";
import { Toaster, toast } from "sonner"
import Modal from 'react-modal';
import { ClipLoader } from "react-spinners"

Modal.setAppElement('#root');


function myTradePostings(){
    const [loading, setLoading] = useState(false);
    const [myTradePostings, setmyTradePostings] = useState([]);
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [updatedTradeId, setUpdateTradeId] = useState();
    const [formData, setFormData] = useState({
        updatedTradePrice: "",
    }
    );


    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const [inputPage, setInputPage] = useState(1);
    const records = myTradePostings.slice(firstIndex, lastIndex);
    const npage = Math.ceil(myTradePostings.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);

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

    const handleDeleteClick= async (event,postId)=>{
        event.preventDefault();

        try{
            console.log(postId);
            const response=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/delete-TradePosting`,{postId});
            console.log(response)
            if(response.status==200){
                console.log("Trade deletion successful")
                location.reload()
            }
        }catch(error){
            console.log("Trade deletion failed")
        }
    }


    const handleCloseTradeModal = () => {
        setIsTradeModalOpen(false);
        setFormData(() => ({
            updatedTradePrice: "",
          }));
    };

    const handleUpdate = (postId) => {
        setIsTradeModalOpen(true);
        setUpdateTradeId(() => postId);
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
    }


    const handleUpdatedTrade = async (event) => {
        event.preventDefault();
        if (!formData.updatedTradePrice){
            toast.warning('Please enter valid Trade Price');
            return;
        }

        // send request to back end
        console.log(formData);
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user//update-tradePosting`, 
            {postId: updatedTradeId, 
            postingInfo:{
                        updatedTradePrice: parseFloat(formData.updatedTradePrice),
            }
            });
            console.log(response);

            if (response.status == 200){
                console.log("Post update Successful");
                toast.success("Trade Post Updated Successfully!");
                setTimeout(() => {
                    setIsTradeModalOpen(false);
                    location.reload();
                }, 500); 
            }
        }catch (error){
            toast.error("Error Updating Trade posting!")
            console.error('Error Updating Trade posting:', error);
        }finally {
            setLoading(false);
        }
    };

    

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
        <Typography variant="h6" sx={{fontWeight: '1000', mb: '1rem',}} className="section-heading">My Trade Postings</Typography>
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
                                <StyledTableRow key={debt.id}>
                                    <StyledTableCell>{debt.borrowerUsername}</StyledTableCell>
                                    <StyledTableCell>{debt.amount}</StyledTableCell>
                                    <StyledTableCell>{debt.interestRate}%</StyledTableCell>
                                    <StyledTableCell>{debt.tradePrice}</StyledTableCell>
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
                                           onClick={(event) => handleDeleteClick(event,debt.id)}
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
                <Typography
                sx={{
                    mt: '0.8rem',
                }}>You don't have trade postings.</Typography>
            )}
        
        <Modal
        isOpen={isTradeModalOpen}
        onRequestClose={handleCloseTradeModal}
        className="update-trade-modal"
        >
        <form  onSubmit={handleUpdatedTrade}>
            <div className="trade-modal-content">
            <h4 className="trade-modal-header">Update My Trade Posting</h4>
            <input
                     type="number"
                     name="updatedTradePrice"
                     placeholder="Trade Price"
                     value={formData.updatedTradePrice}
                     onChange={handleChange}
                />
            <button  className="trade-modal-button trade-modal-button-primary" type="submit">Save</button>
            <button  className="trade-modal-button trade-modal-button-secondary" onClick={handleCloseTradeModal}>Cancel</button>
                </div>
            </form>
         </Modal>   
         </>
        }
        </div> 
        
    );
}

export default myTradePostings;