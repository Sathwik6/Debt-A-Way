import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { debtPosting, unfulfilledDebts, tradableDebts, myDebtPostings, myTradePostings } from "../controller/debtController.js";

const debtRoute = Router()

//Post Routes
debtRoute.post('/debt-posting', verifyToken, debtPosting);

//Get Routes
debtRoute.get('/tradable-debts', verifyToken, tradableDebts);
debtRoute.get('/myDebtPostings', verifyToken, myDebtPostings);
debtRoute.get('/myTradePostings', verifyToken, myTradePostings);
debtRoute.get('/unfulfilled-debts', verifyToken, unfulfilledDebts);

export default debtRoute;