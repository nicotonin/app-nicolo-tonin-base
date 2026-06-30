import { Category } from "./category.entity";
import { CategoryModel } from "./category.model";

export class CategoryService {

    async list(): Promise<Category[]> {
        return await CategoryModel.find();
    }

    async get(id: string): Promise<Category | null> {
        return await CategoryModel.findById(id);
    }

    async create(data: Partial<Category>): Promise<Category> {
        return await CategoryModel.create(data);
    }

    async update(id: string, data: Partial<Category>): Promise<Category | null> {
        return await CategoryModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<Category | null> {
        return await CategoryModel.findByIdAndDelete(id);
    }
}

export default new CategoryService();
