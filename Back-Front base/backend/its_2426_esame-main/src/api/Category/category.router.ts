import { Router } from 'express';
import { getCategories } from './category.controller';


const router = Router();

router.get('/listCategory', getCategories);

export default router;
