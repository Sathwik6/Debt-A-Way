import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { debts, lendings, walletBalance, activeDebtsTotal, activeLendTotal, debtsHistory, lendingsHistory, deleteDebtPosting, updateDebtPosting, addWalletBalance, payDebt } from "../controller/userController.js";

const userRoute = Router()

// middleware
userRoute.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.username});
});

// user get routes
userRoute.get('/debts', verifyToken, debts);
userRoute.get('/lendings', verifyToken, lendings);
userRoute.get('/debts-history', verifyToken, debtsHistory);
userRoute.get('/wallet-balance', verifyToken, walletBalance);
userRoute.get('/activeLendTotal', verifyToken, activeLendTotal);
userRoute.get('/lendings-history', verifyToken, lendingsHistory);
userRoute.get('/activeDebtsTotal', verifyToken, activeDebtsTotal);

// user post routes
userRoute.post('/delete-debtPosting', verifyToken, deleteDebtPosting);
userRoute.post('/update-debtPosting', verifyToken, updateDebtPosting);
userRoute.post('/add-wallet-balance', verifyToken, addWalletBalance);
userRoute.post('/pay-debt', verifyToken, payDebt);




export default userRoute;