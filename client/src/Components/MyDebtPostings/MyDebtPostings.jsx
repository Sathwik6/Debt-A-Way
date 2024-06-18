import axios from "axios"
import React, { useEffect, useState } from "react"

function myDebtPostings(){
    const [myDebtPostings, setmyDebtPostings] = useState([]);
    
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
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/delete-debtPosting`,
                {postId}
            );
            console.log(response);

            if (response.status == 200){
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
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/update-debtPosting`, 
                {postId});
            console.log(response);

            if (response.status == 200){
                console.log("Post deletion Successful");
            }
        }catch (error){
            console.error('Error Deleting Debtposting:', error);
        }
    }

    return (
        <div className="full-width-container">
            <h3 className="section-heading">My Debt Postings</h3>
            {myDebtPostings.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Interest Rate</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myDebtPostings.map(debt => (
                            <tr key={debt.id}>
                                <td>{debt.borrowerUsername}</td>
                                <td>{debt.amount}</td>
                                <td>{debt.interestRate}%</td>
                                <td>
                                    <button onClick={(event) => handleCancel(event, debt.id)}>Cancel</button>
                                    <button onClick={(event) => handleUpdate(event, debt.id)}>Update</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>You don't have debt postings.</p>
            )}
        </div> 
    );
}

export default myDebtPostings;