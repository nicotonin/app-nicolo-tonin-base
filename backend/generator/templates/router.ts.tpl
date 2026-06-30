import { Router } from "express";
import { list, get, create, update, remove } from "./{{name}}.controller";
import { Add{{Name}}DTO, Update{{Name}}DTO } from "./{{name}}.dto";
import { validate } from "../../lib/validation-middleware";

const router = Router();

router.get("/", list);
router.get("/:id", get);
router.post("/", validate(Add{{Name}}DTO), create);
router.put("/:id", validate(Update{{Name}}DTO), update);
router.delete("/:id", remove);

export default router;