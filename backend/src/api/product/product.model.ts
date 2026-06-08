import { model, Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true }
  },
  { timestamps: true }
);

productSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete (ret as unknown as any)._id;
    delete (ret as unknown as any).__v;
    return ret;
  }
});

productSchema.set("toObject", {
  virtuals: true,
  transform: (_, ret) => {
    delete (ret as unknown as any)._id;
    delete (ret as unknown as any).__v;
    return ret;
  }
});

export const ProductModel = model("Product", productSchema);