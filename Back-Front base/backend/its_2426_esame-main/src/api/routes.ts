import { Router } from "express";
import authRouter from "./auth/auth.router";
import userRouter from "./user/user.router";
import requestRouter from "./Request/request.router";
import categoryRouter from "./Category/category.router";
import { isAuthenticated } from "../lib/auth/auth.middleware";

const router = Router();

router.use('/requests',isAuthenticated,requestRouter)
router.use('/category',isAuthenticated,categoryRouter);
router.use('/users', isAuthenticated, userRouter);
router.use(authRouter);

export default router;