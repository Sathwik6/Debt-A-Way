import { PrismaClient, Prisma} from '@prisma/client'

const prisma = new PrismaClient();

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
                isPaid: false
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
    const { postId } = req.body;
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
        const updatePosting = await prisma.debtPosting.update({
            where: {
              id: postId,
            },
            // postingInfor is a js object that contains  amount and interestRate
            data: postingInfo,
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
        // find previous wallet balance
        const user = await prisma.user.findFirst({
            where: { username: req.username },
            select: { walletBalance: true }
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Calculate the new wallet balance
        const newWalletBalance = parseFloat(user.walletBalance) + parseFloat(additionAmount);

        // Update the user's wallet balance
        const updatedUser = await prisma.user.update({
            where: { username: req.username },
            data: { walletBalance: newWalletBalance }
        });

        res.json({ message: "Added to Wallet Successfully", walletBalance: updatedUser.walletBalance });
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
};

const payDebt = async (req, res) =>{
    //console.log(req.body)
    const { postid } = req.body;
    //console.log(postid)
    try{
        const debt = await prisma.debtPosting.findFirst({
            where: { id: postid},
            include: {
                borrower: true,
                lender: true,
                //amount:true, //This was not being fetched
            }
        });
        console.log(debt)
        if (!debt) {
            return res.status(404).json({message: "debt not found!"});
        }

        const {borrower, lender, amount} = debt;

        //Convert to float to compare
        const borrowerBalance = parseFloat(borrower.walletBalance, 2);
        const amt = parseFloat(amount, 2);

        //Not doing the above conversion will lead to 500 error
        // check if the borrower has enough in his wallet
        if (borrowerBalance < amt){
            return res.status(400).json({message: "insufficient funds! Please add to wallet and try again"})
        }

        // transaction
        await prisma.$transaction(async (prisma) => {

            // Minus amount from borrower's wallet
            await prisma.user.update({
                where: { username: borrower.username },
                data: { walletBalance: { decrement: amt } }
            });

            // Add amount to lender's wallet
            await prisma.user.update({
                where: { username: lender.username },
                data: { walletBalance: { increment: amt } }
            });

            // Mark the debt as paid
            await prisma.debtPosting.update({
                where: { id: postid },
                data: { isPaid: true }
            });

            //Reduce borrowers debt owed
            await prisma.user.update({
                where: { username: borrower.username },
                data: { activeDebtsTotal: { decrement: amt } }
            });

            //Reduce lenders debts recievable
            await prisma.user.update({
                where: { username: lender.username },
                data: { activeLendTotal: { decrement: amt } }
            });
        

        });

        res.json({ message: "Payment successful!" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export {debts, lendings, walletBalance, activeDebtsTotal, activeLendTotal, debtsHistory, lendingsHistory, deleteDebtPosting, updateDebtPosting, addWalletBalance, payDebt};