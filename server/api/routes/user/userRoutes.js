import { Router } from "express";
import verifyToken from "../../middleware/authMiddleware.js";
import { debtPosting } from "../../controller/debtPosting.js";

const userRoute = Router()

userRoute.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.username});
});
userRoute.post('/debt-posting', debtPosting);



export default userRoute;