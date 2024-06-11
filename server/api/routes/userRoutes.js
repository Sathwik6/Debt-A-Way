import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { debtsOwed, walletBalance, debtsReceivale } from "../controller/userController.js";

const userRoute = Router()

// middleware
userRoute.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.username});
});

//user routes
userRoute.get('/debts-owed', verifyToken, debtsOwed);
userRoute.get('/wallet-balance', verifyToken, walletBalance);
userRoute.get('/debts-receivable', verifyToken, debtsReceivale);



export default userRoute;