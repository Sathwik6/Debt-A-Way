import { PrismaClient, Prisma} from '@prisma/client'

const prisma = new PrismaClient();

//Creates a new debt posting
const debtPosting = async (req, res) =>{
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

const unfulfilledDebts = async (req, res) =>{
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
// const tradeableDebts = async (req, res) =>{
// }

export { debtPosting, unfulfilledDebts };