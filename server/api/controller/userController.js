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


export {debts, lendings, walletBalance, activeDebtsTotal, activeLendTotal, debtsHistory, lendingsHistory, deleteDebtPosting, updateDebtPosting};