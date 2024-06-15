import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controller/authController.js";

const router = Router();

router.post('/register', registerUser);
router.post('/logout', logoutUser);
router.post('/login', loginUser);


export default router;
