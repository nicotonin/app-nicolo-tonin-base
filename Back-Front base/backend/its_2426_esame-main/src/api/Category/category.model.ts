import { Schema, model } from 'mongoose';

export interface Category {
  id?: string;
  description: string;
}

const categorySchema = new Schema<Category>(
  {
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

categorySchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.id;
    return ret;
  },
});

export const CategoryModel = model<Category>('Category', categorySchema);
