import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { debts, lendings, walletBalance, activeDebtsTotal, activeLendTotal, debtsHistory, lendingsHistory } from "../controller/userController.js";

const userRoute = Router()

// middleware
userRoute.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.username});
});

//user routes
userRoute.get('/debts', verifyToken, debts);
userRoute.get('/lendings', verifyToken, lendings);
userRoute.get('/debts-history', verifyToken, debtsHistory);
userRoute.get('/wallet-balance', verifyToken, walletBalance);
userRoute.get('/activeLendTotal', verifyToken, activeLendTotal);
userRoute.get('/lendings-history', verifyToken, lendingsHistory);
userRoute.get('/activeDebtsTotal', verifyToken, activeDebtsTotal);




export default userRoute;