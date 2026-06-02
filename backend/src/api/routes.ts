import { Router } from "express";
import authRouter from "./auth/auth.router";
import userRouter from "./user/user.router";
import { isAuthenticated } from "../lib/auth/auth.middleware";
import productRouter from "./product/product.router";


const router = Router();

router.use('/products',isAuthenticated,productRouter);  
router.use('/auth', authRouter);
router.use('/users', isAuthenticated, userRouter);

export default router;