import { PrismaClient, Prisma} from '@prisma/client'

const prisma = new PrismaClient();

const debtPosting = async (req, res) =>{
    const { username, amount, interestRate } = req.body;

    try {
        const user = await prisma.user.findFirst({
            where: { username: username }
        });

        console.log(user);

        if (!user) {
            return res.status(400).json({ message: 'No user found. Invalid Request' });
        }

        const newDebtPosting = await prisma.debtPosting.create({
            data: {
                borrowerUsername: username,
                amount: new Prisma.Decimal(amount),
                interestRate: parseFloat(interestRate)
            }
        });

        res.status(200).json({ message: 'Debt Posted Successfully', debtPosting: newDebtPosting });
    } catch (error) {
        console.error('Error creating debt posting:', error);
        res.status(500).json({ message: 'Debt Posting Failed', error });
    }
};

export { debtPosting };