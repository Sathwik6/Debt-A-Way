import { Router } from "express";
import verifyToken from "../../middleware/authMiddleware.js";

const userRoute = Router()

userRoute.get('/protected', verifyToken, (req, res) => {
    console.log(req.username);
    res.json({ message: 'This is a protected route', user: req.username});
});



export default userRoute;