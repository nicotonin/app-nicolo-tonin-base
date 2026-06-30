import { Router } from "express";
import { listCategories, getCategory, createCategory, updateCategory, deleteCategory } from "./category.controller";
import { validate } from "../../lib/validation-middleware";
import { AddCategoryDTO } from "./category.dto";

const router = Router();

router.get('/', listCategories);
router.get('/:id', getCategory);
router.post('/', validate(AddCategoryDTO), createCategory);
router.put('/:id', validate(AddCategoryDTO), updateCategory);
router.delete('/:id', deleteCategory);

export default router;
