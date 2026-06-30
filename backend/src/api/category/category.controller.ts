import { Response, NextFunction } from "express";
import categoryService from "./category.service";
import { TypedRequest } from "../../lib/typed-request.interface";
import { AddCategoryDTO } from "./category.dto";
import { NotFoundError } from "../../errors/not-found-error";

export const listCategories = async (
    req: TypedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const categories = await categoryService.list();
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

export const getCategory = async (
    req: TypedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const category = await categoryService.get(req.params.id);
        if (!category) throw new NotFoundError();
        res.json(category);
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (
    req: TypedRequest<AddCategoryDTO>,
    res: Response,
    next: NextFunction
) => {
    try {
        const category = await categoryService.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (
    req: TypedRequest<AddCategoryDTO>,
    res: Response,
    next: NextFunction
) => {
    try {
        const category = await categoryService.update(req.params.id, req.body);
        if (!category) throw new NotFoundError();
        res.json(category);
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (
    req: TypedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const category = await categoryService.delete(req.params.id);
        if (!category) throw new NotFoundError();
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
