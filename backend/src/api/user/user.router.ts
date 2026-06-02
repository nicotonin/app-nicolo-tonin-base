import { Router } from "express";
import { isAuthenticated } from "../../lib/auth/auth.middleware";
import { listUsers } from "./user.controller"; 
import { validate } from "../../lib/validation-middleware";
import { QueryListUserDTO } from "./user.dto";

const router = Router();

router.get('/', validate(QueryListUserDTO, 'query'), listUsers); 

export default router;