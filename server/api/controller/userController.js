import { PrismaClient, Prisma} from '@prisma/client'

const prisma = new PrismaClient();

const debtsOwed = async (req, res) =>{
    try {
        const debtsOwedByUser = await prisma.debtPosting.findMany({
            where: {
                borrowerUsername: req.username,
                isFulfilled: true,
                isPaid: false
            },
            select: {
                amount: true
            }
        });
        res.json({message: "Records Fetched Successfully", debtsOwed: debtsOwedByUser});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const walletBalance = async (req, res) =>{
    try {
        const userWalletBalance = await prisma.user.findFirst({
            where: { username: req.username },
            select: { walletBalance: true }
        });
        res.json({message: "Wallet-Balance Fetched Successfully", walletBalance: userWalletBalance.walletBalance});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const debtsReceivable = async (req, res) =>{
    try {
        const incomingDebtsToUser = await prisma.debtPosting.findMany({
            where: {
                lenderUsername: req.username,
                isFulfilled: true,
                isPaid: false
            },
            select: {
                amount: true
            }
        });
        res.json({message: "Records Fetched Successfully", debtsReceivable: incomingDebtsToUser});
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
        res.json({message: "Active Lend Total Fetched Successfully", activeLendTotal: userActiveLendTotal.activeLendTotal});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export {debtsOwed, walletBalance, debtsReceivable};