import { CategoryModel } from './category.model';

export class CategoryService {
  async getCategories() {
    return CategoryModel.find().exec();
  }
}
