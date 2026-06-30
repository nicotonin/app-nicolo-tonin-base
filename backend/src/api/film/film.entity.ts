import { Category } from "../category/category.entity";

export type Film = {
    id?: string;
    name: string;
    description: string;
    rating: number;
    releaseDate: Date;
    categoryID: string | Category;
}
