import { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category.service';

const categoryService = new CategoryService();

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await categoryService.getCategories();

    res.status(200).json(categories);
    return;

  } catch (error) {
    next(error);
  }
};
