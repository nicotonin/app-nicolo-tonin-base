import { Router } from "express";
import {{Name}} from "stream/iter";
import {{Name}}Controller from "./{{name}}.controller";
import { Add{{Name}}DTO, Update{{Name}}DTO } from "./{{name}}.dto";
import { validate } from "../../lib/validation-middleware";

const router = Router();

router.get("/", {{Name}}Controller.list);
router.get("/:id", {{Name}}Controller.get);
router.post("/",validate(Add{{Name}}DTO),{{Name}}Controller.create);
router.put("/:id",validate(Update{{Name}}DTO),{{Name}}Controller.update);
router.delete("/:id", {{Name}}Controller.remove);

export default router;