import { PrismaClient, Prisma} from '@prisma/client'

const prisma = new PrismaClient();

//Creates a new debt posting
const debtPosting = async (req, res) => {
    const { amount, interestRate } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: { username: req.username }
        });
        if (!user) {
            return res.status(400).json({ message: 'No user found. Invalid Request' });
        }
        const newDebtPosting = await prisma.debtPosting.create({
            data: {
                borrowerUsername: req.username,
                amount: new Prisma.Decimal(amount),
                interestRate: parseFloat(interestRate)
            }
        });
        res.status(200).json({ message: 'Debt Posted Successfully', debtPosting: newDebtPosting });
    } catch (error) {
        res.status(500).json({ message: 'Debt Posting Failed', error });
    }
};

const unfulfilledDebts = async (req, res) => {
    try {
        const currentUnfulfilledDebts = await prisma.debtPosting.findMany({
            where: {
                isFulfilled: false,
                borrowerUsername: { not: req.username }
            },
            select: {
                id: true,
                amount: true,
                interestRate: true,
                borrowerUsername: true
            }
        });
        res.status(200).json({ message: 'Unfulfilled Debts Fetched Successfully', unfulfilledDebts: currentUnfulfilledDebts });
    } catch (error) {
        res.status(500).json({ message: 'Fetching Unfulfilled Debts Failed', error });
    }

};

//Backend login of tradeableDebts
const tradableDebts = async (req, res) =>{
    try {
        const tradableDebts = await prisma.debtPosting.findMany({
            where: {
                isFulfilled: true,
                isTradable:true,
                lenderUsername: { not: req.username } //Commented this out to allow users to buyout their own debt
            },
            select: {
                id: true,
                amount: true,
                interestRate: true,
                borrowerUsername: true,
                tradePrice:true
            }
        });
        res.status(200).json({ message: 'Tradeable Debts Fetched Successfully', tradableDebts: tradableDebts });
    } catch (error) {
        res.status(500).json({ message: 'Fetching Tradable Debts Failed', error });
    }
}

//Backend login of tradeableDebts
const myTradePostings = async (req, res) =>{
    try {
        const myTradePostings = await prisma.debtPosting.findMany({
            where: {
                isFulfilled: true,
                isTradable:true,
                lenderUsername:req.username
                //borrowerUsername: { not: req.username } Commented this out to allow users to buyout their own debt
            },
            select: {
                id: true,
                amount: true,
                interestRate: true,
                borrowerUsername: true,
                tradePrice:true
            }
        });
        res.status(200).json({ message: 'Your Trade Postings Fetched Successfully', myTradePostings: myTradePostings });
    } catch (error) {
        res.status(500).json({ message: 'Fetching your Trade Postings Failed', error });
    }
}

const myDebtPostings = async (req, res) =>{
    try {
        const myDebtPostings = await prisma.debtPosting.findMany({
            where: {
                isFulfilled: false,
                borrowerUsername: req.username
            },
            select: {
                id: true,
                amount: true,
                interestRate: true,
                borrowerUsername: true
            }
        });
        res.status(200).json({ message: 'Your Debt Postings Fetched Successfully', myDebtPostings: myDebtPostings });
    } catch (error) {
        res.status(500).json({ message: 'Fetching your debt postings Failed', error });
    }

};

export { debtPosting, unfulfilledDebts,tradableDebts,myDebtPostings,myTradePostings };

