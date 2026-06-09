import { Router } from "express";
import authRouter from "./auth/auth.router";
import userRouter from "./user/user.router";
import { isAuthenticated } from "../lib/auth/auth.middleware";



const router = Router();

router.use('/auth', authRouter);

router.use(isAuthenticated);


router.use('/users', userRouter);

export default router;