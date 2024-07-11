import { PrismaClient, Prisma} from '@prisma/client'

const prisma = new PrismaClient();

//gets username (Can query to get all the details.)
const getUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: req.username
            },
            select: {
                username: true,
                email: true,
                walletBalance: true,
                activeDebtsTotal: true,
                activeLendTotal: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const walletBalance = async (req, res) =>{
    try {
        const userWalletBalance = await prisma.user.findFirst({
            where: { username: req.username },
            select: { walletBalance: true }
        });
        console.log("User:", userWalletBalance);
        res.json({message: "Wallet-Balance Fetched Successfully", walletBalance: userWalletBalance.walletBalance});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const activeDebtsTotal= async (req, res) =>{
    try {
        const userActiveDebtsTotal = await prisma.user.findFirst({
            where: { username: req.username },
            select: { activeDebtsTotal: true }
        });
        res.json({message: "Active Debts Total Fetched Successfully", activeDebtsTotal: userActiveDebtsTotal.activeDebtsTotal});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const activeLendTotal = async (req, res) =>{
    try {
        const userActiveLendTotal = await prisma.user.findFirst({
            where: { username: req.username },
            select: { activeLendTotal: true }
        });
        console.log("User:", userActiveLendTotal);
        res.json({message: "Active Lend Total Fetched Successfully", activeLendTotal: userActiveLendTotal.activeLendTotal});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const debts = async (req, res) =>{
    try {
        const debtsOwedByUser = await prisma.debtPosting.findMany({
            where: {
                borrowerUsername: req.username,
                isFulfilled: true,
                isPaid: false
            },
            select: {
                id: true,
                amount: true,
                interestRate: true,
                lenderUsername: true
            }
        });
        res.json({message: "Records Fetched Successfully", debtsOwed: debtsOwedByUser});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const lendings = async (req, res) =>{
    try {
        const incomingDebtsToUser = await prisma.debtPosting.findMany({
            where: {
                lenderUsername: req.username,
                isFulfilled: true,
                isPaid: false,
                isTradable: false,
            },
            select: {
                id: true,
                amount: true,
                interestRate: true,
                borrowerUsername: true
            }
        });
        res.json({message: "Records Fetched Successfully", debtsReceivable: incomingDebtsToUser});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const debtsHistory = async (req, res) =>{
    try {
        const history = await prisma.debtPosting.findMany({
            where: {
                borrowerUsername: req.username,
                isFulfilled: true,
                isPaid: true
            },
            select: {
                id: true,
                amount: true,
                interestRate: true,
                lenderUsername: true
            }
        });
        res.json({message: "Records Fetched Successfully", debtsHistory: history});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const lendingsHistory = async (req, res) =>{
    try {
        const history = await prisma.debtPosting.findMany({
            where: {
                lenderUsername: req.username,
                isFulfilled: true,
                isPaid: true
            },
            select: {
                id: true,
                amount: true,
                interestRate: true,
                borrowerUsername: true
            }
        });
        res.json({message: "Records Fetched Successfully", lendingsHistory: history});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteDebtPosting = async (req, res) =>{
    const { postId } = req.query;
    //console.log(req.params)
    //console.log(postId)
    try {
        const deletePosting = await prisma.debtPosting.delete({
            where: {
              id: postId,
            },
        });
        res.json({message: "debtPosting Deleted Successfully", deleteDebtPosting: deletePosting});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDebtPosting = async (req, res) =>{
    const { postId, postingInfo } = req.body;
    try {
        if (!postId || !postingInfo) {
            throw new Error("Missing postId or postingInfo");
        }

        const updatePosting = await prisma.debtPosting.update({
            where: {
              id: postId,
            },
            // postingInfor is a js object that contains  amount and interestRate
            data: {amount: parseFloat(postingInfo.updatedAmount),
                interestRate: parseFloat(postingInfo.updatedInterestRate),
            },
          })
        res.json({message: "Records updated Successfully", updateDebtPosting: updatePosting});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTradePosting = async (req, res) => {
    const { postId, postingInfo } = req.body;
    try {
        if (!postId || !postingInfo) {
            throw new Error("Missing postId or postingInfo");
        }

        const updatePosting = await prisma.debtPosting.update({
            where: {
              id: postId,
            },
            // postingInfor is a js object that contains  amount and interestRate
            data: {
                tradePrice: parseFloat(postingInfo.updatedTradePrice),
            },
          })
        res.json({message: "Records updated Successfully", updateDebtPosting: updatePosting});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const addWalletBalance = async (req, res) => {
    const { additionAmount } = req.body;
    const amount = parseFloat(additionAmount);

    // validate amount 
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).send('Invalid amount');
    }
    
    try {
        // find previous wallet balance
        const user = await prisma.user.findFirst({
            where: { username: req.username },
            select: { walletBalance: true }
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Calculate the new wallet balance
        const newWalletBalance = parseFloat(user.walletBalance) + amount;

        const [updatedUser, transaction] = await prisma.$transaction([
            // Update the user's wallet balance
            prisma.user.update({
                where: { username: req.username },
                data: { walletBalance: newWalletBalance }
            }),

            // Add to transaction log
            prisma.transactionLogs.create({
                data: {
                    amount: amount,
                    receiver: req.username
                }
            })
        ]);

        res.json({ message: "Added to Wallet Successfully", walletBalance: updatedUser.walletBalance, transaction: transaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// const payDebt = async (req, res) =>{
//     //console.log(req.body)
//     const { postid } = req.body;
//     //console.log(postid)
//     try{
//         const debt = await prisma.debtPosting.findFirst({
//             where: { id: postid},
//             include: {
//                 borrower: true,
//                 lender: true,
//                 //amount:true, //This was not being fetched
//             }
//         });
//         console.log(debt)
//         if (!debt) {
//             return res.status(404).json({message: "debt not found!"});
//         }

//         const {borrower, lender, amount} = debt;

//         //Convert to float to compare
//         const borrowerBalance = parseFloat(borrower.walletBalance, 2);
//         const amt = parseFloat(amount, 2);

//         //Not doing the above conversion will lead to 500 error
//         // check if the borrower has enough in his wallet
//         if (borrowerBalance < amt){
//             return res.status(400).json({message: "insufficient funds! Please add to wallet and try again"})
//         }

//         // transaction
//         await prisma.$transaction(async (prisma) => {

//             // Minus amount from borrower's wallet
//             await prisma.user.update({
//                 where: { username: borrower.username },
//                 data: { walletBalance: { decrement: amt } }
//             });

//             // Add amount to lender's wallet
//             await prisma.user.update({
//                 where: { username: lender.username },
//                 data: { walletBalance: { increment: amt } }
//             });

//             // Mark the debt as paid
//             await prisma.debtPosting.update({
//                 where: { id: postid },
//                 data: { isPaid: true }
//             });

//             //Reduce borrowers debt owed
//             await prisma.user.update({
//                 where: { username: borrower.username },
//                 data: { activeDebtsTotal: { decrement: amt } }
//             });

//             //Reduce lenders debts recievable
//             await prisma.user.update({
//                 where: { username: lender.username },
//                 data: { activeLendTotal: { decrement: amt } }
//             });

//             //Add to transaction log
//             await prisma.transactionLogs.create({
//                 data:{
//                     amount:amt,
//                     sender:borrower.username,
//                     receiver:lender.username
//                 }
//             });
        

//         });

//         res.json({ message: "Payment successful!" });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const payDebt = async (req, res) => {
    const { postid } = req.body;
    
    try {
        const debt = await prisma.debtPosting.findFirst({
            where: { id: postid },
            include: {
                borrower: true,
                lender: true,
            }
        });

        if (!debt) {
            return res.status(404).json({ message: "debt not found!" });
        }

        const { borrower, lender, amount } = debt;

        const borrowerBalance = parseFloat(borrower.walletBalance, 2);
        const amt = parseFloat(amount, 2);

        if (borrowerBalance < amt) {
            return res.status(400).json({ message: "insufficient funds! Please add to wallet and try again" });
        }

        await prisma.$transaction(async (prisma) => {
            await prisma.user.update({
                where: { username: borrower.username },
                data: { walletBalance: { decrement: amt } }
            });

            await prisma.user.update({
                where: { username: lender.username },
                data: { walletBalance: { increment: amt } }
            });

            await prisma.debtPosting.update({
                where: { id: postid },
                data: { isPaid: true }
            });

            await prisma.user.update({
                where: { username: borrower.username },
                data: { activeDebtsTotal: { decrement: amt } }
            });

            await prisma.user.update({
                where: { username: lender.username },
                data: { activeLendTotal: { decrement: amt } }
            });

            await prisma.transactionLogs.create({
                data: {
                    amount: amt,
                    sender: borrower.username,
                    receiver: lender.username
                }
            });
        });

        res.json({ message: "Payment successful!" });
    } catch (error) {
        console.error("Payment failed:", error);
        res.status(500).json({ message: error.message });
    }
};


//Backend logic of lend
const lend = async (req, res) => {
    const { postid } = req.body
    try{
        //Check user
        const user = await prisma.user.findFirst({
            where: { username: req.username }
        });
        if (!user) {
            return res.status(400).json({ message: 'No user found. Invalid Request' });
        }

        //Check posting
        const posting = await prisma.debtPosting.findFirst({
            where: { id: postid }
        });

        if (!posting) {
            return res.status(400).json({ message: 'No posting found. Invalid Request' });
        }

        const userBalance = parseFloat(user.walletBalance, 2);
        const amount = parseFloat(posting.amount, 2);

        //For some reason this is not working
        // const userBalance = parseInt(user.walletBalance);
        // const amount = parseInt(posting.amount);


        //Check walletBalance (Insufficient balance)
        if(userBalance < amount){
            console.log(userBalance)
            console.log(amount)
            console.log(user)
            return res.status(400).json({message: 'Insufficient wallet balance'});
        }

        // Performs transactional updates
        const [lenPost, borrower, lender,transaction] = await prisma.$transaction([
            //Marks the debtPosting as fulfilled and assigns the lender
            prisma.debtPosting.update({
                where: { id: postid },
                data: {
                    isFulfilled: true,
                    lenderUsername: req.username
                },
            }),
            //Deposists/adds the money to borrower 
            prisma.user.update({
                where: { username: posting.borrowerUsername },
                data: {
                    walletBalance: {
                        increment: amount,
                    },
                    activeDebtsTotal: {
                        increment: amount,
                    },
                },
            }),
            //Withdraws/takes-out money from lender
            prisma.user.update({
                where: { username: req.username },
                data: {
                    walletBalance: {
                        decrement: amount,
                    },
                    activeLendTotal: {
                        increment:amount,
                    },
                },
            }),

            //Add to transaction log
            prisma.transactionLogs.create({
                data:{
                    amount:amount,
                    sender:req.username,
                    receiver:posting.borrowerUsername
                }
            })
        ]);

        res.status(200).json({ message: 'Lent Successfully', lend:lenPost,lender,borrower,transaction });
    }catch(error){
        res.status(500).json({ message: 'Failed to lend', error });
    }

    
}

//Backend logic of trade
const trade = async (req, res) => {
    const { postid,tradePrice } = req.body
    console.log(postid);
    try{
        //Check posting
        const posting = await prisma.debtPosting.findFirst({
            where: { id: postid }
        });

        if (!posting) {
            return res.status(400).json({ message: 'No posting found. Invalid Request' });
        }

        if(posting.isTradable==true){
            return res.status(500).json({message: 'You already listed a trade please try update button to update it or use delete button'})
        }

        // Performs transactional updates
        const tradePost= await prisma.debtPosting.update({
                    where: { id: postid },
                    data: {
                        isTradable: true,
                        tradePrice: tradePrice
                    },
        });
        res.status(200).json({ message: 'Trade Posted Successfully', trade:tradePost});
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Failed to post a trade', error });
    }

    
}

const buy = async (req, res) => {
    const { postid} = req.body
    try{
        //Check posting
        const posting = await prisma.debtPosting.findFirst({
            where: { id: postid }
        });

        if (!posting) {
            return res.status(400).json({ message: 'No posting found. Invalid Request' });
        }

        // if(posting.isTradable==true){
        //     return res.status(500).json({message: 'You already listed a trade please try update button to update it or use delete button'})
        // }

        //Fetch the posting
        //Fetch the user
        const user=await prisma.user.findFirst({
            where:{username:req.username}
        });

        if(!user){
            return res.status(400).json({message: 'No user found.'});
        }

        const userBalance = parseFloat(user.walletBalance, 2);
        const tp = parseFloat(posting.tradePrice, 2);
        const amount=parseFloat(posting.amount,2);

        //Ensure users wallet balance is greater than trade price
        if(userBalance<tp){
            return res.status(400).json({message: 'Insuffiecient wallet balance'});
        }

        if(posting.borrowerUsername!=req.username){

            //If yes proceed with transaction
            const [buyer, seller, debtPosting,transaction] = await prisma.$transaction([
                // //Marks the debtPosting as fulfilled and assigns the lender
                // prisma.debtPosting.update({
                //     where: { id: postid },
                //     data: {
                //         isFulfilled: true,
                //         lenderUsername: req.username
                //     },
                // }),
                //Deposists/adds the money to seller 
                prisma.user.update({
                    where: { username: posting.lenderUsername},
                    data: {
                        walletBalance: {
                            increment: tp,
                        },
                        activeLendTotal: {
                            decrement: amount,
                        },
                    },
                }),
                //Withdraws/takes-out money from buyer
                prisma.user.update({
                    where: { username: req.username },
                    data: {
                        walletBalance: {
                            decrement: tp,
                        },
                        activeLendTotal: {
                            increment:amount,
                        },
                    },
                }),


                //Add to transaction log
                prisma.transactionLogs.create({
                    data:{
                        amount:tp,
                        sender:req.username,
                        receiver:posting.lenderUsername
                    }
                }),

                prisma.debtPosting.update({
                    where:{id:postid},
                    data:{
                        lenderUsername:req.username,
                        isTradable:false
                    }
                })
            ]);
            // Performs transactional updates
            //Deduct the user wallet by tradePrice
            //fetch seller
            //Increase sellers wallet by that much
            //Update the lender name

            //Buy : If the borrower buys their own debt? 
            //Then debts owed will be reduced by the posting amount and don't add to debts receivable

            res.status(200).json({ message: 'Trade Posted Successfully', buy:seller,buyer,debtPosting,transaction});
        }else{



            const [user,transaction,debtPosting] = await prisma.$transaction([
                
                
                //Withdraws money from buyer
                prisma.user.update({
                    where: { username: req.username },
                    data: {
                        walletBalance: { decrement: tp},
                        activeDebtsTotal: {decrement: posting.amount},
                    },
                }),

                //Add Money to seller
                prisma.user.update({
                    where: { username: posting.lenderUsername },
                    data: { 
                        walletBalance: { increment: tp},
                        activeLendTotal: { decrement: posting.amount},
                    }

                }),

                //Add to transaction log
                prisma.transactionLogs.create({
                    data:{
                        amount:tp,
                        sender:req.username,
                        receiver:posting.lenderUsername
                    }
                }),

                prisma.debtPosting.update({
                    where:{id:postid},
                    data:{
                        lenderUsername:req.username,
                        isPaid:true,
                        isTradable:false
                    }
                })
            ]);

            
            res.status(200).json({ message: 'Trade Posted Successfully', buy:user,debtPosting,transaction});
        }
       
        // res.status(200).json({ message: 'Trade Posted Successfully', buy:seller,buyer,debtPosting,transaction});
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Failed to post a trade', error });
    }   
}

const deleteTradePosting = async (req, res) =>{
    const { postId } = req.body;
    //console.log(req.params)
    //console.log(postId)
    try {
        const deletePosting = await prisma.debtPosting.update({
            where: {
              id: postId,
            },
            data:{
                isTradable:false
            }
        });
        res.json({message: "debtPosting Deleted Successfully", deleteTradePosting: deletePosting});
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}

const transactionLogs = async (req, res) => {
    try{
        console.log(req.username)
        const userTransactionLogs = await prisma.transactionLogs.findMany({
            where: {
                OR: [
                    {receiver: req.username},
                    {sender: req.username}
                ]
            },
            select: {
                id:true,
                date:true,
                amount:true,
                sender:true,
                receiver:true
            }
        });

        console.log(userTransactionLogs);
        res.json({message: "Transaction Logs Fetched Successfully", transactionLogs: userTransactionLogs});
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}

export {getUser, debts, lendings, walletBalance, activeDebtsTotal, activeLendTotal, debtsHistory, lendingsHistory, deleteDebtPosting, updateDebtPosting, updateTradePosting, addWalletBalance, payDebt, lend, trade, deleteTradePosting,buy, transactionLogs};