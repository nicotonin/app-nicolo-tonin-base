import { Router } from "express";
import Product from "stream/iter";
import ProductController from "./product.controller";
import { AddProductDTO, UpdateProductDTO } from "./product.dto";
import { validate } from "../../lib/validation-middleware";

const router = Router();

router.get("/", ProductController.list);
router.get("/:id", ProductController.get);
router.post("/",validate(AddProductDTO),ProductController.create);
router.put("/:id",validate(UpdateProductDTO),ProductController.update);
router.delete("/:id", ProductController.remove);

export default router;