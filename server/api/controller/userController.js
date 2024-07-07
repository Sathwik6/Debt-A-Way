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

const activeDebtsTotal = async (req, res) =>{
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
            where: { id: postId },
            // postingInfor is a js object that contains  amount and interestRate
            data: {
                amount: parseFloat(postingInfo.updatedAmount),
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
            where: { id: postId },
            // postingInfor is a js object that contains  amount and interestRate
            data: { tradePrice: parseFloat(postingInfo.updatedTradePrice) },
          })
        res.json({message: "Records updated Successfully", updateDebtPosting: updatePosting});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addWalletBalance = async (req, res) =>{
    const { additionAmount } = req.body;

    // validate amount 
    if (isNaN(additionAmount) || additionAmount < 0) {
        return res.status(400).send('Invalid amount');
    }
    
    try{
        const [ walletBalance ] = await prisma.$transaction([
            //increase the balance
            prisma.user.update({
                where: { username: req.username },
                data: { walletBalance: { increment: additionAmount} }
            }),

            //create a transaction log
            prisma.transactionLogs.create({
                data: {
                    amount: additionAmount,
                    receiver: req.username,
                }
            }),
        ]);
        res.json({ message: "Added to Wallet Successfully", walletBalance: walletBalance });
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
};

const payDebt = async (req, res) =>{
    const { postid } = req.body;
    try{
        //We just need borrowers username and wallet balance, lenders usernmae
        const debt = await prisma.debtPosting.findFirst({
            where: { id: postid },
            select: {
                amount: true,
                borrower: {
                    select: {
                        username: true,
                        walletBalance: true,
                    }
                },
                lenderUsername: true,
            }
        });

        if (!debt) {
            return res.status(404).json({message: "debt not found!"});
        }

        if (debt.borrower.walletBalance < debt.amount){
            return res.status(400).json({message: "Insufficient Funds!"});
        }

        //Pay Transaction
        await prisma.$transaction([
            //Withdraw Money from Borrower
            prisma.user.update({
                where: { username: debt.borrower.username },
                data: { walletBalance: { decrement: debt.amount },
                        activeDebtsTotal: { decrement: debt.amount }
                }
            }),

            //Add Money to Lender
            prisma.user.update({
                where: { username: debt.lenderUsername },
                data: { 
                    walletBalance: { increment: debt.amount },
                    activeLendTotal: { decrement: debt.amount } 
                }
            }),

            //Mark the debtposting as paid
            prisma.debtPosting.update({
                where: { id: postid },
                data: { isPaid: true }
            }),

            //Create a Transaction Log
            prisma.transactionLogs.create({
                data: {
                    amount: debt.amount,
                    receiver: debt.lenderUsername,
                    sender: debt.borrower.username
                }
            }),
        ]);
        res.json({ message: "Payment successful!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Backend logic of lend
const lend = async (req, res) => {
    const { postid } = req.body
    try{
        //Check posting
        const posting = await prisma.debtPosting.findFirst({
            where: { id: postid },
            select: { 
                amount: true,
                borrowerUsername: true }
        });

        if (!posting) {
            return res.status(400).json({ message: 'No posting found. Invalid Request' });
        }

        //No need to check if the user exists as we are verifying the user.
        const user = await prisma.user.findFirst({
            where: { username: req.username },
            select:{ walletBalance: true }
        });

        //Check walletBalance (Insufficient balance)
        if(user.walletBalance < posting.amount){
            return res.status(400).json({message: 'Insufficient wallet balance'});
        }
        console.log(user);
        console.log(posting);

        // Performs transactional updates
        await prisma.$transaction([
            //Marks the debtPosting as fulfilled and assigns the lender
            prisma.debtPosting.update({
                where: { id: postid },
                data: {
                    isFulfilled: true,
                    lenderUsername: req.username
                },
            }),

            //Add the money to borrower 
            prisma.user.update({
                where: { username: posting.borrowerUsername },
                data: {
                    walletBalance: { increment: posting.amount },
                    activeDebtsTotal: { increment: posting.amount },
                },
            }),

            //Withdraw money from lender
            prisma.user.update({
                where: { username: req.username },
                data: {
                    walletBalance: { decrement: posting.amount },
                    activeLendTotal: { increment: posting.amount },
                },
            }),

            prisma.transactionLogs.create({
                data: {
                    amount: posting.amount,
                    receiver: posting.borrowerUsername,
                    sender: req.username
                }
            })
        ]);
        res.status(200).json({ message: 'Lent Successfully'});
    }catch(error){
        res.status(500).json({ message: 'Failed to lend', error });
    }  
}

//Backend logic of trade
const trade = async (req, res) => {
    const { postid, tradePrice } = req.body
    try{
        const posting = await prisma.debtPosting.findFirst({
            where: { id: postid }
        });

        if (!posting) {
            return res.status(400).json({ message: 'No posting found. Invalid Request' });
        }

        if(posting.isTradable){
            return res.status(500).json({message: 'You already listed a trade please try update button to update it or use delete button'})
        }

        // Performs transactional updates
        const tradePost = await prisma.debtPosting.update({
                    where: { id: postid },
                    data: {
                        isTradable: true,
                        tradePrice: parseFloat(tradePrice, 2)
                    },
        });
        res.status(200).json({ message: 'Trade Posted Successfully', trade: tradePost});
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Failed to post a trade', error });
    }

    
}

const buy = async (req, res) => {
    const { postid } = req.body
    try{
        //Check posting
        const posting = await prisma.debtPosting.findFirst({
            where: { id: postid },
            select: { 
                amount: true,
                tradePrice: true, 
                lenderUsername: true
            }
        });

        if (!posting) {
            return res.status(400).json({ message: 'No posting found. Invalid Request' });
        }

        const user = await prisma.user.findFirst({
            where: { username: req.username },
            select: { walletBalance: true }
        });

        if(user.walletBalance < posting.tradePrice){
            return res.status(400).json({message: 'Insuffiecient wallet balance'});
        }

        await prisma.$transaction([
            //Deposists/adds the money to seller 
            prisma.user.update({
                where: { username: posting.lenderUsername},
                data: {
                    walletBalance: { increment: posting.tradePrice },
                    activeLendTotal: {decrement: posting.amount },
                },
            }),

            //Withdraw Money from Buyer
            prisma.user.update({
                where: { username: req.username },
                data: {
                    walletBalance: { decrement: posting.tradePrice },
                    activeLendTotal: { increment: posting.amount },
                },
            }),

            prisma.debtPosting.update({
                where:{ id: postid },
                data:{ 
                    isTradable: false,
                    lenderUsername: req.username
                }
            }),

            prisma.transactionLogs.create({
                data: {
                    amount: posting.tradePrice,
                    receiver: posting.lenderUsername,
                    sender: req.username
                }
            })
        ]);
        res.status(200).json({ message: 'Buyed A Trade Successfully'});
    }catch(error){
        res.status(500).json({ message: 'Failed to buy a trade', error });
    }

    
}

const deleteTradePosting = async (req, res) =>{
    const { postId } = req.body;
    try {
        const deletePosting = await prisma.debtPosting.update({
            where: { id: postId },
            data:{ isTradable: false }
        });
        res.json({message: "debtPosting Deleted Successfully", deleteTradePosting: deletePosting});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const transactionLogs = async (req, res) => {
    try{
        const userTransactionLogs = await prisma.transactionLogs.findMany({
            where: {
                OR: [
                    {receiver: req.username},
                    {sender: req.username}
                ]
            }
        });
        res.json({message: "Transaction Logs Fetched Successfully", transactionLogs: userTransactionLogs});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export {getUser, debts, lendings, walletBalance, activeDebtsTotal, activeLendTotal, debtsHistory, lendingsHistory, deleteDebtPosting, updateDebtPosting, updateTradePosting, addWalletBalance, payDebt, lend, trade, deleteTradePosting,buy, transactionLogs};