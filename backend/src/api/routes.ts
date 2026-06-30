import { Router } from "express";
import authRouter from "./auth/auth.router";
import userRouter from "./user/user.router";
import filmRouter from "./film/film.router";
import categoryRouter from "./category/category.router";
import { isAuthenticated } from "../lib/auth/auth.middleware";
import analisiRouter from "./analisi/analisi.router";

const router = Router();

router.use('/auth', authRouter);

router.use(isAuthenticated);
router.use('/analisis', analisiRouter);

router.use('/users', userRouter);
router.use('/films', filmRouter);
router.use('/categorys', categoryRouter);

export default router;