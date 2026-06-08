import { Router } from "express";
import authRouter from "./auth/auth.router";
import userRouter from "./user/user.router";
import { isAuthenticated } from "../lib/auth/auth.middleware";
import productRouter from "./product/product.router";



const router = Router();

router.use('/auth', authRouter);

router.use(isAuthenticated);

router.use('/products', productRouter);
router.use('/users', userRouter);

export default router;