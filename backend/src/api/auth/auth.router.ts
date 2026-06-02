import { Router } from "express";
import { validate } from "../../lib/validation-middleware";
import { AddUserDTO } from "./auth.dto";
import { add, login} from "./auth.controller";

const router = Router();

router.post('/register', validate(AddUserDTO), add);
router.post('/login',login);

export default router;