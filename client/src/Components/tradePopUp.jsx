import React,{useState} from "react"
import axios from "axios"


function tradePopUp(props){
    const[tradePrice,setTradePrice]=useState();

    const handleSubmit= async (event)=>{
        event.preventDefault();
        try{
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/trade`,
                {props.postid,tradePrice}
            );

            console.log(response);
            alert("Trade posted successfully");
        }catch(error){
            console.log(error);
        }
    } 
    
    return (<div>
            <Form onSubmit={handleSubmit}>
                <input type="text" name="tradePrice" placeholder="tradePrice" onChange={(e) => setTradePrice(e.target.value)} value={tradePrice}/>
                <button type="submit">Submit</button>
            </Form>
            </div>);
}

export default tradePopUp


