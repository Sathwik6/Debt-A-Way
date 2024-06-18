import axios from "axios"
import React, { useEffect, useState } from "react"

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
            <h3 className="section-heading">Unfulfilled Debt Postings</h3>
            {unfulfilledDebts.length > 0 ? (
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
                        {unfulfilledDebts.map(debt => (
                            <tr key={debt.id}>
                                <td>{debt.borrowerUsername}</td>
                                <td>{debt.amount}</td>
                                <td>{debt.interestRate}%</td>
                                <td>
                                    <button onClick={(event) => handleLendClick(event, debt.id)}>Lend</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No unfulfilled debt postings available.</p>
            )}
        </div> 
    );
}

export default unfulfilledDebts;