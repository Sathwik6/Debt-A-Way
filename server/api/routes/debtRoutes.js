import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { debtPosting, unfulfilledDebts } from "../controller/debtController.js";

const debtRoute = Router()

debtRoute.post('/debt-posting', verifyToken, debtPosting);
debtRoute.get('/unfulfilled-debts', verifyToken, unfulfilledDebts);
// debtRoute.get('/tradable-debts', verifyToken, tradeableDebts);

export default debtRoute;