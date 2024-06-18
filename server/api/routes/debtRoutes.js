import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { debtPosting, unfulfilledDebts,lend,tradableDebts,myDebtPostings,myTradePostings } from "../controller/debtController.js";

const debtRoute = Router()

debtRoute.post('/debt-posting', verifyToken, debtPosting);
debtRoute.get('/unfulfilled-debts', verifyToken, unfulfilledDebts);
debtRoute.post('/lend',verifyToken,lend);
debtRoute.get('/tradable-debts', verifyToken, tradableDebts);
debtRoute.get('/myDebtPostings', verifyToken, myDebtPostings);
debtRoute.get('/myTradePostings', verifyToken, myTradePostings);

export default debtRoute;