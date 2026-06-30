import { Router } from "express";
import { list, get, create, update, remove } from "./analisi.controller";
import { AddAnalisiDTO, UpdateAnalisiDTO } from "./analisi.dto";
import { validate } from "../../lib/validation-middleware";

const router = Router();

router.get("/", list);
router.get("/:id", get);
router.post("/", validate(AddAnalisiDTO), create);
router.put("/:id", validate(UpdateAnalisiDTO), update);
router.delete("/:id", remove);

export default router;