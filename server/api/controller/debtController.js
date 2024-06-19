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
        const [lenPost, borrower, lender] = await prisma.$transaction([
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
            })
        ]);

        res.status(200).json({ message: 'Lent Successfully', lend:lenPost,lender,borrower });
    }catch(error){
        res.status(500).json({ message: 'Failed to lend', error });
    }

    
}

//Backend Logic to Pay: @ParalyzedPug finish this method
// const pay= async (req,res)=>{
// When a user pays back the debt
// 1.Deduct the users walletBalance by that much (ensure user has valid balance)
// 2. Add that much amount to lenders wallet
// 3. Reduce the users DebtsOwed by that much
// 4. Reduce lenders debts receivable by that much
// 5.Change the isPaid attribute of that particular debt posting to true
// } 

//Backend login of tradeableDebts
const tradableDebts = async (req, res) =>{
    try {
        const tradableDebts = await prisma.debtPosting.findMany({
            where: {
                isFulfilled: true,
                isTradable:true,
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

//Backend Logic for Trade
// const trade=async (req,res)=>{

// }

export { debtPosting, unfulfilledDebts,lend,tradableDebts,myDebtPostings,myTradePostings };