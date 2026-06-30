import { Schema, model } from 'mongoose';
import { Category } from './category.entity';

const categorySchema = new Schema<Category>({
    name: { type: String, required: true },
    description: { type: String, required: true }
})

categorySchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
        delete (ret as unknown as any)._id;
        delete (ret as unknown as any).__v;
        return ret;
    }
});

categorySchema.set('toObject', {
    virtuals: true,
    transform: (_, ret) => {
        delete (ret as unknown as any)._id;
        delete (ret as unknown as any).__v;
        return ret;
    }
});

export const CategoryModel = model<Category>('Category', categorySchema);
